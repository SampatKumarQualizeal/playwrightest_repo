import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "@/pages/base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object Model for the Contacts - Create Contact screen.
 * Encapsulates selectors and actions to create a contact in the CRM system.
 *
 * Usage:
 *   const contactsPage = new ContactsPage(page);
 *   await contactsPage.navigateToCreateContact();
 *   await contactsPage.fillContactDetails(...);
 *   await contactsPage.saveContact();
 *   await contactsPage.verifySubmissionMessage();
 *   await contactsPage.verifyContactCreated(...);
 */
export class ContactsPage extends BasePage {
  private readonly contactsMenu: Locator;
  private readonly createContactMenu: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly emailField: Locator;
  private readonly saveButton: Locator;
  private readonly submissionMessage: Locator;
  private readonly contactListTable: Locator;

  constructor(page: Page) {
    super(page);
    // Main menu navigation
    this.contactsMenu = page.locator('a[href="/contacts"]');
    this.createContactMenu = page.locator('a[href="/contacts/new"]');
    // Form fields
    this.firstNameField = page.locator('input[name="first_name"]');
    this.lastNameField = page.locator('input[name="last_name"]');
    this.phoneField = page.locator('input[name="phone"]');
    this.companyField = page.locator('input[name="company"]');
    this.emailField = page.locator('input[name="email"]');
    // Save button
    this.saveButton = page.locator('button', { hasText: 'Save' });
    // Submission message
    this.submissionMessage = page.locator('div.ui.positive.message, div[role="alert"], .success.message');
    // Contact list table (for verifying contact creation)
    this.contactListTable = page.locator('table');
  }

  /**
   * Navigates to the Create Contact screen via UI navigation.
   * Waits for the create contact form to be visible before proceeding.
   */
  async navigateToCreateContact(): Promise<void> {
    await test.step('Navigate to Create Contact screen', async () => {
      try {
        ActionUtils.logInfo('Navigating to Contacts menu', { selector: 'a[href="/contacts"]' });
        await ActionUtils.click(this.contactsMenu);
        await this.contactsMenu.waitFor({ state: 'visible' });
        ActionUtils.logInfo('Navigating to Create Contact menu', { selector: 'a[href="/contacts/new"]' });
        await ActionUtils.click(this.createContactMenu);
        await this.firstNameField.waitFor({ state: 'visible' });
        ActionUtils.logInfo('Arrived at Create Contact form', {});
      } catch (error) {
        ActionUtils.logError('Failed to navigate to Create Contact screen', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }

  /**
   * Fills in the contact details form with provided data.
   * Waits for each field to be visible before entering data.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param email - Contact's email address
   */
  async fillContactDetails(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill in contact details', async () => {
      try {
        ActionUtils.logInfo('Filling First Name', { value: firstName });
        await this.firstNameField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.firstNameField, firstName);

        ActionUtils.logInfo('Filling Last Name', { value: lastName });
        await this.lastNameField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.lastNameField, lastName);

        ActionUtils.logInfo('Filling Phone', { value: phone });
        await this.phoneField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.phoneField, phone);

        ActionUtils.logInfo('Filling Company', { value: company });
        await this.companyField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.companyField, company);

        ActionUtils.logInfo('Filling Email', { value: email });
        await this.emailField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.emailField, email);
        ActionUtils.logInfo('All contact details filled successfully');
      } catch (error) {
        ActionUtils.logError('Failed to fill contact details', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }

  /**
   * Clicks the Save button to submit the contact form.
   * Waits for network idle and for the submission message to appear.
   */
  async saveContact(): Promise<void> {
    await test.step('Save the contact', async () => {
      try {
        ActionUtils.logInfo('Clicking Save button');
        await this.saveButton.waitFor({ state: 'visible' });
        await ActionUtils.click(this.saveButton);
        await this.page.waitForLoadState('networkidle');
        await this.submissionMessage.waitFor({ state: 'visible' });
        ActionUtils.logInfo('Contact save action completed, waiting for confirmation message');
      } catch (error) {
        ActionUtils.logError('Failed to save contact', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }

  /**
   * Gets the submission/success message displayed after saving a contact.
   * @returns The success message text
   */
  async getSubmissionMessage(): Promise<string> {
    return await test.step('Get submission message after saving contact', async () => {
      try {
        await this.submissionMessage.waitFor({ state: 'visible' });
        const message = await this.submissionMessage.textContent();
        ActionUtils.logInfo('Retrieved submission message', { message });
        return message?.trim() || '';
      } catch (error) {
        ActionUtils.logError('Failed to get submission message', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }

  /**
   * Verifies that the submission message matches the expected value.
   * @param expectedMessage - The expected success message
   */
  async verifySubmissionMessage(expectedMessage: string): Promise<void> {
    await test.step('Verify submission message', async () => {
      try {
        await this.submissionMessage.waitFor({ state: 'visible' });
        const actualMessage = await this.submissionMessage.textContent();
        ActionUtils.logInfo('Verifying submission message', { expected: expectedMessage, actual: actualMessage });
        expect(actualMessage?.trim()).toContain(expectedMessage);
        ActionUtils.logInfo('Submission message verified successfully');
      } catch (error) {
        ActionUtils.logError('Submission message verification failed', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }

  /**
   * Verifies that a contact with the expected name appears in the contact list.
   * @param expectedName - Full name of the contact (e.g., 'John Doe'). If not provided, method will not perform the check.
   */
  async verifyContactCreated(expectedName?: string): Promise<void> {
    if (!expectedName) return;
    await test.step('Verify contact appears in contact list', async () => {
      try {
        ActionUtils.logInfo('Navigating to Contacts list for verification');
        await ActionUtils.click(this.contactsMenu);
        await this.contactListTable.waitFor({ state: 'visible' });
        const contactRow = this.contactListTable.locator(`tr:has-text(\"${expectedName}\")`);
        await contactRow.waitFor({ state: 'visible' });
        expect(await contactRow.isVisible()).toBeTruthy();
        ActionUtils.logInfo('Contact creation verified in contact list', { contact: expectedName });
      } catch (error) {
        ActionUtils.logError('Failed to verify contact in contact list', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }
}
