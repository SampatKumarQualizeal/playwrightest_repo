import { test, expect } from '@utils/pageFixture.js';
import { ENV } from '@/config/env.js';

// Simple logger fallback (if project logger is not available)
const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, meta || '');
  },
  error: (message: string, meta?: Record<string, any>) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, meta || '');
  },
};

// Step 1: perform login using ENV credentials and navigate to the New Contact creation screen
// Covers: Login and navigation to contact creation page

test('Step 1: perform login using ENV credentials and navigate to the New Contact creation screen', async ({ page, loginPage }) => {
  logger.info('Starting Step 1: Login and navigate to New Contact creation screen', { testCase: 'TC-N001' });
  try {
    // Launch the application (URL from ENV)
    logger.info('Navigating to application login page', { url: ENV.baseUrl });
    await loginPage.goto(ENV.baseUrl);
    logger.info('Application login page loaded');

    // Wait for login page to be visible
    await test.step('Wait for login page to be visible', async () => {
      await loginPage.verifyLoginPageContent();
      logger.info('Login page content verified');
    });

    // Perform login using ENV credentials
    logger.info('Attempting login with ENV credentials (username and password from ENV)');
    await test.step('Login to CRM system', async () => {
      await loginPage.login(ENV.username, ENV.password);
      logger.info('Login submitted');
    });

    // Wait for navigation to dashboard/home after login
    logger.info('Waiting for dashboard/home page to load after login');
    await page.waitForLoadState('networkidle');
    // Wait for a key UI element (Contacts menu) to be visible
    await test.step('Wait for Contacts menu to be visible', async () => {
      await expect(page.getByRole('link', { name: 'Contacts' })).toBeVisible();
      logger.info('Contacts menu is visible');
    });

    // Navigate to Contacts page
    logger.info('Navigating to Contacts page');
    await test.step('Navigate to Contacts page', async () => {
      await page.getByRole('link', { name: 'Contacts' }).click();
    });
    // Wait for Contacts page to load
    await page.waitForLoadState('networkidle');
    await test.step('Wait for Create Contact button/link to be visible', async () => {
      await expect(page.getByRole('link', { name: 'Create' })).toBeVisible();
      logger.info('Create Contact link is visible');
    });

    // Navigate to Create New Contact screen
    logger.info('Navigating to Create New Contact screen');
    await test.step('Navigate to Create New Contact screen', async () => {
      await page.getByRole('link', { name: 'Create' }).click();
    });
    // Wait for New Contact form to be visible
    await test.step('Wait for New Contact form to be visible', async () => {
      await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
      logger.info('New Contact creation form is visible');
    });

    logger.info('Step 1 completed successfully: User is on New Contact creation screen');
  } catch (error: any) {
    logger.error('Error during Step 1: Login and navigation to New Contact creation screen', {
      message: error.message,
      stack: error.stack,
      step: 'Step 1',
    });
    throw error;
  }
});

