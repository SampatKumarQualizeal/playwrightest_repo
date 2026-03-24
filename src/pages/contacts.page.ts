import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * ContactsPage encapsulates the CRM Contacts screen interactions.
 * All actions are synchronized and logged. No test data or authentication logic is included.
 */
export class ContactsPage extends BasePage {
  private readonly contactsNavLink: Locator;
  private readonly createContactBtn: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly phoneInput: Locator;
  private readonly companyInput: Locator;
  private readonly emailInput: Locator;
  private readonly saveBtn: Locator;
  private readonly successMessage: Locator;
  
  constructor(page: Page) {
    super(page);
    this.contactsNavLink = page.locator('a[href="/contacts"]');
    this.createContactBtn = page.locator('a[href="/contacts/new"], button:has-text("Create")');
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.companyInput = page.locator('input[name="company"]');
    this.emailInput = page.locator('input[name="email"]');
    this.saveBtn = page.locator('button:has-text("Save")');
    this.successMessage = page.locator('.ui .positive.message, .success.message, .alert-success');
  }

  /**
   * Navigates to the Contacts page and waits for UI readiness.
   */
  async navigateToContacts(): Promise<void> {
    try {
      await test.step('Navigate to Contacts page', async () => {
        console.info('[ContactsPage] Navigating to /contacts');
        await this.page.goto('/contacts', { waitUntil: 'networkidle', timeout: 90000 });
        await this.contactsNavLink.waitFor({ state: 'visible' });
        console.info('[ContactsPage] Contacts page loaded and navigation link visible');
      });
    } catch (error) {
      console.error('[ContactsPage] Failed to navigate to Contacts', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Opens the Create Contact form and waits for the form to be visible.
   */
  async openCreateContactForm(): Promise<void> {
    try {
      await test.step('Open Create Contact form', async () => {
        console.info('[ContactsPage] Clicking Create Contact button');
        await this.createContactBtn.waitFor({ state: 'visible' });
        await ActionUtils.click(this.createContactBtn);
        await this.firstNameInput.waitFor({ state: 'visible' });
        console.info('[ContactsPage] Create Contact form is now visible');
      });
    } catch (error) {
      console.error('[ContactsPage] Failed to open Create Contact form', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Fills in the contact details in the form.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param email - Contact's email address
   */
  async fillContactDetails(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    try {
      await test.step('Fill Contact Details', async () => {
        console.info('[ContactsPage] Filling contact details', { firstName, lastName, phone, company, email });
        await this.firstNameInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.firstNameInput, firstName);
        await this.lastNameInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.lastNameInput, lastName);
        if (await this.phoneInput.isVisible()) {
          await ActionUtils.fill(this.phoneInput, phone);
        }
        if (await this.companyInput.isVisible()) {
          await ActionUtils.fill(this.companyInput, company);
        }
        await this.emailInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.emailInput, email);
        console.info('[ContactsPage] Contact details filled successfully');
      });
    } catch (error) {
      console.error('[ContactsPage] Failed to fill contact details', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Clicks the Save button and waits for the network to be idle and success message to appear.
   */
  async saveContact(): Promise<void> {
    try {
      await test.step('Save Contact', async () => {
        console.info('[ContactsPage] Clicking Save button');
        await this.saveBtn.waitFor({ state: 'visible' });
        await ActionUtils.click(this.saveBtn);
        await this.page.waitForLoadState('networkidle');
        await this.successMessage.waitFor({ state: 'visible' });
        console.info('[ContactsPage] Contact saved, success message displayed');
      });
    } catch (error) {
      console.error('[ContactsPage] Failed to save contact', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Gets the submission success message text after saving a contact.
   * @returns The success message string
   */
  async getSubmissionSuccessMessage(): Promise<string> {
    try {
      return await test.step('Get Submission Success Message', async () => {
        await this.successMessage.waitFor({ state: 'visible' });
        const message = await this.successMessage.textContent();
        console.info('[ContactsPage] Submission success message:', { message });
        return message?.trim() || '';
      });
    } catch (error) {
      console.error('[ContactsPage] Failed to get submission success message', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Verifies that the submission success message matches the expected message.
   * @param expectedMessage - The expected success message
   */
  async verifySubmissionSuccess(expectedMessage: string): Promise<void> {
    try {
      await test.step('Verify Submission Success Message', async () => {
        await this.successMessage.waitFor({ state: 'visible' });
        const actualMessage = await this.successMessage.textContent();
        console.info('[ContactsPage] Verifying submission success message', { expectedMessage, actualMessage });
        expect(actualMessage?.trim()).toContain(expectedMessage);
        console.info('[ContactsPage] Submission success message verified successfully');
      });
    } catch (error) {
      console.error('[ContactsPage] Submission success message verification failed', { message: error.message, stack: error.stack });
      throw error;
    }
  }
}
