import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";

/**
 * Page Object for the Contacts module (Create Contact flow) in the CRM.
 * Encapsulates navigation, field interactions, and submission logic for creating a new contact.
 *
 * Locators use primary and fallback strategies for robust element targeting.
 * All actions are logged and synchronized per best practices.
 */
export class ContactsPage extends BasePage {
  private readonly contactsListLink: Locator;
  private readonly createContactButton: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly emailField: Locator;
  private readonly saveButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Contacts list navigation link
    this.contactsListLink = page.locator('a[href="/contacts"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//a[normalize-space()="Contacts"]')
    // page.locator('text=Contacts')

    // Create Contact button/link
    this.createContactButton = page.locator('a[href="/contacts/new"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//a[normalize-space()="Create"]')
    // page.locator('button:has-text("Create")')
    // page.locator('xpath=//button[normalize-space()="Create"]')

    // First Name input
    this.firstNameField = page.locator('input[name="first_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="first_name" and @type="text"]')
    // page.locator('input[name="first_name"]')

    // Last Name input
    this.lastNameField = page.locator('input[name="last_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="last_name" and @type="text"]')
    // page.locator('input[name="last_name"]')

    // Phone input
    this.phoneField = page.locator('input[name="phone"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="phone"]')

    // Company input
    this.companyField = page.locator('input[name="company"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="company"]')

    // Email input
    this.emailField = page.locator('input[name="email"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="email"]')

    // Save button
    this.saveButton = page.locator('xpath=//button[normalize-space()="Save"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('button.Save')
    // page.locator('xpath=//button[contains(text(),"Save")]')

    // Success message/toast/alert
    this.successMessage = page.locator('div[role="alert"]:has-text("Contact created"), div[role="alert"]:has-text("Saved")'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('text=Contact created')
    // page.locator('text=Saved')
  }

  /**
   * Navigates to the Contacts list page.
   * Waits for the contacts list link and the page to be ready.
   */
  async navigateToContactsList(): Promise<void> {
    try {
      console.info("[ContactsPage] Navigating to Contacts list page");
      await test.step('Navigate to Contacts list', async () => {
        await this.contactsListLink.waitFor({ state: 'visible' });
        await this.contactsListLink.click();
        await this.page.waitForLoadState('networkidle');
        // Wait for Create Contact button to ensure the page is ready
        await this.createContactButton.waitFor({ state: 'visible' });
        console.info("[ContactsPage] Contacts list loaded");
      });
    } catch (error: any) {
      console.error("[ContactsPage] Failed to navigate to Contacts list", { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Opens the Create Contact form from the Contacts list page.
   * Waits for the create button and form fields to be visible.
   */
  async openCreateContactForm(): Promise<void> {
    try {
      console.info("[ContactsPage] Opening Create Contact form");
      await test.step('Open Create Contact form', async () => {
        await this.createContactButton.waitFor({ state: 'visible' });
        await this.createContactButton.click();
        await this.page.waitForLoadState('networkidle');
        // Wait for the first name field to ensure the form is ready
        await this.firstNameField.waitFor({ state: 'visible' });
        console.info("[ContactsPage] Create Contact form loaded");
      });
    } catch (error: any) {
      console.error("[ContactsPage] Failed to open Create Contact form", { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Fills the Create Contact form and submits it.
   * Waits for each field before interacting and for network idle after saving.
   * @param firstName Contact's first name
   * @param lastName Contact's last name
   * @param phoneNumber Contact's phone number
   * @param company Contact's company
   * @param email Contact's email
   */
  async createContact(firstName: string, lastName: string, phoneNumber: string, company: string, email: string): Promise<void> {
    try {
      console.info("[ContactsPage] Creating new contact", { firstName, lastName, phoneNumber, company, email });
      await test.step('Fill and submit Create Contact form', async () => {
        // Fill First Name
        await this.firstNameField.waitFor({ state: 'visible' });
        await this.firstNameField.fill(firstName);
        console.info("[ContactsPage] First Name entered");

        // Fill Last Name
        await this.lastNameField.waitFor({ state: 'visible' });
        await this.lastNameField.fill(lastName);
        console.info("[ContactsPage] Last Name entered");

        // Fill Phone
        await this.phoneField.waitFor({ state: 'visible' });
        await this.phoneField.fill(phoneNumber);
        console.info("[ContactsPage] Phone Number entered");

        // Fill Company
        await this.companyField.waitFor({ state: 'visible' });
        await this.companyField.fill(company);
        console.info("[ContactsPage] Company entered");

        // Fill Email
        await this.emailField.waitFor({ state: 'visible' });
        await this.emailField.fill(email);
        console.info("[ContactsPage] Email entered");

        // Click Save
        await this.saveButton.waitFor({ state: 'visible' });
        await this.saveButton.click();
        console.info("[ContactsPage] Save button clicked");

        // Wait for network idle and success message
        await this.page.waitForLoadState('networkidle');
        await this.successMessage.waitFor({ state: 'visible' });
        console.info("[ContactsPage] Contact creation submitted");
      });
    } catch (error: any) {
      console.error("[ContactsPage] Failed to create contact", { message: error.message, stack: error.stack, step: 'createContact' });
      throw error;
    }
  }

  /**
   * Returns the text of the submission success message for assertions.
   */
  async getSubmissionMessage(): Promise<string> {
    try {
      console.info("[ContactsPage] Retrieving submission success message");
      await this.successMessage.waitFor({ state: 'visible' });
      const message = await this.successMessage.textContent();
      console.info("[ContactsPage] Success message received", { message });
      return message ? message.trim() : '';
    } catch (error: any) {
      console.error("[ContactsPage] Failed to retrieve submission message", { message: error.message, stack: error.stack });
      throw error;
    }
  }
}
