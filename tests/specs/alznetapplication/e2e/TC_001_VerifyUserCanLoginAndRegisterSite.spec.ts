import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import loginTestData from "@data/Staging/alznetapplication/e2e/ALZ-T118.json";
import siteRegistrationFormData from "@data/Staging/alznetapplication/e2e/site-registration-form-data.json";

/**
 * TC_001: Verify user can login successfully and register a site
 * Priority: Medium | Type: Functional
 * Steps:
 * 1. Launch login URL and verify login page is displayed
 * 2. Login with valid credentials (from ALZ-T118.json)
 * 3. Verify Home page is loaded
 * 4. Click "Register My Site" and reach Site Feasibility Registration Form
 * 5. Fill all mandatory fields (from site-registration-form-data.json) and submit
 * 6. Assert confirmation message is displayed and matches expected text
 */

test.describe("TC_001: Verify user can login successfully and register a site", () => {
  test("User can login and register a site successfully", async ({ pageObjects }) => {
    const { LoginPage, HomePage, SiteFeasibilityRegistrationFormPage } = pageObjects;

    // Step 1: Navigate to login page and verify
    await test.step("Navigate to login page and verify login page is displayed", async () => {
      await LoginPage.goto(ENV.ALZNET_LOGIN_URL || "https://alznetapp-uat.acr.org/login");
      await LoginPage.verifyLoginPageContent();
    });

    // Step 2: Login using credentials from test data
    await test.step("Login with valid credentials", async () => {
      await LoginPage.login(loginTestData.username, loginTestData.password);
    });

    // Step 3: Verify Home page is loaded and user is authenticated
    await test.step("Verify Home page is loaded and user is authenticated", async () => {
      await HomePage.verifylandingPageElements();
      await HomePage.verifyLogoutBtn();
    });

    // Step 4: Navigate to Site Feasibility Registration Form
    await test.step("Navigate to Site Feasibility Registration Form", async () => {
      await SiteFeasibilityRegistrationFormPage.navigateToSiteFeasibilityRegistrationForm();
      const isFormDisplayed = await SiteFeasibilityRegistrationFormPage.isRegistrationFormDisplayed();
      expect(isFormDisplayed).toBeTruthy();
    });

    // Step 5: Fill all mandatory fields and submit
    await test.step("Fill all mandatory fields and submit the registration form", async () => {
      await SiteFeasibilityRegistrationFormPage.fillRegistrationForm(siteRegistrationFormData);
      await SiteFeasibilityRegistrationFormPage.submitRegistrationForm();
    });

    // Step 6: Assert confirmation message is displayed and matches expected text
    await test.step("Assert confirmation message is displayed", async () => {
      // The confirmation message text is usually in registrationFormText.thankYouText
      const expectedMessage = siteRegistrationFormData.registrationFormText?.thankYouText ||
        "Thank you for your interest in becoming a participating site of the Alzheimer’s Network for Treatment and Diagnostics (ALZ-NET).";
      // The method below should return the actual message displayed after submission
      const actualMessage = await SiteFeasibilityRegistrationFormPage.getSubmissionSuccessMessage?.();
      expect(actualMessage).toContain(expectedMessage);
    });
  });
});
