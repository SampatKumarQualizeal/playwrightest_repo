import { Page, Locator, expect, test } from "@playwright/test";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object for the Contacts Create Page.
 * Handles form interactions for creating a new contact.
 * Locators include primary and fallback strategies for robustness.
 */
export class ContactsCreatePage {
  private readonly page: Page;

  // Locators for contact creation fields
  private readonly firstNameField: Locator;
  // SECONDARY LOCATORS (fallback)
  // page.locator('xpath=//input[@name=\'first_name\' and @type=\'text\']')
  // page.locator('input[name="first_name"]')

  private readonly lastNameField: Locator;
  // SECONDARY LOCATORS (fallback)
  // page.locator('xpath=//input[@name=\'last_name\' and @type=\'text\']')
  // page.locator('input[name="last_name"]')

  private readonly phoneField: Locator;
  // SECONDARY LOCATORS (fallback)
  // page.locator('input[name="phone"]')
  // page.locator('xpath=//input[@name=\'phone\']')

  private readonly companyField: Locator;
  // SECONDARY LOCATORS (fallback)
  // page.locator('input[name="company"]')
  // page.locator('xpath=//input[@name=\'company\']')

  private readonly emailField: Locator;
  // SECONDARY LOCATORS (fallback)
  // page.locator('xpath=//input[@name=\'email\' and @type=\'text\' and @placeholder=\'Email\']')
  // page.locator('input[name="email"][placeholder="Email"]')

  private readonly saveButton: Locator;
  // SECONDARY LOCATORS (fallback)
  // page.locator('button.ui.linkedin.button')
  // page.locator('xpath=//button[normalize-space()="Save"]')

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.locator('input[name="first_name"]'); // PRIMARY
    // Fallbacks as comments above
    this.lastNameField = page.locator('input[name="last_name"]'); // PRIMARY
    this.phoneField = page.locator('input[name="phone"]'); // PRIMARY
    this.companyField = page.locator('input[name="company"]'); // PRIMARY
    this.emailField = page.locator('input[name="email"]'); // PRIMARY
    this.saveButton = page.locator('button:has-text("Save")'); // PRIMARY
    // Fallbacks as comments above
  }

  /**
   * Fill contact details in the create contact form.
   * Waits for each field to be visible before interacting.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param email - Contact's email address
   */
  async fillContactDetails(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    // Step 1: Fill contact details fields
    try {
      test.info().log({ message: "Filling contact details", metadata: { firstName, lastName, phone, company, email } });
      await this.firstNameField.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.firstNameField, firstName);
      test.info().log({ message: "Filled first name", metadata: { field: 'firstName' } });

      await this.lastNameField.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.lastNameField, lastName);
      test.info().log({ message: "Filled last name", metadata: { field: 'lastName' } });

      await this.phoneField.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.phoneField, phone);
      test.info().log({ message: "Filled phone", metadata: { field: 'phone' } });

      await this.companyField.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.companyField, company);
      test.info().log({ message: "Filled company", metadata: { field: 'company' } });

      await this.emailField.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.emailField, email);
      test.info().log({ message: "Filled email", metadata: { field: 'email' } });

      test.info().log({ message: "All contact fields filled successfully" });
    } catch (error: any) {
      test.info().log({ message: "Error filling contact details", metadata: { error: error.message, stack: error.stack } });
      throw error;
    }
  }

  /**
   * Clicks the Save button and waits for network idle to ensure save is complete.
   */
  async saveContact(): Promise<void> {
    // Step 1: Click Save and wait for network idle
    try {
      test.info().log({ message: "Clicking Save button" });
      await this.saveButton.waitFor({ state: 'visible' });
      await ActionUtils.click(this.saveButton);
      await this.page.waitForLoadState('networkidle');
      test.info().log({ message: "Save button clicked and network is idle" });
    } catch (error: any) {
      test.info().log({ message: "Error clicking Save button", metadata: { error: error.message, stack: error.stack } });
      throw error;
    }
  }
}
