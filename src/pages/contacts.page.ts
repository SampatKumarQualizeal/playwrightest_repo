import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "@pages/base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * ContactsPage encapsulates the Contacts feature UI interactions.
 * Provides methods to navigate, fill, and submit the contact form with robust synchronization and logging.
 */
export class ContactsPage extends BasePage {
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
    // Submission message: fallback to any visible alert/message after save
    this.submissionMessage = page.locator(
      '[role="alert"], .ui.positive.message, .alert-success, .success-message, .message-success, .ui.message:has-text("success"), .ui.message:has-text("created"), .ui.message:has-text("saved")'
    );
  }

  /**
   * Navigates to the Create Contact form via Contacts navigation.
   */
  async navigateToCreateContact(): Promise<void> {
    await test.step('Navigate to Create Contact form', async () => {
      try {
        console.info("[ContactsPage] Clicking Contacts navigation link");
        await this.contactsNavLink.waitFor({ state: 'visible' });
        await ActionUtils.click(this.contactsNavLink);
        await this.page.waitForLoadState('networkidle');
        console.info("[ContactsPage] Contacts page loaded");

        console.info("[ContactsPage] Clicking Create Contact link");
        await this.createContactLink.waitFor({ state: 'visible' });
        await ActionUtils.click(this.createContactLink);
        await this.page.waitForLoadState('networkidle');
        // Wait for firstName field as confirmation
        await this.firstNameField.waitFor({ state: 'visible' });
        console.info("[ContactsPage] Create Contact form loaded");
      } catch (error) {
        console.error("[ContactsPage] Error navigating to Create Contact", { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Fills the contact form fields with provided values, waiting for each field before typing.
   * @param firstName Contact's first name
   * @param lastName Contact's last name
   * @param phone Contact's phone number
   * @param company Contact's company
   * @param email Contact's email address
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill Contact Form', async () => {
      try {
        console.info("[ContactsPage] Filling first name", { firstName });
        await this.firstNameField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.firstNameField, firstName);

        console.info("[ContactsPage] Filling last name", { lastName });
        await this.lastNameField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.lastNameField, lastName);

        console.info("[ContactsPage] Filling phone", { phone });
        await this.phoneField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.phoneField, phone);

        console.info("[ContactsPage] Filling company", { company });
        await this.companyField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.companyField, company);

        console.info("[ContactsPage] Filling email", { email });
        await this.emailField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.emailField, email);
        console.info("[ContactsPage] Contact form fields populated");
      } catch (error) {
        console.error("[ContactsPage] Error filling contact form", { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Clicks the Save button and waits for the operation to complete (network idle and message visible).
   */
  async saveContact(): Promise<void> {
    await test.step('Save Contact', async () => {
      try {
        console.info("[ContactsPage] Clicking Save button");
        await this.saveButton.waitFor({ state: 'visible' });
        await ActionUtils.click(this.saveButton);
        await this.page.waitForLoadState('networkidle');
        // Wait for a success message or confirmation
        await this.submissionMessage.first().waitFor({ state: 'visible', timeout: 10000 });
        console.info("[ContactsPage] Save operation completed");
      } catch (error) {
        console.error("[ContactsPage] Error saving contact", { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Retrieves the user-facing submission message after saving a contact.
   * @returns {Promise<string>} The submission message text
   */
  async getSubmissionMessage(): Promise<string> {
    return await test.step('Get Submission Message', async () => {
      try {
        await this.submissionMessage.first().waitFor({ state: 'visible', timeout: 10000 });
        const message = await this.submissionMessage.first().textContent();
        console.info("[ContactsPage] Submission message retrieved", { message });
        return message ? message.trim() : '';
      } catch (error) {
        console.error("[ContactsPage] Error retrieving submission message", { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * High-level orchestration to create a new contact.
   * Navigates, fills the form, saves, and returns the submission message.
   */
  async createContact(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<string> {
    return await test.step('Create Contact Orchestration', async () => {
      try {
        await this.navigateToCreateContact();
        await this.fillContactForm(firstName, lastName, phone, company, email);
        await this.saveContact();
        const message = await this.getSubmissionMessage();
        console.info("[ContactsPage] Contact creation completed", { message });
        return message;
      } catch (error) {
        console.error("[ContactsPage] Error during contact creation", { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }
}
