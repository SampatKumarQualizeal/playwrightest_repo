import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "./base.page.js";

/**
 * Page Object Model for the CRM Contacts creation screen.
 * Models navigation, form interaction, and validation for Contacts.
 */
export class ContactsPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  // --- Locators ---

  /** Locator for the Contacts list link in the sidebar or navigation. */
  get contactsListLink(): Locator {
    return this.page.locator('a[href="/contacts"]');
  }

  /** Locator for the Create button (may be a link or a button). */
  get createContactButton(): Locator {
    // Prefer the button if present, else fallback to link
    return this.page.locator('a[href="/contacts/new"], button:has-text("Create")');
  }

  /** Locator for the Name input field. */
  get nameInput(): Locator {
    return this.page.locator('input[name="name"]');
  }

  /** Locator for the Phone input field. */
  get phoneInput(): Locator {
    return this.page.locator('input[name="phone"]');
  }

  /** Locator for the Company input field. */
  get companyInput(): Locator {
    return this.page.locator('input[name="company"]');
  }

  /** Locator for the Position input field. */
  get positionInput(): Locator {
    return this.page.locator('input[name="position"]');
  }

  /** Locator for the Email input field. */
  get emailInput(): Locator {
    return this.page.locator('input[name="email"]');
  }

  /** Locator for the Save button. */
  get saveButton(): Locator {
    return this.page.locator('button:has-text("Save")');
  }

  /** Locator for the email validation error message. */
  get emailError(): Locator {
    // Assumes error appears near the email input, with role=alert or .error class
    // Adjust selector as needed for your app's error markup
    return this.page.locator('input[name="email"] ~ .error, input[name="email"] ~ [role="alert"], .field:has(input[name="email"]) .error, .field:has(input[name="email"]) [role="alert"]');
  }

  // --- Actions ---

  /**
   * Navigates to the Contacts list page.
   */
  async navigateToContacts(): Promise<void> {
    await test.step('Navigate to Contacts list', async () => {
      await this.contactsListLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      // Optionally, wait for Create button to be visible as page loaded indicator
      await expect(this.createContactButton).toBeVisible({ timeout: 7000 });
    });
  }

  /**
   * Starts the creation of a new contact by clicking the Create button.
   */
  async startCreatingNewContact(): Promise<void> {
    await test.step('Start creating a new contact', async () => {
      await this.createContactButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.nameInput).toBeVisible({ timeout: 7000 });
    });
  }

  /**
   * Fills the contact creation form with provided data.
   * @param name Contact's name
   * @param phone Contact's phone number
   * @param company Contact's company name
   * @param position Contact's position/title
   * @param email Contact's email address
   */
  async fillContactForm({
    name,
    phone,
    company,
    position,
    email
  }: {
    name: string;
    phone: string;
    company: string;
    position: string;
    email: string;
  }): Promise<void> {
    await test.step('Fill contact creation form', async () => {
      if (await this.nameInput.isVisible({ timeout: 7000 })) {
        await this.nameInput.click();
        await this.nameInput.fill(name);
      }
      if (await this.phoneInput.isVisible({ timeout: 7000 })) {
        await this.phoneInput.click();
        await this.phoneInput.fill(phone);
      }
      if (await this.companyInput.isVisible({ timeout: 7000 })) {
        await this.companyInput.click();
        await this.companyInput.fill(company);
      }
      if (await this.positionInput.isVisible({ timeout: 7000 })) {
        await this.positionInput.click();
        await this.positionInput.fill(position);
      }
      if (await this.emailInput.isVisible({ timeout: 7000 })) {
        await this.emailInput.click();
        await this.emailInput.fill(email);
      }
    });
  }

  /**
   * Clicks the Save button to submit the contact form.
   */
  async clickSave(): Promise<void> {
    await test.step('Click Save button', async () => {
      await this.saveButton.click();
      // Wait for either navigation or error message
      await this.page.waitForLoadState('networkidle');
    });
  }

  /**
   * Verifies that the email validation error is displayed.
   * @param expectedMessage (optional) The expected error message text
   */
  async verifyEmailErrorDisplayed(expectedMessage?: string): Promise<void> {
    await test.step('Verify email validation error is displayed', async () => {
      await expect(this.emailError).toBeVisible({ timeout: 5000 });
      if (expectedMessage) {
        await expect(this.emailError).toHaveText(expectedMessage);
      }
    });
  }
}
