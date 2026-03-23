import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object for Contacts-related UI interactions in the CRM system.
 * Encapsulates navigation, form actions, and success verification for contacts.
 */
export class ContactsPage extends BasePage {
  private readonly contactsNavLink: Locator;
  private readonly createContactLink: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly phoneInput: Locator;
  private readonly companyInput: Locator;
  private readonly emailInput: Locator;
  private readonly saveButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.contactsNavLink = page.locator('a[href="/contacts"]');
    this.createContactLink = page.locator('a[href="/contacts/new"]');
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.companyInput = page.locator('input[name="company"]');
    this.emailInput = page.locator('input[name="email"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.successMessage = page.locator('div.ui.positive.message, div[role="alert"]:has-text("success")');
  }

  /**
   * Navigates to the Contacts list page.
   */
  async gotoContacts(): Promise<void> {
    await test.step('Navigate to Contacts list', async () => {
      try {
        console.info("[ContactsPage] Navigating to Contacts list", { selector: 'a[href=\"/contacts\"]' });
        await ActionUtils.click(this.contactsNavLink);
        await expect(this.page).toHaveURL(/\/contacts/);
        console.info("[ContactsPage] Arrived at Contacts list");
      } catch (error) {
        console.error("[ContactsPage] Failed to navigate to Contacts list", { error });
        throw error;
      }
    });
  }

  /**
   * Opens the Create New Contact form.
   */
  async startNewContact(): Promise<void> {
    await test.step('Open Create New Contact form', async () => {
      try {
        console.info("[ContactsPage] Opening Create New Contact form", { selector: 'a[href=\"/contacts/new\"]' });
        await ActionUtils.click(this.createContactLink);
        await expect(this.firstNameInput).toBeVisible({ timeout: 7000 });
        console.info("[ContactsPage] Create Contact form is visible");
      } catch (error) {
        console.error("[ContactsPage] Failed to open Create Contact form", { error });
        throw error;
      }
    });
  }

  /**
   * Fills in the contact details in the form.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param email - Contact's email address
   */
  async fillContactDetails(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    await test.step('Fill in contact details', async () => {
      try {
        console.info("[ContactsPage] Filling in contact details", { firstName, lastName, phone, company, email });
        await ActionUtils.fill(this.firstNameInput, firstName);
        await ActionUtils.fill(this.lastNameInput, lastName);
        await ActionUtils.fill(this.phoneInput, phone);
        await ActionUtils.fill(this.companyInput, company);
        await ActionUtils.fill(this.emailInput, email);
        console.info("[ContactsPage] Contact details filled");
      } catch (error) {
        console.error("[ContactsPage] Failed to fill contact details", { error });
        throw error;
      }
    });
  }

  /**
   * Clicks the Save button to submit the new contact.
   */
  async saveContact(): Promise<void> {
    await test.step('Save the new contact', async () => {
      try {
        console.info("[ContactsPage] Clicking Save button", { selector: 'button:has-text(\"Save\")' });
        await ActionUtils.click(this.saveButton);
        console.info("[ContactsPage] Save button clicked");
      } catch (error) {
        console.error("[ContactsPage] Failed to click Save button", { error });
        throw error;
      }
    });
  }

  /**
   * Verifies that a success message is displayed after saving the contact.
   */
  async verifySuccessMessageDisplayed(): Promise<void> {
    await test.step('Verify success message is displayed', async () => {
      try {
        console.info("[ContactsPage] Verifying success message");
        await expect(this.successMessage).toBeVisible({ timeout: 10000 });
        console.info("[ContactsPage] Success message displayed");
      } catch (error) {
        console.error("[ContactsPage] Success message not found", { error });
        throw error;
      }
    });
  }
}
