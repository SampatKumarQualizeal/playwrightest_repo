import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object for CRM Contacts page (Create Contact flow)
 * Supports creating a new contact with robust synchronization and logging.
 */
export class ContactsPage extends BasePage {
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
    this.saveButton = page.locator('xpath=//button[normalize-space()="Save"]');
    this.successMessage = page.locator('div.ui.positive.message, div.success, .alert-success, text=Contact created successfully');
  }

  /**
   * Navigates to the Create Contact screen with robust navigation synchronization.
   */
  async openCreateContact(): Promise<void> {
    await test.step('Navigate to Create Contact screen', async () => {
      try {
        console.info('[ContactsPage] Navigating to /contacts/new');
        await this.page.goto('/contacts/new', { waitUntil: 'networkidle', timeout: 60000 });
        await this.firstNameField.waitFor({ state: 'visible', timeout: 10000 });
        console.info('[ContactsPage] Arrived at Create Contact screen');
      } catch (error) {
        console.error('[ContactsPage] Failed to navigate to Create Contact screen', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Fills the contact creation form fields with explicit readiness checks and logging.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param phone - Contact's phone number
   * @param company - Contact's company name
   * @param email - Contact's email address
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill Contact Form', async () => {
      try {
        console.info('[ContactsPage] Filling First Name', { firstName });
        await this.firstNameField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.firstNameField, firstName);

        console.info('[ContactsPage] Filling Last Name', { lastName });
        await this.lastNameField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.lastNameField, lastName);

        console.info('[ContactsPage] Filling Phone', { phone });
        await this.phoneField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.phoneField, phone);

        console.info('[ContactsPage] Filling Company', { company });
        await this.companyField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.companyField, company);

        console.info('[ContactsPage] Filling Email', { email });
        await this.emailField.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.fill(this.emailField, email);

        console.info('[ContactsPage] Contact form filled successfully');
      } catch (error) {
        console.error('[ContactsPage] Error filling contact form', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Clicks the Save button and waits for backend processing and UI confirmation.
   */
  async saveContact(): Promise<void> {
    await test.step('Save Contact', async () => {
      try {
        console.info('[ContactsPage] Clicking Save button');
        await this.saveButton.waitFor({ state: 'visible', timeout: 7000 });
        await ActionUtils.click(this.saveButton);
        await this.page.waitForLoadState('networkidle');
        console.info('[ContactsPage] Save button clicked, waiting for confirmation');
      } catch (error) {
        console.error('[ContactsPage] Error clicking Save button', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Verifies the presence of a submission success message after saving the contact.
   */
  async verifySubmissionSuccess(): Promise<void> {
    await test.step('Verify Contact Submission Success', async () => {
      try {
        console.info('[ContactsPage] Verifying submission success message');
        await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.successMessage).toBeVisible();
        console.info('[ContactsPage] Submission success message verified');
      } catch (error) {
        console.error('[ContactsPage] Submission success message not found', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }
}
