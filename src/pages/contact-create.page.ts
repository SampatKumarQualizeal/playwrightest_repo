// src/pages/contact-create.page.ts
import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';
import { ActionUtils } from '@/utils/action-utils.js';

export class ContactCreatePage extends BasePage {
  // Locators for the Create Contact flow
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly emailTypeInput: Locator;
  private readonly emailAddressInput: Locator;
  private readonly addEmailButton: Locator;
  private readonly phoneInput: Locator;
  private readonly companyInput: Locator;
  private readonly categoryDropdown: Locator;
  private readonly categoryOption: (category: string) => Locator;
  private readonly saveButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Inline locator definitions following project conventions
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.emailTypeInput = page.locator('input[name="name"]');
    this.emailAddressInput = page.locator('input[name="value"]');
    this.addEmailButton = page.locator('xpath=//button[contains(@class, "basic icon button") and .//i[@class="add icon"]]');
    this.phoneInput = page.locator('input[name="phone"]'); // TODO: Replace with actual locator if different
    this.companyInput = page.locator('input[name="company"]'); // TODO: Replace with actual locator if different
    this.categoryDropdown = page.locator('xpath=//div[@role="listbox" and contains(@class, "ui selection dropdown")]');
    this.categoryOption = (category: string) => page.locator(`//div[@role='option' and .//span[text()='${category}']]`);
    this.saveButton = page.locator('xpath=//button[contains(@class, "linkedin button") and .//i[@class="save icon"]]');
    this.successMessage = page.locator('.ui.positive.message, .ui.success.message, .ui.message'); // TODO: Adjust selector to match actual success message element
  }

  /**
   * Complete the entire create contact workflow with valid data.
   * This method encapsulates all steps: filling fields, selecting category, saving, and verifying success.
   */
  async createContact(
    firstName: string,
    lastName: string,
    email: string,
    emailType: string,
    phone: string,
    company: string,
    category: string
  ): Promise<void> {
    await test.step('Fill out the new contact form and save', async () => {
      // Fill required fields
      await ActionUtils.fill(this.firstNameInput, firstName);
      await ActionUtils.fill(this.lastNameInput, lastName);
      await ActionUtils.fill(this.phoneInput, phone);
      await ActionUtils.fill(this.companyInput, company);
      // Email section
      await ActionUtils.fill(this.emailInput, email);
      // If there is a separate email address/type section, fill those
      await ActionUtils.fill(this.emailAddressInput, email);
      await ActionUtils.fill(this.emailTypeInput, emailType);
      await this.addEmailButton.click();
      // Category dropdown
      await this.categoryDropdown.click();
      await this.categoryOption(category).click();
      // Save
      await this.saveButton.click();
      // Wait for and verify success message
      await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    });
  }

  /**
   * Verifies that the success message is displayed after contact creation.
   * Optionally, pass the expected message text for assertion.
   */
  async verifyContactCreationSuccess(expectedMessage?: string): Promise<void> {
    await test.step('Verify contact creation success message', async () => {
      await expect(this.successMessage).toBeVisible({ timeout: 10000 });
      if (expectedMessage) {
        await expect(this.successMessage).toContainText(expectedMessage);
      }
    });
  }

  /**
   * Navigates to the contact creation screen. Assumes user is already logged in.
   * If navigation is handled elsewhere, this can be omitted.
   */
  async navigateToCreateContact(): Promise<void> {
    await test.step('Navigate to Create Contact screen', async () => {
      // Example navigation: click Contacts link, then Create button
      const contactsLink = this.page.locator('a[href="/contacts"]');
      const createButton = this.page.locator('xpath=//button[contains(@class, "linkedin button") and .//i[@class="edit icon"]]');
      await contactsLink.click();
      await createButton.click();
      await this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
    });
  }
}
