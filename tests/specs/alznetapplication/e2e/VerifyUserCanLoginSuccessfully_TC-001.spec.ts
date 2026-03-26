import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import registrationFormTestData from "@data/Staging/alznetapplication/e2e/TC-001.json";
import fallbackRegistrationFormData from "@data/Staging/alznetapplication/e2e/site-registration-form-data.json";

// Simple logger utility for structured logging
const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, meta || "");
  },
  error: (message: string, meta?: Record<string, any>) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, meta || "");
  }
};

test.describe("TC-001: Verify user can login successfully, access Site Registration, and submit form", () => {
  test("User can login, navigate to Site Registration, fill and submit form", async ({ page, loginPage, homePage, registrationFormPage }) => {
    let step = "";
    try {
      // Step 1: Navigate to Login Page
      step = "Navigate to Login Page";
      logger.info("Navigating to login page", { url: "https://alznetapp-uat.acr.org/login" });
      await loginPage.goto("https://alznetapp-uat.acr.org/login");
      await page.waitForLoadState('networkidle');
      await loginPage.verifyLoginPageContent();
      logger.info("Login page loaded and verified");

      // Step 2: Login with ENV credentials
      step = "Login with ENV credentials";
      logger.info("Attempting login", { username: "[REDACTED]" });
      await loginPage.login(ENV.username, ENV.password);
      await page.waitForLoadState('networkidle');
      // Wait for a key Home page element (e.g., Register My Site button) to be visible
      await homePage.verifylandingPageElements();
      logger.info("Login successful, Home page loaded");

      // Step 3: Navigate to Site Registration via HomePage
      step = "Navigate to Site Registration";
      logger.info("Clicking 'Register My Site' button");
      await homePage.clickAccessMySiteAndVerify();
      // Wait for the registration form to be visible
      await registrationFormPage.verifyLogo();
      logger.info("Site Registration Form loaded");

      // Step 4: Fill all mandatory fields using test data
      step = "Fill Site Registration Form";
      let testData = registrationFormTestData;
      if (!testData || Object.keys(testData).length === 0) {
        logger.info("Primary test data not found or empty, falling back to default registration form data");
        testData = fallbackRegistrationFormData;
      }
      logger.info("Filling registration form with test data");
      await registrationFormPage.fillRegistrationFormFromTestData(testData);
      logger.info("Registration form filled");

      // Step 5: Submit the form and verify submission success
      step = "Submit Registration Form";
      logger.info("Submitting registration form");
      const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/api/') && resp.status() === 200),
        registrationFormPage.saveAndSubmitForm()
      ]);
      logger.info("Form submission API response received", { url: response.url(), status: response.status() });
      // Wait for UI confirmation (success message)
      const successMessage = await registrationFormPage.getSubmissionSuccessMessage();
      expect(successMessage).toContain("Thank you");
      logger.info("Submission success message verified", { message: successMessage });

      logger.info("Test completed successfully");
    } catch (error: any) {
      logger.error("Test step failed", { step, message: error.message, stack: error.stack });
      throw error;
    }
  });
});
