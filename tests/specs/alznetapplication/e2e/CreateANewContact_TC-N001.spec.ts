import { test, expect } from "@utils/pageFixture.js";
import contactData from "@data/Staging/alznetapplication/e2e/TC-N001.json";
import { ENV } from "@/config/env.js";

// Simple logger utility for structured logging
const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, meta || "");
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, meta || "");
  },
};

test.describe('CreateANewContact_TC-N001 - Create a new contact via Contacts UI', () => {
  test('TC-N001: System accepts valid inputs and displays appropriate message', async ({ page, loginPage, contactsPage }) => {
    logger.info('Starting test: TC-N001 - Create a new contact');
    let contactFullName = '';
    try {
      await test.step('Load contact test data', async () => {
        logger.info('Loaded contact test data', { contactData });
      });

      await test.step('Login to CRM application', async () => {
        logger.info('Navigating to login page', { url: ENV.baseUrl });
        await loginPage.goto(ENV.baseUrl);
        logger.info('Waiting for login page to be visible');
        await loginPage.verifyLoginPageContent();
        logger.info('Performing login', { username: ENV.username });
        await loginPage.login(ENV.username, ENV.password);
        logger.info('Login successful');
      });

      await test.step('Navigate to Contacts section', async () => {
        logger.info('Navigating to Contacts page');
        await contactsPage.gotoContacts();
        logger.info('Waiting for Contacts page to be visible');
        await contactsPage.waitForContactsListVisible();
      });

      await test.step('Open Create Contact form', async () => {
        logger.info('Opening Create Contact form');
        await contactsPage.openCreateContactForm();
        logger.info('Waiting for Create Contact form to be visible');
        await contactsPage.waitForCreateContactFormVisible();
      });

      await test.step('Fill in new contact details', async () => {
        logger.info('Filling contact details', {
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          phone: contactData.phone,
          company: contactData.company,
          email: contactData.email,
        });
        await contactsPage.fillContactForm({
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          phone: contactData.phone,
          company: contactData.company,
          email: contactData.email,
        });
        contactFullName = `${contactData.firstName} ${contactData.lastName}`;
        logger.info('Contact details filled', { contactFullName });
      });

      await test.step('Save the new contact', async () => {
        logger.info('Clicking Save button');
        await contactsPage.saveContact();
        logger.info('Waiting for network to be idle after Save');
        await page.waitForLoadState('networkidle');
        logger.info('Save action completed');
      });

      await test.step('Verify new contact creation', async () => {
        logger.info('Verifying if new contact appears in Contacts list or success message is displayed', { contactFullName });
        const isContactPresent = await contactsPage.isContactPresent(contactFullName, contactData.email);
        const isSuccessMessageVisible = await contactsPage.isSuccessMessageVisible();
        logger.info('Verification result', { isContactPresent, isSuccessMessageVisible });
        expect(
          isContactPresent || isSuccessMessageVisible,
          `Expected new contact '${contactFullName}' to be present in the list or success message to be visible.`
        ).toBeTruthy();
        logger.info('Contact creation verified successfully');
      });

      logger.info('Test TC-N001 completed successfully');
    } catch (error: any) {
      logger.error('Test TC-N001 failed', {
        message: error.message,
        stack: error.stack,
        step: 'Create a new contact',
      });
      throw error;
    }
  });
});
