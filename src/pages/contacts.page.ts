import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * ContactsPage - Page Object for CRM Contacts management
 * Supports navigation, creation, and verification of contacts.
 * All actions are synchronized and logged for traceability.
 */
export class ContactsPage extends BasePage {
  private readonly contactsNav: Locator;
  private readonly createContactBtn: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly phoneInput: Locator;
  private readonly companyInput: Locator;
  private readonly emailInput: Locator;
  private readonly saveBtn: Locator;
  private readonly statusMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.contactsNav = page.locator('a[href="/contacts"]');
    this.createContactBtn = page.locator('a[href="/contacts/new"], button:has-text("Create")');
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.companyInput = page.locator('input[name="company"]');
    this.emailInput = page.locator('input[name="email"]');
    this.saveBtn = page.locator('button:has-text("Save")');
    this.statusMessage = page.locator('div[role="alert"], div.ui.positive.message, div.ui.success.message');
  }

  /**
   * Navigates to the Contacts section and waits for page readiness.
   */
  async navigateToContacts(): Promise<void> {
    await test.step('Navigate to Contacts section', async () => {
      try {
        console.info('[ContactsPage] Clicking Contacts navigation', { selector: 'a[href="/contacts"]' });
        await ActionUtils.click(this.contactsNav);
        await this.page.waitForLoadState('networkidle');
        await this.createContactBtn.waitFor({ state: 'visible' });
        console.info('[ContactsPage] Contacts page loaded and ready.');
      } catch (error) {
        console.error('[ContactsPage] Failed to navigate to Contacts', { error: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Opens the Create Contact form and waits for form fields to be visible.
   */
  async openCreateContact(): Promise<void> {
    await test.step('Open Create Contact form', async () => {
      try {
        console.info('[ContactsPage] Clicking Create Contact button', { selector: 'a[href="/contacts/new"] or button:has-text("Create")' });
        await ActionUtils.click(this.createContactBtn);
        await this.firstNameInput.waitFor({ state: 'visible' });
        await this.lastNameInput.waitFor({ state: 'visible' });
        await this.emailInput.waitFor({ state: 'visible' });
        console.info('[ContactsPage] Create Contact form displayed.');
      } catch (error) {
        console.error('[ContactsPage] Failed to open Create Contact form', { error: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Fills the contact creation form with provided details.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param email - Contact's email
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill Contact Form', async () => {
      try {
        console.info('[ContactsPage] Filling First Name', { firstName });
        await this.firstNameInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.firstNameInput, firstName);

        console.info('[ContactsPage] Filling Last Name', { lastName });
        await this.lastNameInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.lastNameInput, lastName);

        if (phone) {
          console.info('[ContactsPage] Filling Phone', { phone });
          await this.phoneInput.waitFor({ state: 'visible' });
          await ActionUtils.fill(this.phoneInput, phone);
        }

        if (company) {
          console.info('[ContactsPage] Filling Company', { company });
          await this.companyInput.waitFor({ state: 'visible' });
          await ActionUtils.fill(this.companyInput, company);
        }

        console.info('[ContactsPage] Filling Email', { email });
        await this.emailInput.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.emailInput, email);
        console.info('[ContactsPage] All contact fields filled.');
      } catch (error) {
        console.error('[ContactsPage] Failed to fill contact form', { error: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Clicks the Save button and waits for API/UI confirmation (network idle).
   */
  async clickSave(): Promise<void> {
    await test.step('Click Save to submit contact', async () => {
      try {
        console.info('[ContactsPage] Clicking Save button', { selector: 'button:has-text("Save")' });
        await this.saveBtn.waitFor({ state: 'visible' });
        await ActionUtils.click(this.saveBtn);
        await this.page.waitForLoadState('networkidle');
        await this.statusMessage.waitFor({ state: 'visible' });
        console.info('[ContactsPage] Save action completed, status message visible.');
      } catch (error) {
        console.error('[ContactsPage] Failed to save contact', { error: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Retrieves the post-submit success message from the UI.
   * @returns The status message text
   */
  async getSubmissionMessage(): Promise<string> {
    return await test.step('Get submission status message', async () => {
      try {
        await this.statusMessage.waitFor({ state: 'visible' });
        const message = await this.statusMessage.textContent();
        console.info('[ContactsPage] Submission message retrieved', { message });
        if (!message) {
          throw new Error('Submission message is empty or not found.');
        }
        return message.trim();
      } catch (error) {
        console.error('[ContactsPage] Failed to get submission message', { error: error.message, stack: error.stack });
        throw error;
      }
    });
  }
}
