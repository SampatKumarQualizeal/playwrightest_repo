import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { Logger } from "@/logger/logger.js";

export class ContactsPage extends BasePage {
  private readonly contactsNavLink: Locator;
  private readonly createContactNavLink: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly emailField: Locator;
  private readonly saveButton: Locator;
  private readonly submissionSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    // PRIMARY: CSS selector for Contacts navigation
    this.contactsNavLink = page.locator('a[href="/contacts"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//a[normalize-space()="Contacts"]')
    // page.locator('text=Contacts')

    // PRIMARY: CSS selector for Create Contact navigation
    this.createContactNavLink = page.locator('a[href="/contacts/new"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//a[normalize-space()="Create"]')
    // page.locator('text=Create')

    // PRIMARY: CSS selector for First Name input
    this.firstNameField = page.locator('input[name="first_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="first_name" and @type="text"]')
    // page.locator('input[name="first_name"]')

    // PRIMARY: CSS selector for Last Name input
    this.lastNameField = page.locator('input[name="last_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="last_name" and @type="text"]')
    // page.locator('input[name="last_name"]')

    // PRIMARY: CSS selector for Phone input (assumed as input[name="phone"])
    this.phoneField = page.locator('input[name="phone"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="phone" and @type="text"]')
    // page.locator('input[placeholder*="Phone"]')

    // PRIMARY: CSS selector for Company input (assumed as input[name="company"])
    this.companyField = page.locator('input[name="company"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="company" and @type="text"]')
    // page.locator('input[placeholder*="Company"]')

    // PRIMARY: CSS selector for Email input
    this.emailField = page.locator('input[name="email"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="email" and @type="text" and @placeholder="Email"]')
    // page.locator('input[name="email"][placeholder="Email"]')

    // PRIMARY: XPath for Save button
    this.saveButton = page.locator('//button[normalize-space()="Save"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('button.ui.linkedin.button')
    // page.locator('button:has-text("Save")')

    // PRIMARY: Success message locator (assumed as div with class 'ui success message')
    this.submissionSuccessMessage = page.locator('div.ui.success.message'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('div:has-text("successfully")')
    // page.locator('text=/success/i')
  }

  /**
   * Helper to fill a field using primary locator, fallback to secondary if needed
   */
  private async fillField(primary: Locator, fallback: Locator | null, value: string, fieldName: string): Promise<void> {
    try {
      Logger.info(`Filling ${fieldName} using primary locator.`);
      await primary.waitFor({ state: 'visible', timeout: 5000 });
      await primary.fill(value);
      Logger.info(`Successfully filled ${fieldName} using primary locator.`);
    } catch (primaryError) {
      Logger.warn(`Primary locator failed for ${fieldName}: ${primaryError}. Trying fallback.`);
      if (fallback) {
        try {
          await fallback.waitFor({ state: 'visible', timeout: 5000 });
          await fallback.fill(value);
          Logger.info(`Successfully filled ${fieldName} using fallback locator.`);
        } catch (fallbackError) {
          Logger.error(`Both primary and fallback locators failed for ${fieldName}.`, { primaryError, fallbackError });
          throw fallbackError;
        }
      } else {
        Logger.error(`No fallback locator provided for ${fieldName}.`, { primaryError });
        throw primaryError;
      }
    }
  }

  /**
   * Navigates to the Contacts root page.
   */
  async navigateToContactsRoot(): Promise<void> {
    await test.step('Navigate to Contacts root', async () => {
      try {
        Logger.info('Navigating to Contacts root.');
        await this.contactsNavLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.contactsNavLink.click();
        await this.page.waitForLoadState('networkidle');
        // Wait for a key UI element
        await this.createContactNavLink.waitFor({ state: 'visible', timeout: 10000 });
        Logger.info('Navigation to Contacts root successful.');
      } catch (error) {
        Logger.error('Failed to navigate to Contacts root.', { error: error instanceof Error ? { message: error.message, stack: error.stack } : error });
        throw error;
      }
    });
  }

  /**
   * Opens the Create Contact form from the Contacts screen.
   */
  async openCreateContact(): Promise<void> {
    await test.step('Open Create Contact form', async () => {
      try {
        Logger.info('Opening Create Contact form.');
        await this.createContactNavLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.createContactNavLink.click();
        await this.page.waitForLoadState('networkidle');
        // Wait for firstName field to be visible
        await this.firstNameField.waitFor({ state: 'visible', timeout: 10000 });
        Logger.info('Create Contact form opened successfully.');
      } catch (error) {
        Logger.error('Failed to open Create Contact form.', { error: error instanceof Error ? { message: error.message, stack: error.stack } : error });
        throw error;
      }
    });
  }

  /**
   * Fills the contact creation form with provided details.
   * @param firstName First name
   * @param lastName Last name
   * @param phone Phone number
   * @param company Company name
   * @param email Email address
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill Contact Form', async () => {
      try {
        Logger.info('Filling contact form fields.');
        // Fallback locators for each field
        const lastNameFallback = this.page.locator('xpath=//input[@name="last_name" and @type="text"]');
        const phoneFallback = this.page.locator('xpath=//input[@name="phone" and @type="text"]');
        const companyFallback = this.page.locator('xpath=//input[@name="company" and @type="text"]');
        const emailFallback = this.page.locator('xpath=//input[@name="email" and @type="text" and @placeholder="Email"]');
        await this.fillField(this.firstNameField, this.page.locator('xpath=//input[@name="first_name" and @type="text"]'), firstName, 'First Name');
        await this.fillField(this.lastNameField, lastNameFallback, lastName, 'Last Name');
        await this.fillField(this.phoneField, phoneFallback, phone, 'Phone');
        await this.fillField(this.companyField, companyFallback, company, 'Company');
        await this.fillField(this.emailField, emailFallback, email, 'Email');
        Logger.info('Contact form fields filled successfully.');
      } catch (error) {
        Logger.error('Failed to fill contact form fields.', { error: error instanceof Error ? { message: error.message, stack: error.stack } : error });
        throw error;
      }
    });
  }

  /**
   * Clicks the Save button to submit the contact form.
   * Waits for network idle and UI confirmation.
   */
  async saveContact(): Promise<void> {
    await test.step('Save Contact', async () => {
      try {
        Logger.info('Attempting to save contact.');
        await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        // Wait for success message
        await this.submissionSuccessMessage.waitFor({ state: 'visible', timeout: 10000 });
        Logger.info('Contact saved successfully.');
      } catch (error) {
        Logger.error('Failed to save contact.', { error: error instanceof Error ? { message: error.message, stack: error.stack } : error });
        throw error;
      }
    });
  }

  /**
   * Retrieves the submission success message text from the UI.
   * @returns Success message string
   */
  async getSubmissionSuccessMessage(): Promise<string> {
    return await test.step('Get Submission Success Message', async () => {
      try {
        Logger.info('Retrieving submission success message.');
        await this.submissionSuccessMessage.waitFor({ state: 'visible', timeout: 10000 });
        const message = await this.submissionSuccessMessage.textContent();
        Logger.info('Submission success message retrieved.', { message });
        return message ? message.trim() : '';
      } catch (error) {
        Logger.error('Failed to retrieve submission success message.', { error: error instanceof Error ? { message: error.message, stack: error.stack } : error });
        throw error;
      }
    });
  }
}
