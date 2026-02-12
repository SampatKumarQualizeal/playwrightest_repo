import { test, expect } from '@utils/pageFixture.js';
import { ENV } from '@/config/env.js';
import testData from '@data/Staging/alznetapplication/e2e/ALZ-T119.json' with { type: 'json' };

test.describe('Verify the ALZ-NET Landing Page and Site Registration Labels', () => {
  test('Verify the ALZ-NET Landing Page and Site Registration Labels', async ({ page, loginPage, homePage, siteFeasibilityPage }) => {
    // Login as Site Administrator with RMS role
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);
    await loginPage.verifyLoginPageContent();
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
    await homePage.verifylandingPageElements();
    await homePage.verifyEmailUsSection();
    let mainPage=page;

    let registrationFormPage = await siteFeasibilityPage.navigateToSiteRegisterForm();
    await mainPage.bringToFront();
    await homePage.clickAccessMySiteAndVerify(testData.siteName);
    registrationFormPage = await homePage.accessSavedDraftRegistrationForm(testData.siteName);
    //Need to add the validation for Verify system behavior when user has no registered sites.
  });
});
