import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import registrationFormData from "@data/Staging/alznetapplication/e2e/site-registration-form-data.json";
import { Logger } from "@/logger/logger.js";

// Test Case: TC_001 - Verify user can login, navigate to Home, open Site Registration, and submit the form

test.describe("ALZ-T001: E2E - User Login, Home Navigation, Site Registration Flow", () => {
  test("TC_001 - User can login, navigate to Home, open Site Registration, and submit the form", async ({ page, loginPage, homePage, siteFeasibilityRegistrationPage, siteFeasibilityRegistrationFormPage }) => {
    const logger = Logger.getInstance();
    let confirmationMessage = "";
    try {
      // Step 1: Launch Login URL and verify Login page is displayed
      logger.info("[Step 1] Navigating to Login page", { url: ENV.AUT_URL });
      await test.step("Navigate to Login page", async () => {
        await loginPage.goto(ENV.AUT_URL);
        logger.info("Login page loaded, verifying content");
        await loginPage.verifyLoginPageContent();
        logger.info("Login page content verified");
      });

      // Step 2: Perform login and verify Home page
      logger.info("[Step 2] Performing login", { username: ENV.USERNAME });
      await test.step("Login and verify Home page", async () => {
        await loginPage.login(ENV.USERNAME, ENV.PASSWORD);
        logger.info("Login submitted, verifying Home page");
        await homePage.verifylandingPageElements();
        logger.info("Home page elements verified");
      });

      // Step 3: Click on "Register My Site" to open Site Registration Form
      logger.info("[Step 3] Navigating to Site Registration form");
      await test.step("Open Site Registration Form", async () => {
        await siteFeasibilityRegistrationPage.navigateToSiteRegisterForm();
        const isFormDisplayed = await siteFeasibilityRegistrationPage.isFormDisplayed(registrationFormData.siteFormName);
        logger.info("Site Registration form displayed", { isFormDisplayed });
        expect(isFormDisplayed).toBeTruthy();
      });

      // Step 4: Fill all mandatory fields using test data and submit
      logger.info("[Step 4] Filling Site Registration form", { testData: registrationFormData });
      await test.step("Fill and Submit Site Registration Form", async () => {
        await siteFeasibilityRegistrationFormPage.fillRegistrationForm(registrationFormData);
        logger.info("All mandatory fields filled");
        await siteFeasibilityRegistrationFormPage.submitRegistrationForm();
        logger.info("Form submitted, verifying confirmation message");
        confirmationMessage = await siteFeasibilityRegistrationFormPage.page.getByText("Thank you for your interest").textContent();
        expect(confirmationMessage).toContain("Thank you for your interest");
        logger.info("Confirmation message verified", { confirmationMessage });
      });

      // Optional: Log out to return to login page
      logger.info("[Optional] Logging out");
      await test.step("Logout and verify return to Login page", async () => {
        await homePage.verifyLogoutBtn();
        await homePage.logout();
        await loginPage.verifyLoginPageContent();
        logger.info("Successfully logged out and returned to Login page");
      });
    } catch (error) {
      logger.error("Test execution failed in ALZ-T001", { error });
      throw error;
    }
  });
});
