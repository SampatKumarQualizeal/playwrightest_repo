import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "@pages/base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object for Contacts Page
 * Encapsulates all interactions related to creating a new contact.
 */
export class ContactsPage extends BasePage {
  private readonly contactsLink: Locator;
  private readonly createButton: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly emailField: Locator;
  private readonly saveButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Navigation link to Contacts page
    this.contactsLink = page.locator('a[href="/contacts"]');
    // Button or link to create a new contact
    this.createButton = page.locator('a[href="/contacts/new"], button:has-text("Create")');
    // Input fields
    this.firstNameField = page.locator('input[name="first_name"]');
    this.lastNameField = page.locator('input[name="last_name"]');
    this.phoneField = page.locator('input[name="phone"]');
    this.companyField = page.locator('input[name="company"]');
    this.emailField = page.locator('input[name="email"]');
    // Save button
    this.saveButton = page.locator('button:has-text("Save")');
    // Success/notification message (robust selector for toast/notification)
    this.successMessage = page.locator('[role="alert"], .ui.positive.message, .toast-success, .notification-success, div:has-text("success"), div:has-text("saved")');
  }

  /**
   * Navigate to the Contacts page and wait for it to be ready.
   */
  async openContacts(): Promise<void> {
    await test.step('Navigate to Contacts page', async () => {
      await this.page.goto('/contacts', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.contactsLink.waitFor({ state: 'visible', timeout: 10000 });
      await expect(this.page).toHaveURL(/\/contacts/);
    });
  }

  /**
   * Click the Create button/link to open the new-contact form.
   */
  async clickCreateContact(): Promise<void> {
    await test.step('Click Create Contact button', async () => {
      await this.createButton.waitFor({ state: 'visible', timeout: 10000 });
      await ActionUtils.click(this.createButton);
      // Wait for the form to be visible
      await this.firstNameField.waitFor({ state: 'visible', timeout: 10000 });
    });
  }

  /**
   * Populate the contact form fields.
   * @param firstName First Name
   * @param lastName Last Name
   * @param phone Phone Number
   * @param company Company Name
   * @param email Email Address
   */
  async fillContactDetails(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill Contact Details', async () => {
      await ActionUtils.fill(this.firstNameField, firstName);
      await ActionUtils.fill(this.lastNameField, lastName);
      await ActionUtils.fill(this.phoneField, phone);
      await ActionUtils.fill(this.companyField, company);
      await ActionUtils.fill(this.emailField, email);
    });
  }

  /**
   * Click Save and wait for submission to complete.
   */
  async saveContact(): Promise<void> {
    await test.step('Save Contact', async () => {
      await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
      await ActionUtils.click(this.saveButton);
      // Wait for network to be idle or for a success message
      await Promise.race([
        this.page.waitForLoadState('networkidle', { timeout: 15000 }),
        this.successMessage.waitFor({ state: 'visible', timeout: 15000 })
      ]);
    });
  }

  /**
   * Assert that a success message/toast is displayed.
   */
  async verifySuccessMessage(): Promise<void> {
    await test.step('Verify Success Message', async () => {
      await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
      const messageText = await this.successMessage.textContent();
      expect(messageText?.toLowerCase()).toContain('success');
    });
  }
}
