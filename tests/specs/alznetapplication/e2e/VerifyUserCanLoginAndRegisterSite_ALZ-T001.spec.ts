import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import { TestDataUtils } from "@/utils/test-data-utils.js";

// Import test data for login and site registration
import loginAndRegistrationData from "@data/Staging/alznetapplication/e2e/ALZ-T001.json";

/**
 * TC_001: Verify user can login successfully and register a site
 * Steps:
 * 1. Launch login page
 * 2. Login with credentials from test data
 * 3. Navigate to Site Registration form via 'Register My Site'
 * 4. Fill all mandatory fields and submit
 * 5. Assert successful submission
 */
test.describe("ALZ-T001: Verify user can login and register site", () => {
  test("TC_001: User can login and submit site registration form successfully", async ({ pageObjects }) => {
    const { LoginPage, HomePage, SiteFeasibilityRegistrationFormPage } = pageObjects;
    const loginUrl = ENV.ALZNET_LOGIN_URL || "https://alznetapp-uat.acr.org/login";
    const {
      username,
      password,
      siteRegistrationFormData,
      registrationFormText
    } = loginAndRegistrationData;

    // Step 1: Launch login page
    await test.step("Launch the ALZ-NET login page", async () => {
      await LoginPage.goto(loginUrl);
      await LoginPage.verifyLoginPageContent();
      await expect(pageObjects.page).toHaveURL(/login/);
    });

    // Step 2: Login with credentials
    await test.step("Login with valid credentials", async () => {
      await LoginPage.login(username, password);
      // Wait for Home page to load
      await HomePage.verifylandingPageElements();
      await expect(pageObjects.page).toHaveURL(/home/);
    });

    // Step 3: Navigate to Site Registration form
    await test.step("Navigate to Site Registration form via 'Register My Site'", async () => {
      // This method should navigate to the registration form
      await SiteFeasibilityRegistrationFormPage.navigateToSiteFeasibilityRegistrationForm();
      const isFormDisplayed = await SiteFeasibilityRegistrationFormPage.isRegistrationFormDisplayed();
      expect(isFormDisplayed).toBeTruthy();
    });

    // Step 4: Fill all mandatory fields and submit
    await test.step("Fill all mandatory fields in the Site Registration form and submit", async () => {
      // Fill the registration form using test data
      await SiteFeasibilityRegistrationFormPage.fillRegistrationForm(siteRegistrationFormData);
      await SiteFeasibilityRegistrationFormPage.submitRegistrationForm();
    });

    // Step 5: Assert successful submission
    await test.step("Assert successful submission and confirmation message", async () => {
      // The confirmation message is expected to contain the thank you text from test data
      const successMessage = await SiteFeasibilityRegistrationFormPage.page.getByText(registrationFormText.thankYouText).textContent();
      expect(successMessage).toContain(registrationFormText.thankYouText);
    });
  });
});
