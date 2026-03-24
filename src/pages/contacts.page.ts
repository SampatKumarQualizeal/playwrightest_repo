import { Page, Locator, test, expect } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object for Contacts management (creation flow)
 * Encapsulates navigation, form fill, save, and success verification for Contacts.
 */
export class ContactsPage extends BasePage {
  private readonly contactsLink: Locator;
  private readonly createContactLink: Locator;
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
    this.createContactLink = page.locator('a[href="/contacts/new"]');
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.companyInput = page.locator('input[name="company"]');
    this.emailInput = page.locator('input[name="email"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.successMessage = page.locator('div[role="alert"], .ui.positive.message, .toast-success, .alert-success');
  }

  /**
   * Navigates to the Contacts list page from the main app.
   * Waits for navigation and the Contacts page to be ready.
   */
  async navigateToContacts(): Promise<void> {
    await test.step('Navigate to Contacts list', async () => {
      try {
        console.info('[ContactsPage] Navigating to Contacts list');
        await ActionUtils.click(this.contactsLink);
        await this.page.waitForLoadState('networkidle');
        await this.createContactLink.waitFor({ state: 'visible' });
        console.info('[ContactsPage] Contacts list loaded successfully');
      } catch (error) {
        console.error('[ContactsPage] Failed to navigate to Contacts list', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Opens the Create New Contact form.
   * Waits for the form to be ready for input.
   */
  async openCreateContactForm(): Promise<void> {
    await test.step('Open Create Contact form', async () => {
      try {
        console.info('[ContactsPage] Opening Create Contact form');
        await ActionUtils.click(this.createContactLink);
        await this.firstNameInput.waitFor({ state: 'visible' });
        console.info('[ContactsPage] Create Contact form is ready');
      } catch (error) {
        console.error('[ContactsPage] Failed to open Create Contact form', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Fills the Contact creation form with provided data.
   * Waits for each input to be visible before interacting.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param email - Contact's email address
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill Contact form', async () => {
      try {
        console.info('[ContactsPage] Filling Contact form', { firstName, lastName, phone, company, email });
        await this.firstNameInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.firstNameInput, firstName);
        await this.lastNameInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.lastNameInput, lastName);
        await this.phoneInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.phoneInput, phone);
        await this.companyInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.companyInput, company);
        await this.emailInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.emailInput, email);
        console.info('[ContactsPage] Contact form filled successfully');
      } catch (error) {
        console.error('[ContactsPage] Failed to fill Contact form', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Clicks the Save button to create the contact.
   * Waits for backend/API completion via network idle and UI confirmation.
   */
  async saveContact(): Promise<void> {
    await test.step('Save Contact', async () => {
      try {
        console.info('[ContactsPage] Saving Contact');
        await this.saveButton.waitFor({ state: 'visible' });
        await ActionUtils.click(this.saveButton);
        await this.page.waitForLoadState('networkidle');
        console.info('[ContactsPage] Save action completed, waiting for success message');
      } catch (error) {
        console.error('[ContactsPage] Failed to save Contact', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Verifies that the Contact creation was successful by checking for a success indicator.
   * Throws an error if success message is not found.
   */
  async verifyContactCreationSuccess(): Promise<void> {
    await test.step('Verify Contact creation success', async () => {
      try {
        console.info('[ContactsPage] Verifying Contact creation success');
        await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.successMessage).toBeVisible();
        console.info('[ContactsPage] Contact creation success message displayed');
      } catch (error) {
        console.error('[ContactsPage] Contact creation success message not found', { message: error.message, stack: error.stack });
        throw new Error('Contact creation success message not found.');
      }
    });
  }
}
