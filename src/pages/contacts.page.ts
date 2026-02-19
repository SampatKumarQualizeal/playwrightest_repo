import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "@pages/base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object for the CRM Contacts page and contact creation flow.
 * Follows repository conventions: camelCase locators, constructor-based initialization, and robust selectors.
 */
export class ContactsPage extends BasePage {
  private readonly contactsNavLink: Locator;
  private readonly createContactButton: Locator;
  private readonly nameInput: Locator;
  private readonly phoneInput: Locator;
  private readonly companyInput: Locator;
  private readonly positionInput: Locator;
  private readonly emailInput: Locator;
  private readonly saveButton: Locator;
  private readonly emailErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.contactsNavLink = page.locator('a[href="/contacts"]');
    this.createContactButton = page.locator('a[href="/contacts/new"], button:has-text("Create")');
    this.nameInput = page.locator('input[name="name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.companyInput = page.locator('input[name="company"]');
    this.positionInput = page.locator('input[name="position"]');
    this.emailInput = page.locator('input[name="email"]');
    this.saveButton = page.locator('button:has-text("Save")');
    // Email error message is typically shown as a sibling or beneath the email input; adjust as needed
    this.emailErrorMessage = page.locator('div.ui.error.message, .field:has(input[name="email"]) .ui.error.message, .field:has(input[name="email"]) .error-message, .field:has(input[name="email"]) .error');
  }

  /**
   * Navigates to the Contacts page.
   */
  async navigateToContacts(): Promise<void> {
    await test.step('Navigate to Contacts page', async () => {
      await ActionUtils.click(this.contactsNavLink);
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.contactsNavLink).toHaveAttribute('class', /active|selected/);
    });
  }

  /**
   * Opens the Create Contact form.
   */
  async openCreateContact(): Promise<void> {
    await test.step('Open Create Contact form', async () => {
      await ActionUtils.click(this.createContactButton);
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.nameInput).toBeVisible({ timeout: 7000 });
    });
  }

  /**
   * Fills the contact creation form with provided details.
   * @param name Contact name
   * @param phone Phone number
   * @param company Company name
   * @param position Position/Title
   * @param email Email address
   */
  async fillContactDetails(name: string, phone: string, company: string, position: string, email: string): Promise<void> {
    await test.step('Fill Contact Details', async () => {
      await this.nameInput.waitFor({ state: 'visible', timeout: 7000 });
      await ActionUtils.fill(this.nameInput, name);
      if (await this.phoneInput.isVisible()) {
        await ActionUtils.fill(this.phoneInput, phone);
      }
      if (await this.companyInput.isVisible()) {
        await ActionUtils.fill(this.companyInput, company);
      }
      if (await this.positionInput.isVisible()) {
        await ActionUtils.fill(this.positionInput, position);
      }
      await ActionUtils.fill(this.emailInput, email);
    });
  }

  /**
   * Clicks the Save button to submit the contact form.
   */
  async saveContact(): Promise<void> {
    await test.step('Save Contact', async () => {
      await ActionUtils.click(this.saveButton);
      // Wait for either navigation, error message, or form reload
      await this.page.waitForTimeout(1000); // Short wait for UI response
    });
  }

  /**
   * Retrieves the email format error message displayed on the form.
   * @returns The error message text
   */
  async getEmailErrorMessage(): Promise<string> {
    await test.step('Get Email Error Message', async () => {
      await this.emailErrorMessage.waitFor({ state: 'visible', timeout: 5000 });
    });
    return (await this.emailErrorMessage.textContent())?.trim() || '';
  }
}
