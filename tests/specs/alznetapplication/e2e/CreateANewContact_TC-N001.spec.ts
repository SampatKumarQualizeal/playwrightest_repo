import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import loginData from "@data/TC-N001.json";

// Simple logger utility for structured logging
const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ level: 'INFO', message, ...meta }));
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ level: 'ERROR', message, ...meta }));
  }
};

test.describe('TC-N001: Create a new contact', () => {
  test('should create a new contact with valid data and verify success message', async ({ page, LoginPage, ContactsPage }) => {
    try {
      logger.info('Starting test: TC-N001 - Create a new contact');

      // Step 1: Login to CRM
      logger.info('Navigating to authentication page', { url: ENV.baseUrl + '/login' });
      await LoginPage.goto(ENV.baseUrl + '/login');
      await page.waitForLoadState('networkidle');
      logger.info('Authentication page loaded, performing login');
      await LoginPage.login(loginData.login.username, loginData.login.password);
      await page.waitForLoadState('networkidle');
      // Wait for a key UI element after login (e.g., Contacts menu)
      await ContactsPage.contactsMenu.waitFor({ state: 'visible' });
      logger.info('Login successful and dashboard loaded');

      // Step 2: Navigate to Contacts and open create contact form
      logger.info('Navigating to Contacts section');
      await ContactsPage.navigateToContacts();
      await ContactsPage.contactsListHeader.waitFor({ state: 'visible' });
      logger.info('Contacts page loaded');
      logger.info('Opening create contact form');
      await ContactsPage.openCreateContactForm();
      await ContactsPage.createContactForm.waitFor({ state: 'visible' });
      logger.info('Create contact form is visible');

      // Step 3: Fill contact form and save
      logger.info('Filling contact form with test data', {
        firstName: loginData.contact.firstName,
        lastName: loginData.contact.lastName,
        phone: loginData.contact.phone,
        company: loginData.contact.company,
        email: loginData.contact.email
      });
      await ContactsPage.fillContactDetails(
        loginData.contact.firstName,
        loginData.contact.lastName,
        loginData.contact.phone,
        loginData.contact.company,
        loginData.contact.email
      );
      logger.info('Saving new contact');
      await ContactsPage.saveContact();
      await page.waitForLoadState('networkidle');
      logger.info('Save action triggered, waiting for confirmation');

      // Step 4: Verify success message
      await ContactsPage.successMessage.waitFor({ state: 'visible' });
      logger.info('Success message is visible, verifying content');
      await ContactsPage.verifySubmissionSuccess(loginData.expectedMessage);
      logger.info('Contact creation verified successfully', { expectedMessage: loginData.expectedMessage });
    } catch (error: any) {
      logger.error('Test execution failed', {
        errorMessage: error?.message,
        stack: error?.stack,
        step: 'Create a new contact'
      });
      throw error;
    }
  });
});
