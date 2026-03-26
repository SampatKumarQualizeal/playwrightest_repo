import { Page, Locator, test, expect } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";
import { Logger } from "@/logger/logger.js";

/**
 * Page Object for Contacts page.
 * Encapsulates all UI interactions for creating a contact.
 */
export class ContactsPage extends BasePage {
  private readonly contactsLink: Locator;
  private readonly createButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly phoneInput: Locator;
  private readonly companyInput: Locator;
  private readonly emailInput: Locator;
  private readonly saveButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.contactsLink = page.locator('a[href="/contacts"]');
    this.createButton = page.locator('a[href="/contacts/new"], button:has-text("Create")');
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.companyInput = page.locator('input[name="company"]');
    this.emailInput = page.locator('input[name="email"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.successMessage = page.locator('div[role="alert"], div.ui.positive.message, div:has-text("successfully")');
  }

  /**
   * Navigates to the contacts list page and waits for the page to be fully loaded.
   */
  async navigateToContactsList(): Promise<void> {
    await test.step('Navigate to Contacts List', async () => {
      Logger.info('Navigating to Contacts List page', { selector: 'a[href="/contacts"]' });
      try {
        await this.contactsLink.waitFor({ state: 'visible' });
        await Promise.all([
          this.page.waitForNavigation({ waitUntil: 'networkidle' }),
          this.contactsLink.click()
        ]);
        Logger.info('Navigation to Contacts List completed');
        // Wait for Create button as key UI element
        await this.createButton.waitFor({ state: 'visible' });
        Logger.info('Contacts List page loaded and Create button visible');
      } catch (error) {
        Logger.error('Failed to navigate to Contacts List', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Clicks the Create Contact button and waits for the contact form to be visible.
   */
  async clickCreateContact(): Promise<void> {
    await test.step('Click Create Contact', async () => {
      Logger.info('Clicking Create Contact button', { selector: 'a[href="/contacts/new"] or button:has-text("Create")' });
      try {
        await this.createButton.waitFor({ state: 'visible' });
        await this.createButton.click();
        Logger.info('Clicked Create Contact button');
        await this.firstNameInput.waitFor({ state: 'visible' });
        Logger.info('Contact creation form is now visible');
      } catch (error) {
        Logger.error('Failed to click Create Contact', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Fills the contact creation form fields.
   * @param firstName First name of the contact
   * @param lastName Last name of the contact
   * @param phone Phone number
   * @param company Company name
   * @param email Email address
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill Contact Form', async () => {
      Logger.info('Filling contact form', { firstName, lastName, phone, company, email });
      try {
        await this.firstNameInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.firstNameInput, firstName);
        Logger.info('Filled First Name', { firstName });

        await this.lastNameInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.lastNameInput, lastName);
        Logger.info('Filled Last Name', { lastName });

        await this.phoneInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.phoneInput, phone);
        Logger.info('Filled Phone', { phone });

        await this.companyInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.companyInput, company);
        Logger.info('Filled Company', { company });

        await this.emailInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.emailInput, email);
        Logger.info('Filled Email', { email });
      } catch (error) {
        Logger.error('Failed to fill contact form', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Clicks the Save button to submit the contact form, waits for API/network completion.
   */
  async saveContact(): Promise<void> {
    await test.step('Save Contact', async () => {
      Logger.info('Clicking Save button to submit contact form', { selector: 'button:has-text("Save")' });
      try {
        await this.saveButton.waitFor({ state: 'visible' });
        await Promise.all([
          this.page.waitForLoadState('networkidle'),
          this.saveButton.click()
        ]);
        Logger.info('Save button clicked and network idle state reached');
      } catch (error) {
        Logger.error('Failed to save contact', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Verifies that the submission success message is displayed after saving the contact.
   */
  async verifySubmissionSuccess(): Promise<void> {
    await test.step('Verify Submission Success Message', async () => {
      Logger.info('Verifying submission success message');
      try {
        await this.successMessage.waitFor({ state: 'visible' });
        await expect(this.successMessage).toBeVisible();
        Logger.info('Submission success message is visible');
      } catch (error) {
        Logger.error('Submission success message not found', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }
}
