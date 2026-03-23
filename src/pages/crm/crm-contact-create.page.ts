import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "@pages/base.page.js";

/**
 * Page object for CRM Contact Creation form.
 * Encapsulates all interactions and synchronization for creating a new contact.
 */
export class CrmContactCreatePage extends BasePage {
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly emailField: Locator;
  private readonly saveButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameField = page.locator('input[name="first_name"]');
    this.lastNameField = page.locator('input[name="last_name"]');
    this.phoneField = page.locator('input[name="phone"]');
    this.companyField = page.locator('input[name="company"]');
    this.emailField = page.locator('input[name="email"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.successMessage = page.locator('div.ui.positive.message, div.success.message, div:has-text("Contact created successfully")');
  }

  /**
   * Fills out the contact creation form and submits it.
   * Waits for all fields to be visible before interacting.
   * @param data Object containing firstName, lastName, phone, company, email
   */
  async createContact(data: {
    firstName: string;
    lastName: string;
    phone: string;
    company: string;
    email: string;
  }): Promise<void> {
    await test.step('Fill and submit the contact creation form', async () => {
      try {
        // Log step: waiting for form fields
        console.info("Waiting for contact creation form fields to be visible", { step: "waitForFields" });
        await this.firstNameField.waitFor({ state: 'visible' });
        await this.lastNameField.waitFor({ state: 'visible' });
        await this.phoneField.waitFor({ state: 'visible' });
        await this.companyField.waitFor({ state: 'visible' });
        await this.emailField.waitFor({ state: 'visible' });

        // Log step: filling fields
        console.info("Filling contact details", { firstName: data.firstName, lastName: data.lastName, company: data.company });
        await this.firstNameField.fill(data.firstName);
        await this.lastNameField.fill(data.lastName);
        await this.phoneField.fill(data.phone);
        await this.companyField.fill(data.company);
        await this.emailField.fill(data.email);

        // Log step: clicking Save
        console.info("Clicking Save button", { step: "clickSave" });
        await this.saveButton.waitFor({ state: 'visible' });
        await Promise.all([
          this.page.waitForLoadState('networkidle'), // Synchronize for API-driven save
          this.saveButton.click()
        ]);
        console.info("Contact form submitted, waiting for success message", { step: "waitForSuccess" });
        await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
        console.info("Contact creation success message displayed", { step: "success" });
      } catch (error) {
        console.error("Error during contact creation", { message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined, step: "createContact" });
        throw error;
      }
    });
  }

  /**
   * Retrieves the text of the submission success message after contact creation.
   * Waits for the message to be visible.
   * @returns The success message text
   */
  async getSubmissionSuccessMessage(): Promise<string> {
    return await test.step('Get contact creation success message', async () => {
      try {
        console.info("Waiting for success message to be visible", { step: "waitForSuccessMessage" });
        await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
        const message = await this.successMessage.textContent();
        console.info("Success message retrieved", { message });
        return message ? message.trim() : '';
      } catch (error) {
        console.error("Error retrieving success message", { message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined, step: "getSubmissionSuccessMessage" });
        throw error;
      }
    });
  }
}
