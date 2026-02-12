import { test, expect } from '@utils/pageFixture.js';
import { ENV } from '@/config/env.js';
import testData from '@data/Staging/alznetapplication/e2e/ALZ-T118.json' with { type: 'json' };
import { faker } from '@faker-js/faker'; // Import faker

test.describe('Verify ALZ-NET Login page for New ACR users', () => {
  test('Verify ALZ-NET Login page for New ACR users', async ({ page, loginPage, homePage, siteFeasibilityPage }) => {
    // Login as Site Administrator with RMS role
    const appUrl = ENV.APP_URL;
    const registrationData = testData.registration;
    // Generate dynamic data using faker
    const dynamicFirstName = faker.person.firstName();
    const dynamicLastName = faker.person.lastName();
    const dynamicEmail = faker.internet.email({ firstName: dynamicFirstName, lastName: dynamicLastName, provider: 'gmail.com' }); // Changed provider
    const dynamicSecondaryEmail = faker.internet.email({ firstName: dynamicFirstName, lastName: dynamicLastName, provider: 'gmail.com' }); // Changed provider
    const dynamicPassword = registrationData.password; // Use password from JSON

    await loginPage.goto(appUrl);
    await loginPage.verifyLoginPageContent();
    await test.step('Initiate account creation', async () => {
      await loginPage.clickCreateAccount();
    });

    await test.step('Fill registration form', async () => {
      await loginPage.fillRegistrationForm(
        dynamicEmail,
        dynamicPassword,
        dynamicFirstName,
        dynamicLastName,
        dynamicSecondaryEmail
      );
    });

    await test.step('Submit registration and verify success message', async () => {
      await loginPage.clickRegisterButton();
      await loginPage.verifyVerificationEmailSentMessage();
    });
    //In case if it is a new user Logout and Login to verify this Once the user fills out all required fields and clicks the Login/Register button, they should be redirected and able to see the ALZ-NET Landing page successfully.

  });
});
