import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import testData from "@data/Staging/alznetapplication/e2e/TC-N001.json";

// Logger fallback (if not present in repo, this is a safe stub)
class Logger {
  static info(message: string, meta?: any) { console.info('[INFO]', message, meta ?? ''); }
  static error(message: string, meta?: any) { console.error('[ERROR]', message, meta ?? ''); }
}

test.describe('TC-N001: Create a new contact', () => {
  test('should create a new contact with valid data and display confirmation', async ({ page, loginPage, contactsPage }) => {
    let contactSubmissionMessage: string | undefined;

    // Step 1: Login using ENV credentials
    await test.step('Login to CRM system', async () => {
      Logger.info('Navigating to login page', { url: ENV.baseUrl });
      try {
        await loginPage.goto(ENV.baseUrl);
        Logger.info('Filling in login credentials');
        await loginPage.login(ENV.username, ENV.password);
        Logger.info('Waiting for CRM dashboard to load');
        await page.waitForLoadState('networkidle');
        Logger.info('Login successful');
      } catch (error) {
        Logger.error('Login failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });

    // Step 2: Navigate to Create Contact screen
    await test.step('Navigate to Create Contact screen', async () => {
      Logger.info('Navigating to Contacts section');
      try {
        await contactsPage.navigateToCreateContact();
        Logger.info('Waiting for Create Contact form to be visible');
        await contactsPage.waitForCreateContactForm();
        Logger.info('Create Contact form is visible');
      } catch (error) {
        Logger.error('Navigation to Create Contact failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });

    // Step 3: Fill in contact details
    await test.step('Fill in new contact details', async () => {
      Logger.info('Filling in contact details', {
        firstName: testData.firstName,
        lastName: testData.lastName,
        phone: testData.phone,
        company: testData.company,
        email: testData.email
      });
      try {
        await contactsPage.fillContactForm({
          firstName: testData.firstName,
          lastName: testData.lastName,
          phone: testData.phone,
          company: testData.company,
          email: testData.email
        });
        Logger.info('Contact details filled');
      } catch (error) {
        Logger.error('Filling contact details failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });

    // Step 4: Click Save and wait for confirmation
    await test.step('Save the new contact and wait for confirmation', async () => {
      Logger.info('Clicking Save button for new contact');
      try {
        const [response] = await Promise.all([
          page.waitForResponse(resp => resp.url().includes('/contacts') && resp.status() === 200),
          contactsPage.saveContact()
        ]);
        Logger.info('Waiting for network to be idle after save');
        await page.waitForLoadState('networkidle');
        Logger.info('Waiting for submission confirmation message');
        contactSubmissionMessage = await contactsPage.getSubmissionMessage();
        Logger.info('Contact submission message received', { message: contactSubmissionMessage });
      } catch (error) {
        Logger.error('Saving contact failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });

    // Step 5: Assert confirmation is displayed
    await test.step('Verify contact creation confirmation message', async () => {
      Logger.info('Asserting that the confirmation message is displayed');
      try {
        expect(contactSubmissionMessage).toBeDefined();
        expect(contactSubmissionMessage).toMatch(/success|created|saved/i);
        Logger.info('Contact creation confirmation message verified', { confirmation: contactSubmissionMessage });
      } catch (error) {
        Logger.error('Confirmation message assertion failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  });
});
