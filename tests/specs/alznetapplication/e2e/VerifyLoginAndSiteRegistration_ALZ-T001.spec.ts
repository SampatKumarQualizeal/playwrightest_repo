import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import testData from "@data/Staging/alznetapplication/e2e/ALZ-T001.json";

/**
 * TC_001 (ALZ-T001): Verify user can login successfully, open the Site Feasibility & Registration Form, populate required fields, submit, and verify confirmation.
 *
 * Steps:
 * 1. Navigate to login URL and login with testData.username/testData.password via LoginPage.
 * 2. Validate Home page loaded (verify logout button or landing elements).
 * 3. From Home, navigate to Register My Site.
 * 4. On Site Feasibility Registration Form page, fill required fields and submit.
 * 5. Assert that a confirmation message is displayed and submission acknowledged.
 */
test.describe("ALZ-T001: Login and Site Registration End-to-End", () => {
  test("TC_001: User can login, register site, and see confirmation", async ({ page, loginPage, homePage, siteFeasibilityRegistrationFormPage }) => {
    // Step 1: Navigate to login URL and login
    await test.step("Navigate to login page and perform login", async () => {
      const loginUrl = ENV.AZLNET_LOGIN_URL || "https://alznetapp-uat.acr.org/login";
      await loginPage.goto(loginUrl);
      await loginPage.verifyLoginPageContent();
      await loginPage.login(testData.username, testData.password);
    });

    // Step 2: Validate Home page loaded
    await test.step("Validate Home page is loaded", async () => {
      await homePage.verifyLogoutBtn();
      await homePage.verifylandingPageElements();
      // Optionally, verify user is logged in as expected
      if (testData.username) {
        await expect(page.locator('text=' + testData.username)).not.toHaveCount(0);
      }
    });

    // Step 3: Navigate to Register My Site
    await test.step("Navigate to Register My Site (Site Feasibility & Registration Form)", async () => {
      // Assuming the HomePage has a method to navigate to the registration form
      // If not, use the siteFeasibilityRegistrationFormPage's navigation method
      if (typeof homePage.navigateToRegisterMySite === 'function') {
        await homePage.navigateToRegisterMySite();
      } else if (typeof siteFeasibilityRegistrationFormPage.navigateToSiteFeasibilityRegistrationForm === 'function') {
        await siteFeasibilityRegistrationFormPage.navigateToSiteFeasibilityRegistrationForm();
      } else {
        // Fallback: Click via locator
        await page.getByRole('button', { name: /Register My Site/i }).click();
      }
      // Wait for the form to be displayed
      await expect(page.locator('text=Site Feasibility & Registration Form')).toBeVisible({ timeout: 10000 });
      await siteFeasibilityRegistrationFormPage.isRegistrationFormDisplayed();
    });

    // Step 4: Fill all mandatory fields and submit
    await test.step("Fill all mandatory fields in registration form and submit", async () => {
      await siteFeasibilityRegistrationFormPage.fillRegistrationForm(testData);
      await siteFeasibilityRegistrationFormPage.submitRegistrationForm();
    });

    // Step 5: Assert confirmation message
    await test.step("Verify confirmation message is displayed", async () => {
      // Expect a confirmation message (success toast, dialog, or inline message)
      const confirmationMessage = testData.registrationFormText?.thankYouText || "Thank you for your interest in ALZ-NET.";
      // Try multiple selectors for robustness
      const confirmationLocators = [
        page.locator('text=' + confirmationMessage),
        page.locator('role=alert').filter({ hasText: confirmationMessage }),
        page.locator('div').filter({ hasText: confirmationMessage })
      ];
      let found = false;
      for (const locator of confirmationLocators) {
        if (await locator.isVisible({ timeout: 5000 }).catch(() => false)) {
          found = true;
          break;
        }
      }
      expect(found).toBeTruthy();
    });
  });
});
