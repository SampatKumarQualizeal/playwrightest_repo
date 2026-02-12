// tests/specs/AccessSiteFeasibilityRegistrationForm_TCD_FT_01_FR-1.spec.ts
import { test, expect } from '@utils/pageFixture.js';
import { ENV } from '@/config/env.js';
import testData from '@data/Staging/alznetapplication/smoke/ALZ-T135.json' with { type: 'json' };

// Test Case: TCD_FT_01_FR-1 Verify registration landing page elements
test.describe('Verify registration landing page elements [TCD_FT_01_FR-1]', () => {
  test('Verify landing page elements after login', async ({ page, loginPage, homePage, siteFeasibilityPage }) => {
    // Login as Site Administrator with RMS role
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);

    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
    await homePage.verifylandingPageElements();

    const siteRegistrationFormPage = await siteFeasibilityPage.navigateToSiteRegisterForm();
    await siteRegistrationFormPage.isFormDisplayed(testData.siteFormName);
    const imageRegistrationFormPage = await siteFeasibilityPage.navigateToImageRegisterForm();
    await imageRegistrationFormPage.isFormDisplayed(testData.ImageRegistrationFormTabText);

    //click Access My site and verify the button pop up should open to select IF from drop down list which are already available to the account and Go button to proceed.
    //click Access My facility and verify the button pop up should open to select IF from drop down list which are already available to the account and Go button to proceed.

  });
});
