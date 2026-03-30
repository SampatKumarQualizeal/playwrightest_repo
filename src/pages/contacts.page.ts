import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * ContactsPage models the Contacts UI for create operations.
 * All element locators use primary (CSS) and fallback (XPath, text-based) strategies as per repo conventions.
 * All actions include explicit waits and structured logging.
 */
export class ContactsPage extends BasePage {
  private readonly contactsMenu: Locator;
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('//a[@href="/contacts"]')
  // this.page.getByRole('link', { name: 'Contacts' })

  private readonly createButton: Locator;
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('//a[@href="/contacts/new"]')
  // this.page.getByRole('link', { name: 'Create' })

  private readonly firstNameField: Locator;
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('input[name="firstName"]')
  // this.page.locator('input[placeholder^="First"]')

  private readonly lastNameField: Locator;
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('input[name="lastName"]')
  // this.page.locator('input[placeholder^="Last"]')

  private readonly emailField: Locator;
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('input[name="value"]')
  // this.page.locator('input[placeholder="Email"]')

  private readonly phoneField: Locator;
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('input[name="telephone"]')
  // this.page.locator('input[placeholder*="Phone"]')

  private readonly companyField: Locator;
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('input[name="organization"]')

  private readonly saveButton: Locator;
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('button.ui.linkedin.button')
  // this.page.getByRole('button', { name: 'Save' })

  private readonly successNotification: Locator;
  // SECONDARY LOCATORS (fallback)
  // this.page.getByText('Contact created')
  // this.page.getByText('Saved')

  constructor(page: Page) {
    super(page);
    // Contacts menu/link navigation
    this.contactsMenu = page.locator('a[href="/contacts"]'); // PRIMARY
    // Create button
    this.createButton = page.locator('a[href="/contacts/new"]'); // PRIMARY
    // Form fields
    this.firstNameField = page.locator('input[name="first_name"]'); // PRIMARY
    this.lastNameField = page.locator('input[name="last_name"]'); // PRIMARY
    this.emailField = page.locator('input[name="email"]'); // PRIMARY
    this.phoneField = page.locator('input[name="phone"]'); // PRIMARY
    this.companyField = page.locator('input[name="company"]'); // PRIMARY
    // Save button
    this.saveButton = page.locator("//button[normalize-space()='Save']"); // PRIMARY
    // Success/notification area
    this.successNotification = page.getByText(/Contact created|Saved/i); // PRIMARY
  }

  /**
   * Navigates to the Contacts page with full page load synchronization.
   */
  async openContacts(): Promise<void> {
    try {
      console.info("[ContactsPage] Navigating to Contacts page");
      await test.step('Navigate to Contacts page', async () => {
        await this.page.goto('/contacts', { waitUntil: 'networkidle' });
        await this.contactsMenu.waitFor({ state: 'visible' });
        console.info("[ContactsPage] Contacts menu is visible, page loaded");
      });
    } catch (error) {
      console.error("[ContactsPage] Failed to navigate to Contacts page", { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Clicks the Create Contact button with explicit readiness wait.
   */
  async clickCreateContact(): Promise<void> {
    try {
      console.info("[ContactsPage] Clicking Create Contact button");
      await test.step('Click Create Contact', async () => {
        await this.createButton.waitFor({ state: 'visible' });
        await ActionUtils.click(this.createButton);
        console.info("[ContactsPage] Create Contact button clicked");
      });
    } catch (error) {
      console.error("[ContactsPage] Failed to click Create Contact", { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Fills the contact creation form fields with explicit waits.
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    try {
      console.info("[ContactsPage] Filling contact form", { firstName, lastName, phone, company, email });
      await test.step('Fill Contact Form', async () => {
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
        console.info("[ContactsPage] Contact form filled");
      });
    } catch (error) {
      console.error("[ContactsPage] Failed to fill contact form", { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Clicks the Save button and waits for network idle to ensure API/UI completion.
   */
  async clickSave(): Promise<void> {
    try {
      console.info("[ContactsPage] Clicking Save button");
      await test.step('Click Save', async () => {
        await this.saveButton.waitFor({ state: 'visible' });
        await ActionUtils.click(this.saveButton);
        await this.page.waitForLoadState('networkidle');
        console.info("[ContactsPage] Save button clicked and network idle reached");
      });
    } catch (error) {
      console.error("[ContactsPage] Failed to click Save", { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Verifies that the submission was successful via notification or visible confirmation.
   */
  async verifySubmissionSuccess(): Promise<void> {
    try {
      console.info("[ContactsPage] Verifying submission success");
      await test.step('Verify Submission Success', async () => {
        await this.page.waitForLoadState('networkidle');
        await this.successNotification.waitFor({ state: 'visible' });
        await expect(this.successNotification).toBeVisible();
        console.info("[ContactsPage] Submission success notification is visible");
      });
    } catch (error) {
      console.error("[ContactsPage] Submission success verification failed", { message: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Verifies that the newly created contact appears in the contacts list.
   * @param firstName Contact's first name
   * @param lastName Contact's last name
   */
  async verifyContactInList(firstName: string, lastName: string): Promise<void> {
    try {
      const contactFullName = `${firstName} ${lastName}`;
      console.info("[ContactsPage] Verifying contact in list", { contactFullName });
      await test.step('Verify Contact In List', async () => {
        // Wait for list to refresh after creation
        await this.page.waitForLoadState('networkidle');
        const contactRow = this.page.getByText(contactFullName, { exact: false });
        await contactRow.waitFor({ state: 'visible' });
        await expect(contactRow).toBeVisible();
        console.info("[ContactsPage] Contact found in list", { contactFullName });
      });
    } catch (error) {
      console.error("[ContactsPage] Contact not found in list", { message: error.message, stack: error.stack });
      throw error;
    }
  }
}
