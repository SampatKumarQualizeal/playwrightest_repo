import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object for Contacts management (creation flow)
 * Implements navigation, form fill, save, and confirmation retrieval for contacts.
 */
export class ContactsPage extends BasePage {
  private readonly contactsListLink: Locator;
  private readonly createContactLink: Locator;
  private readonly createButton: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly emailField: Locator;
  private readonly saveButton: Locator;
  private readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page);
    // PRIMARY: CSS selector
    this.contactsListLink = page.locator('a[href="/contacts"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//a[normalize-space()="Contacts"]')
    // page.locator('a:has-text("Contacts")')

    this.createContactLink = page.locator('a[href="/contacts/new"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//a[normalize-space()="Create"]')
    // page.locator('a:has-text("Create")')

    this.createButton = page.locator('xpath=//button[normalize-space()="Create"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('button.ui.linkedin.button:has-text("Create")')
    // page.locator('button:has-text("Create")')

    this.firstNameField = page.locator('input[name="first_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="first_name" and @type="text"]')
    // page.locator('input[name="first_name"]')

    this.lastNameField = page.locator('input[name="last_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="last_name" and @type="text"]')
    // page.locator('input[name="last_name"]')

    this.phoneField = page.locator('input[name="phone"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="phone"]')
    // page.locator('input[placeholder*="Phone"]')

    this.companyField = page.locator('input[name="company"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="company"]')
    // page.locator('input[placeholder*="Company"]')

    this.emailField = page.locator('input[name="email"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="email" and @type="text" and @placeholder="Email"]')
    // page.locator('input[name="email"][placeholder="Email"]')

    this.saveButton = page.locator('xpath=//button[normalize-space()="Save"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('button.ui.linkedin.button:has-text("Save")')
    // page.locator('button:has-text("Save")')

    this.confirmationMessage = page.locator('div.ui.positive.message, div[role="alert"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//div[contains(@class,"message") and contains(@class,"positive")]')
    // page.locator('div:has-text("successfully")')
  }

  /**
   * Step 1: Navigate to Contacts list page
   * Navigates to /contacts and waits for network idle and contacts list link visibility
   */
  async navigateToContacts(): Promise<void> {
    try {
      await test.step('Navigate to Contacts list page', async () => {
        await this.page.goto('/contacts', { waitUntil: 'networkidle', timeout: 90000 });
        await this.contactsListLink.waitFor({ state: 'visible', timeout: 10000 });
      });
    } catch (error) {
      console.error('Failed to navigate to Contacts list', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Step 2: Open the Create Contact form
   * Navigates to /contacts/new or clicks the Create button if present
   */
  async openCreateContact(): Promise<void> {
    try {
      await test.step('Open Create Contact form', async () => {
        if (await this.createContactLink.isVisible({ timeout: 5000 })) {
          await ActionUtils.click(this.createContactLink);
          await this.page.waitForLoadState('networkidle');
        } else if (await this.createButton.isVisible({ timeout: 5000 })) {
          await ActionUtils.click(this.createButton);
          await this.page.waitForLoadState('networkidle');
        } else {
          throw new Error('Create Contact link/button not found');
        }
        await this.firstNameField.waitFor({ state: 'visible', timeout: 10000 });
      });
    } catch (error) {
      console.error('Failed to open Create Contact form', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Step 3: Fill the Contact creation form
   * Fills first name, last name, phone, company, and email fields with explicit waits
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    try {
      await test.step('Fill Contact creation form', async () => {
        await this.firstNameField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.firstNameField, firstName);

        await this.lastNameField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.lastNameField, lastName);

        await this.phoneField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.phoneField, phone);

        await this.companyField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.companyField, company);

        await this.emailField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.emailField, email);
      });
    } catch (error) {
      console.error('Failed to fill Contact form', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Step 4: Save the new Contact
   * Clicks Save and waits for network idle and confirmation message
   */
  async saveContact(): Promise<void> {
    try {
      await test.step('Save new Contact', async () => {
        await this.saveButton.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.click(this.saveButton);
        await this.page.waitForLoadState('networkidle');
        await this.confirmationMessage.waitFor({ state: 'visible', timeout: 10000 });
      });
    } catch (error) {
      console.error('Failed to save Contact', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Step 5: Get the submission/confirmation message
   * Returns the text of the confirmation message for verification
   */
  async getSubmissionMessage(): Promise<string> {
    try {
      return await test.step('Get Contact submission confirmation message', async () => {
        await this.confirmationMessage.waitFor({ state: 'visible', timeout: 10000 });
        const message = await this.confirmationMessage.textContent();
        if (!message) {
          throw new Error('Confirmation message not found');
        }
        return message.trim();
      });
    } catch (error) {
      console.error('Failed to get submission message', { message: error.message, stack: error.stack });
      throw error;
    }
  }
}
