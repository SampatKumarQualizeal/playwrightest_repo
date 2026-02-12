import { test, expect } from '@utils/pageFixture.js';
import { ENV } from '@/config/env.js';
import testData from '@data/Staging/alznetapplication/smoke/ALZ-T134.json' with { type: 'json' };
import { faker } from '@faker-js/faker'; // Import faker

test.describe('ALZ-NET Login and Okta Integration', () => {
  test('Verify user registration through Okta integration', async ({ page, loginPage,homePage }) => {
    const appUrl = ENV.APP_URL;
    const registrationData = testData.registration;

    // Generate dynamic data using faker
    const dynamicFirstName = faker.person.firstName();
    const dynamicLastName = faker.person.lastName();
    const dynamicEmail = faker.internet.email({ firstName: dynamicFirstName, lastName: dynamicLastName, provider: 'gmail.com' }); // Changed provider
    const dynamicSecondaryEmail = faker.internet.email({ firstName: dynamicFirstName, lastName: dynamicLastName, provider: 'gmail.com' }); // Changed provider
    const dynamicPassword = registrationData.password; // Use password from JSON

    await test.step('Navigate to Login Page and verify content', async () => {
      await loginPage.goto(appUrl);
      await loginPage.verifyLoginPageContent();
    });

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
 
  });
});
