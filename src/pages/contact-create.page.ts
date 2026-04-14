import { Page, Locator, test, expect } from '@playwright/test';

// Simple logger fallback for step-level logging
const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(`[INFO] ${message}`, meta || '');
  },
  error: (message: string, meta?: Record<string, any>) => {
    console.error(`[ERROR] ${message}`, meta || '');
  },
};

export class ContactCreatePage {
  private readonly page: Page;

  // Locators for contact fields
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly phoneField: Locator;
  private readonly companyField: Locator;
  private readonly emailField: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Primary and fallback locators for each field
    this.firstNameField = page.locator('input[name="first_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'first_name\' and @type=\'text\']')
    // page.locator('cssSelector=input[name="first_name"]')

    this.lastNameField = page.locator('input[name="last_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'last_name\' and @type=\'text\']')
    // page.locator('cssSelector=input[name="last_name"]')

    this.phoneField = page.locator('input[name="phone"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'phone\']')
    // page.locator('cssSelector=input[name="phone"]')

    this.companyField = page.locator('input[name="company"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'company\']')
    // page.locator('cssSelector=input[name="company"]')

    this.emailField = page.locator('input[name="email"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'email\' and @type=\'text\' and @placeholder=\'Email\']')
    // page.locator('cssSelector=input[name="email"][placeholder="Email"]')

    this.saveButton = page.locator('xpath=//button[normalize-space()="Save"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('className=linkedin')
  }

  // Step 2: Fill contact details (first name, last name, phone, company, email) and prepare for save
  async fillContactDetails(firstName: string, lastName: string, phone: string, company: string, email: string): Promise<void> {
    // Step 2
    try {
      logger.info('Step 2: Filling contact details', { firstName, lastName, phone, company, email });
      await test.step('Fill in contact details', async () => {
        // Synchronize and fill first name
        logger.info('Waiting for first name field to be visible');
        await this.firstNameField.waitFor({ state: 'visible' });
        await this.firstNameField.fill(firstName);
        logger.info('Filled first name');

        // Synchronize and fill last name
        logger.info('Waiting for last name field to be visible');
        await this.lastNameField.waitFor({ state: 'visible' });
        await this.lastNameField.fill(lastName);
        logger.info('Filled last name');

        // Synchronize and fill phone
        logger.info('Waiting for phone field to be visible');
        await this.phoneField.waitFor({ state: 'visible' });
        await this.phoneField.fill(phone);
        logger.info('Filled phone');

        // Synchronize and fill company
        logger.info('Waiting for company field to be visible');
        await this.companyField.waitFor({ state: 'visible' });
        await this.companyField.fill(company);
        logger.info('Filled company');

        // Synchronize and fill email
        logger.info('Waiting for email field to be visible');
        await this.emailField.waitFor({ state: 'visible' });
        await this.emailField.fill(email);
        logger.info('Filled email');
      });
      logger.info('Step 2: Successfully filled contact details');
    } catch (error: any) {
      logger.error('Error occurred while filling contact details', {
        message: error.message,
        stack: error.stack,
        step: 'Step 2: fillContactDetails',
      });
      throw error;
    }
  }

  // Step 3: Click the 'Save' button and wait for network idle, then retrieve success message
  async clickSave(): Promise<string | null> {
    // Step 3
    try {
      logger.info('Step 3: Attempting to click the Save button');
      await test.step('Click the Save button', async () => {
        // Synchronize on Save button visibility
        logger.info('Waiting for Save button to be visible');
        await this.saveButton.waitFor({ state: 'visible' });
        logger.info('Save button visible, clicking Save');
        await this.saveButton.click();
        logger.info('Clicked Save button, waiting for network idle');
        await this.page.waitForLoadState('networkidle');
        logger.info('Network idle reached after Save click');
      });

      // Attempt to retrieve a brief success message if present
      logger.info('Attempting to retrieve success message after Save');
      const successMessageLocator = this.page.locator('.ui.positive.message, .alert-success, .success-message'); // Try common success message selectors
      // SECONDARY LOCATORS (fallback)
      // this.page.locator('text=Contact created successfully')
      // this.page.locator('div[role="alert"]')
      let messageText: string | null = null;
      if (await successMessageLocator.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        messageText = await successMessageLocator.first().textContent();
        logger.info('Success message retrieved', { messageText });
      } else {
        logger.info('No visible success message found after Save');
      }
      logger.info('Step 3: Save action complete');
      return messageText;
    } catch (error: any) {
      logger.error('Error occurred during Save action', {
        message: error.message,
        stack: error.stack,
        step: 'Step 3: clickSave',
      });
      throw error;
    }
  }
}
