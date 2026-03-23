import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { ActionUtils } from "@/utils/action-utils";

/**
 * Page Object for Contacts section in CRM.
 * Automates the Create Contact flow: navigation, form fill, save, and success message retrieval.
 */
class ContactsPage extends BasePage {
  private readonly contactsNavLink: Locator;
  private readonly createContactBtn: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly phoneInput: Locator;
  private readonly companyInput: Locator;
  private readonly emailInput: Locator;
  private readonly saveButton: Locator;
  private readonly successMessage: Locator;
  private readonly logger: { info: (msg: string, meta?: any) => void; error: (msg: string, meta?: any) => void };

  constructor(page: Page) {
    super(page);
    this.contactsNavLink = page.locator('a[href="/contacts"]');
    this.createContactBtn = page.locator('a[href="/contacts/new"]');
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.companyInput = page.locator('input[name="company"]');
    this.emailInput = page.locator('input[name="email"]');
    this.saveButton = page.locator('button:has-text("Save")');
    // Assuming the success message appears in a div with class 'ui positive message' or similar
    this.successMessage = page.locator('div.ui.positive.message, div[role="alert"]');
    this.logger = {
      info: (msg, meta) => console.log(`INFO: ${msg}`, meta ?? ''),
      error: (msg, meta) => console.error(`ERROR: ${msg}`, meta ?? '')
    };
  }

  /**
   * Navigates to the Contacts section.
   */
  async navigateToContacts(): Promise<void> {
    try {
      this.logger.info("Navigating to Contacts section", { selector: 'a[href="/contacts"]' });
      await ActionUtils.click(this.contactsNavLink);
      await this.page.waitForLoadState('networkidle');
      await this.contactsNavLink.waitFor({ state: 'visible' });
      this.logger.info("Successfully navigated to Contacts section");
    } catch (error) {
      this.logger.error("Failed to navigate to Contacts section", { error, step: 'navigateToContacts' });
      throw error;
    }
  }

  /**
   * Opens the Create Contact form.
   */
  async openCreateContact(): Promise<void> {
    try {
      this.logger.info("Opening Create Contact form", { selector: 'a[href="/contacts/new"]' });
      await this.createContactBtn.waitFor({ state: 'visible' });
      await ActionUtils.click(this.createContactBtn);
      await this.page.waitForLoadState('networkidle');
      await this.firstNameInput.waitFor({ state: 'visible' });
      this.logger.info("Create Contact form is open and ready");
    } catch (error) {
      this.logger.error("Failed to open Create Contact form", { error, step: 'openCreateContact' });
      throw error;
    }
  }

  /**
   * Fills the Create Contact form fields.
   * @param firstName First Name
   * @param lastName Last Name
   * @param phone Phone Number
   * @param company Company Name
   * @param email Email Address
   */
  async fillContactForm(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    try {
      this.logger.info("Filling Create Contact form", { firstName, lastName, phone, company, email });
      await this.firstNameInput.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.firstNameInput, firstName);
      await this.lastNameInput.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.lastNameInput, lastName);
      await this.phoneInput.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.phoneInput, phone);
      await this.companyInput.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.companyInput, company);
      await this.emailInput.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.emailInput, email);
      this.logger.info("All fields filled in Create Contact form");
    } catch (error) {
      this.logger.error("Failed to fill Create Contact form", { error, step: 'fillContactForm' });
      throw error;
    }
  }

  /**
   * Clicks the Save button to create the contact and waits for confirmation.
   */
  async saveContact(): Promise<void> {
    try {
      this.logger.info("Saving new contact", { selector: 'button:has-text("Save")' });
      await this.saveButton.waitFor({ state: 'visible' });
      await ActionUtils.click(this.saveButton);
      await this.page.waitForLoadState('networkidle');
      await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
      this.logger.info("Contact saved and success message displayed");
    } catch (error) {
      this.logger.error("Failed to save new contact", { error, step: 'saveContact' });
      throw error;
    }
  }

  /**
   * Retrieves the submission/success message after creating a contact.
   * @returns The success message text or null if not found.
   */
  async getSubmissionSuccessMessage(): Promise<string | null> {
    try {
      this.logger.info("Retrieving submission success message");
      await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
      const message = await this.successMessage.textContent();
      this.logger.info("Submission success message retrieved", { message });
      return message?.trim() ?? null;
    } catch (error) {
      this.logger.error("Failed to retrieve submission success message", { error, step: 'getSubmissionSuccessMessage' });
      return null;
    }
  }
}

export { ContactsPage };
