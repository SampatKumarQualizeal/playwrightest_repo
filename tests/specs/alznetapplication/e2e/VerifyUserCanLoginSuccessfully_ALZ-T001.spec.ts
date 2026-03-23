import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import testData from "@data/Staging/alznetapplication/e2e/ALZ-T001.json";

// Simple logger utility for structured logging
const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.info(`[INFO] ${message}`, meta || "");
  },
  error: (message: string, meta?: Record<string, any>) => {
    console.error(`[ERROR] ${message}`, meta || "");
  }
};

test.describe('ALZ-T001: Verify user can login and register site successfully', () => {
  test('TC_001: User should be able to login and register site successfully', async ({ page, loginPage, homePage, registrationFormPage, siteFeasibilityRegistrationFormPage }) => {
    logger.info('Starting test: User should be able to login and register site successfully');
    let loginUrl = ENV.AZLNET_LOGIN_URL || 'https://alznetapp-uat.acr.org/login';

    try {
      await test.step('Navigate to Login Page', async () => {
        logger.info('Navigating to login page', { url: loginUrl });
        await page.goto(loginUrl, { waitUntil: 'networkidle', timeout: 90000 });
        // Wait for login form to be visible (username/email field)
        await loginPage.waitForLoginForm();
        logger.info('Login page loaded and login form is visible');
      });
    } catch (error) {
      logger.error('Navigation to login page failed', { error: error.message, stack: error.stack });
      throw error;
    }

    try {
      await test.step('Perform Login', async () => {
        logger.info('Attempting login with provided credentials');
        await loginPage.login(testData.username, testData.password);
        // Wait for home page to load by waiting for a key element
        await homePage.waitForHomePageLoaded();
        logger.info('Login successful, home page loaded');
      });
    } catch (error) {
      logger.error('Login failed', { error: error.message, stack: error.stack });
      throw error;
    }

    try {
      await test.step('Click Register My Site button', async () => {
        logger.info('Clicking Register My Site button');
        await homePage.clickRegisterMySiteButton();
        // Wait for registration form to be visible
        await registrationFormPage.waitForRegistrationFormLoaded();
        logger.info('Site Registration Form is displayed');
      });
    } catch (error) {
      logger.error('Navigation to Site Registration Form failed', { error: error.message, stack: error.stack });
      throw error;
    }

    try {
      await test.step('Fill and Submit Registration Form', async () => {
        logger.info('Filling mandatory fields in Registration Form', { fields: Object.keys(testData) });
        await registrationFormPage.fillMandatoryFields(testData);
        logger.info('Submitting Registration Form');
        const [response] = await Promise.all([
          page.waitForResponse(resp => resp.url().includes('/api/site-registration') && resp.status() === 200),
          registrationFormPage.submitForm()
        ]);
        logger.info('Registration Form submitted, waiting for confirmation message');
        await registrationFormPage.waitForSubmissionConfirmation();
        logger.info('Form submission confirmed');
      });
    } catch (error) {
      logger.error('Filling or submitting Registration Form failed', { error: error.message, stack: error.stack });
      throw error;
    }

    try {
      await test.step('Assert Confirmation Message', async () => {
        logger.info('Asserting confirmation message is displayed');
        const confirmationMessage = await registrationFormPage.getSubmissionSuccessMessage();
        expect(confirmationMessage).toContain('Thank you');
        logger.info('Confirmation message assertion passed', { confirmationMessage });
      });
    } catch (error) {
      logger.error('Confirmation message assertion failed', { error: error.message, stack: error.stack });
      throw error;
    }

    logger.info('Test completed successfully');
  });
});
