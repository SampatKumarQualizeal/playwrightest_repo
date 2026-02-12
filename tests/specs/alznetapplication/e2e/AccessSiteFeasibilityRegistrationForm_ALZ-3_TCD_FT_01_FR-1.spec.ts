// tests/specs/AccessSiteFeasibilityRegistrationForm_TCD_FT_01_FR-1.spec.ts
import { test, expect } from '@utils/pageFixture.js';
import testData from '@data/Staging/alznetapplication/e2e/access-site-feasibility-and-registration-form-data.json' with { type: 'json' };
import { ENV } from '@/config/env.js';

// Test Case: TCD_FT_01_FR-1 - Access Site Feasibility & Registration Form
test.describe('Access Site Feasibility & Registration Form [TCD_FT_01_FR-1]', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
  });

  test('Site Administrator can access the Site Feasibility & Registration Form', async ({ siteFeasibilityPage }) => {
    const registrationFormPage = await siteFeasibilityPage.navigateToSiteRegisterForm();
    await registrationFormPage.isFormDisplayed(testData.siteFormName);
  });
});