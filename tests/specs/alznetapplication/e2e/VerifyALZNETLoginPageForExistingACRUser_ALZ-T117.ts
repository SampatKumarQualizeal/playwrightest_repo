import { test, expect } from '@utils/pageFixture.js';
import { ENV } from '@/config/env.js';

test.describe('Verify ALZ-NET Login page for existing ACR users', () => {
  test('Verify ALZ-NET Login page for existing ACR users', async ({ page, loginPage, homePage, siteFeasibilityPage }) => {
    // Login as Site Administrator with RMS role
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);
    await loginPage.verifyLoginPageContent();
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
    await homePage.verifylandingPageElements();

  });
});
