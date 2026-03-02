import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "@pages/base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * ContactsPage encapsulates selectors and actions for the CRM contacts module.
 * It supports navigation, contact creation, and verification flows.
 */
export class ContactsPage extends BasePage {
  private readonly contactsNavLink: Locator;
  private readonly createContactNavLink: Locator;
  private readonly createButton: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly emailField: Locator;
  private readonly saveButton: Locator;
  private readonly successToast: Locator;

  constructor(page: Page) {
    super(page);
    this.contactsNavLink = page.locator('a[href="/contacts"]');
    this.createContactNavLink = page.locator('a[href="/contacts/new"]');
    this.createButton = page.locator('button:has-text("Create")');
    this.firstNameField = page.locator('input[name="first_name"]');
    this.lastNameField = page.locator('input[name="last_name"]');
    this.phoneField = page.locator('input[name="phone"]');
    this.companyField = page.locator('input[name="company"]');
    this.emailField = page.locator('input[name="email"]');
    this.saveButton = page.locator('button:has-text("Save")');
    // Assuming a toast or message with class 'ui.success.message' or similar for success
    this.successToast = page.locator('.ui.success.message, .ui.toast.success, .toast-success, .ui.positive.message, .ui.toast.positive, .toast-positive, .ui.toast, .ui.message:has-text("success")');
  }

  /**
   * Navigates to the Contacts list page.
   */
  async navigateToContacts(): Promise<void> {
    await test.step('Navigate to Contacts page', async () => {
      await ActionUtils.click(this.contactsNavLink);
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.page).toHaveURL(/\/contacts/);
    });
  }

  /**
   * Opens the Create Contact form via navigation link or Create button.
   */
  async openCreateContact(): Promise<void> {
    await test.step('Open Create Contact form', async () => {
      // Prefer navigation link if visible, else fallback to button
      if (await this.createContactNavLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        await ActionUtils.click(this.createContactNavLink);
      } else {
        await ActionUtils.click(this.createButton);
      }
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.firstNameField).toBeVisible({ timeout: 5000 });
    });
  }

  /**
   * Fills out the contact creation form fields.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param email - Contact's email address
   */
  async fillContactDetails(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill contact creation form', async () => {
      await ActionUtils.fill(this.firstNameField, firstName);
      await ActionUtils.fill(this.lastNameField, lastName);
      await ActionUtils.fill(this.phoneField, phone);
      await ActionUtils.fill(this.companyField, company);
      await ActionUtils.fill(this.emailField, email);
    });
  }

  /**
   * Clicks the Save button to submit the contact form.
   */
  async saveContact(): Promise<void> {
    await test.step('Save new contact', async () => {
      await ActionUtils.click(this.saveButton);
      // Wait for possible network and UI update
      await this.page.waitForLoadState('networkidle');
    });
  }

  /**
   * Verifies that the contact was saved successfully by checking for a success message or toast.
   */
  async verifyContactSaved(): Promise<void> {
    await test.step('Verify contact saved successfully', async () => {
      // Wait for the toast/message to appear
      await expect(this.successToast).toBeVisible({ timeout: 5000 });
      // Optionally, check for specific text
      const toastText = await this.successToast.textContent();
      if (toastText && !/success|created|saved|added/i.test(toastText)) {
        throw new Error(`Expected a success message, but got: ${toastText}`);
      }
    });
  }
}