// Step 2: Fill contact details on the New Contact form using predefined data (firstName, lastName, phone, company, email)
test('Step 2: Fill contact details on the New Contact form using predefined data (firstName, lastName, phone, company, email)', async ({ page }) => {
  logger.info('Starting Step 2: Fill contact details on the New Contact form', { testCase: 'TC-N001' });
  try {
    // Test data for the new contact
    const contactData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-123-4567',
      company: 'Acme Corporation',
      email: 'john.doe.validemail.com', // Note: intentionally missing '@' to match example
    };

    // Wait for the First Name field to be visible
    logger.info('Waiting for First Name field to be visible');
    const firstNameField = page.locator('input[name="first_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'first_name\' and @type=\'text\']')
    // page.locator('cssSelector=input[name="first_name"]')
    await firstNameField.waitFor({ state: 'visible' });
    logger.info('First Name field is visible');

    // Fill First Name
    logger.info('Filling First Name', { value: contactData.firstName });
    await firstNameField.fill(contactData.firstName);
    logger.info('First Name filled successfully');

    // Wait for Last Name field to be visible
    logger.info('Waiting for Last Name field to be visible');
    const lastNameField = page.locator('input[name="last_name"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'last_name\' and @type=\'text\']')
    // page.locator('cssSelector=input[name="last_name"]')
    await lastNameField.waitFor({ state: 'visible' });
    logger.info('Last Name field is visible');

    // Fill Last Name
    logger.info('Filling Last Name', { value: contactData.lastName });
    await lastNameField.fill(contactData.lastName);
    logger.info('Last Name filled successfully');

    // Wait for Phone Number field to be visible
    logger.info('Waiting for Phone Number field to be visible');
    const phoneField = page.locator('input[name="phone"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'phone\' and @type=\'text\']')
    // page.locator('cssSelector=input[name="phone"]')
    await phoneField.waitFor({ state: 'visible' });
    logger.info('Phone Number field is visible');

    // Fill Phone Number
    logger.info('Filling Phone Number', { value: contactData.phone });
    await phoneField.fill(contactData.phone);
    logger.info('Phone Number filled successfully');

    // Wait for Company field to be visible
    logger.info('Waiting for Company field to be visible');
    const companyField = page.locator('input[name="company"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'company\' and @type=\'text\']')
    // page.locator('cssSelector=input[name="company"]')
    await companyField.waitFor({ state: 'visible' });
    logger.info('Company field is visible');

    // Fill Company
    logger.info('Filling Company', { value: contactData.company });
    await companyField.fill(contactData.company);
    logger.info('Company filled successfully');

    // Wait for Email field to be visible
    logger.info('Waiting for Email field to be visible');
    const emailField = page.locator('input[name="email"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name=\'email\' and @type=\'text\' and @placeholder=\'Email\']')
    // page.locator('cssSelector=input[name="email"][placeholder="Email"]')
    await emailField.waitFor({ state: 'visible' });
    logger.info('Email field is visible');

    // Fill Email
    logger.info('Filling Email', { value: contactData.email });
    await emailField.fill(contactData.email);
    logger.info('Email filled successfully');

    logger.info('Step 2 completed successfully: All contact details filled on New Contact form');
  } catch (error: any) {
    logger.error('Error during Step 2: Fill contact details on the New Contact form', {
      message: error.message,
      stack: error.stack,
      step: 'Step 2',
    });
    throw error;
  }
});

// Step 3: Click Save on the New Contact form and verify a success/confirmation message appears (synchronization via networkidle after click).
test('Step 3: Click Save on the New Contact form and verify a success/confirmation message appears (synchronization via networkidle after click).', async ({ page }) => {
  logger.info('Starting Step 3: Click Save on the New Contact form and verify confirmation message', { testCase: 'TC-N001' });
  try {
    // Wait for Save button to be visible
    logger.info('Waiting for Save button to be visible');
    const saveButton = page.locator('xpath=//button[normalize-space()="Save"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('className=linkedin')
    await saveButton.waitFor({ state: 'visible' });
    logger.info('Save button is visible');

    // Click Save button
    logger.info('Clicking Save button');
    await saveButton.click();
    logger.info('Save button clicked');

    // Wait for backend/network activity to complete
    logger.info('Waiting for networkidle after Save click');
    await page.waitForLoadState('networkidle');
    logger.info('Networkidle state reached after Save');

    // Wait for success/confirmation message to appear
    logger.info('Waiting for confirmation/success message to appear');
    // Try to find a generic success message, adjust selector as needed
    const confirmationMessage = page.locator('div.ui.positive.message, div[role="alert"]:has-text("success"), div:has-text("Contact created successfully"), div:has-text("successfully")');
    await confirmationMessage.waitFor({ state: 'visible', timeout: 10000 });
    logger.info('Confirmation message is visible');

    // Assert that the confirmation message contains expected text
    await test.step('Verify confirmation message is displayed', async () => {
      await expect(confirmationMessage).toBeVisible();
      logger.info('Confirmation message displayed successfully');
    });

    logger.info('Step 3 completed successfully: Confirmation message verified after saving contact');
  } catch (error: any) {
    logger.error('Error during Step 3: Click Save and verify confirmation message', {
      message: error.message,
      stack: error.stack,
      step: 'Step 3',
    });
    throw error;
  }
});
