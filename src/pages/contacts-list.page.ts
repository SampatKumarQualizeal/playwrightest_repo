import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * ContactsListPage encapsulates actions and locators for the CRM Contacts List and Create Contact flow.
 * All interactions are synchronized and logged per repository standards.
 */
export class ContactsListPage extends BasePage {
  private readonly contactsNavLink: Locator;
  private readonly createContactLink: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly emailField: Locator;
  private readonly saveButton: Locator;
  private readonly submissionMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.contactsNavLink = page.locator('a[href="/contacts"]');
    this.createContactLink = page.locator('a[href="/contacts/new"]');
    this.firstNameField = page.locator('input[name="first_name"]');
    this.lastNameField = page.locator('input[name="last_name"]');
    this.phoneField = page.locator('input[name="phone"]');
    this.companyField = page.locator('input[name="company"]');
    this.emailField = page.locator('input[name="email"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.submissionMessage = page.locator('div[role="alert"], .ui.positive.message, .alert-success'); // Robust selector for success message
  }

  /**
   * Navigates to the Contacts List page with proper synchronization and logging.
   */
  async navigateToContacts(): Promise<void> {
    await test.step('Navigate to Contacts List', async () => {
      try {
        console.info("[ContactsListPage] Navigating to Contacts List page", { step: 'navigateToContacts' });
        await ActionUtils.click(this.contactsNavLink);
        await this.page.waitForLoadState('networkidle');
        await this.contactsNavLink.waitFor({ state: 'visible' });
        console.info("[ContactsListPage] Navigation to Contacts List successful", { url: await this.page.url() });
      } catch (error) {
        console.error("[ContactsListPage] Error navigating to Contacts List", { message: error.message, stack: error.stack, step: 'navigateToContacts' });
        throw error;
      }
    });
  }

  /**
   * Clicks the Create Contact link to open the contact creation form.
   */
  async clickCreateContact(): Promise<void> {
    await test.step('Open Create Contact form', async () => {
      try {
        console.info("[ContactsListPage] Clicking Create Contact link", { step: 'clickCreateContact' });
        await ActionUtils.click(this.createContactLink);
        await this.page.waitForLoadState('networkidle');
        await this.firstNameField.waitFor({ state: 'visible' });
        console.info("[ContactsListPage] Create Contact form opened successfully");
      } catch (error) {
        console.error("[ContactsListPage] Error opening Create Contact form", { message: error.message, stack: error.stack, step: 'clickCreateContact' });
        throw error;
      }
    });
  }

  /**
   * Fills the contact creation form fields with provided data, synchronizing each field.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param email - Contact's email address
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill Contact Form', async () => {
      try {
        console.info("[ContactsListPage] Filling contact form fields", { step: 'fillContactForm' });
        await this.firstNameField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.firstNameField, firstName);
        await this.lastNameField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.lastNameField, lastName);
        await this.phoneField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.phoneField, phone);
        await this.companyField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.companyField, company);
        await this.emailField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.emailField, email);
        console.info("[ContactsListPage] Contact form filled successfully", { firstName, lastName, phone, company, email });
      } catch (error) {
        console.error("[ContactsListPage] Error filling contact form", { message: error.message, stack: error.stack, step: 'fillContactForm' });
        throw error;
      }
    });
  }

  /**
   * Clicks the Save button to submit the contact form, waits for network idle and confirmation message.
   */
  async saveContact(): Promise<void> {
    await test.step('Save New Contact', async () => {
      try {
        console.info("[ContactsListPage] Clicking Save button to submit contact", { step: 'saveContact' });
        await this.saveButton.waitFor({ state: 'visible' });
        await ActionUtils.click(this.saveButton);
        await this.page.waitForLoadState('networkidle');
        await this.submissionMessage.waitFor({ state: 'visible' });
        console.info("[ContactsListPage] Contact saved and confirmation message displayed");
      } catch (error) {
        console.error("[ContactsListPage] Error saving contact", { message: error.message, stack: error.stack, step: 'saveContact' });
        throw error;
      }
    });
  }

  /**
   * Retrieves the submission success message text after saving a contact.
   * @returns The confirmation message as a string
   */
  async getSubmissionMessage(): Promise<string> {
    return await test.step('Get Submission Success Message', async () => {
      try {
        console.info("[ContactsListPage] Retrieving submission message", { step: 'getSubmissionMessage' });
        await this.submissionMessage.waitFor({ state: 'visible' });
        const message = await this.submissionMessage.textContent();
        console.info("[ContactsListPage] Submission message retrieved", { message });
        return message ? message.trim() : '';
      } catch (error) {
        console.error("[ContactsListPage] Error retrieving submission message", { message: error.message, stack: error.stack, step: 'getSubmissionMessage' });
        throw error;
      }
    });
  }
}
