import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/login.page';
import { TestDataUtils } from '../../../src/utils/test-data-utils';

// Path to test data file (relative to project root)
const TEST_DATA_PATH = 'test-data/Staging/alznetapplication/e2e/verify-user-can-login-successfully-data.json';

let loginTestData: any;

test.describe('TC_001 - Verify user can login successfully', () => {
  test.beforeAll(async () => {
    // Load test data once for all tests in this suite
    loginTestData = await TestDataUtils.loadJSONData(TEST_DATA_PATH);
    if (!loginTestData || !loginTestData.loginScenarios) {
      throw new Error('Login test data could not be loaded or is missing loginScenarios array.');
    }
  });

  test('should display all key login page UI elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('https://alznetapp-uat.acr.org/login');
    await loginPage.verifyLoginPageUIElements();
  });

  // Only run valid login scenarios for successful login navigation
  for (const scenario of (loginTestData?.loginScenarios || [])) {
    if (scenario.expectedResult === 'success') {
      test(`Valid Login: ${scenario.scenario}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAndVerifyHomeNavigation(
          'https://alznetapp-uat.acr.org/login',
          scenario.username,
          scenario.password
        );
        // Optionally, add more assertions here if HomePage object is available
      });
    }
  }

  // Optionally, add negative login tests (invalid credentials, etc.)
  // These should assert that login fails and error messages are shown
  for (const scenario of (loginTestData?.loginScenarios || [])) {
    if (scenario.expectedResult === 'failure') {
      test(`Invalid Login: ${scenario.scenario}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto('https://alznetapp-uat.acr.org/login');
        // Use the login workflow up to error assertion
        // The login.page.ts may need a method for negative login (not required for this positive test case)
        await test.step('Attempt login with invalid credentials', async () => {
          await loginPage.goto('https://alznetapp-uat.acr.org/login');
          await loginPage.loginButton.waitFor({ state: 'visible', timeout: 20000 });
          await loginPage.loginButton.click();
          await loginPage.usernameField.waitFor({ state: 'visible', timeout: 10000 });
          await loginPage.usernameField.fill(scenario.username);
          await loginPage.loginBtn.click();
          await loginPage.loginPasswordField.waitFor({ state: 'visible', timeout: 10000 });
          await loginPage.loginPasswordField.fill(scenario.password);
          await loginPage.loginBtn.click();
        });
        // Assert error message (if error message locator/method exists in LoginPage)
        // Example: await loginPage.verifyErrorMessage(scenario.errorMessage);
        // For now, just check that we are NOT navigated to Home page
        await expect(page).not.toHaveURL(/home\//);
      });
    }
  }
});
