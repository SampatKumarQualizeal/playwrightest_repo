import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import testData from "@data/Staging/alznetapplication/e2e/TC-N002-invalid-email.json";

/**
 * TC-N002: Invalid Email Format Rejection
 * Objective: Verify system rejects invalid email formats and displays appropriate error message.
 * Preconditions: User is logged into the CRM system and navigates to the contact creation screen.
 * Priority: Medium
 */
test.describe('TC-N002: Invalid Email Format Rejection', () => {
  test('should display error and prevent saving when email format is invalid', async ({ page, loginPage, contactsPage }) => {
    // Step 1: Login to CRM
    await test.step('Login to CRM with valid credentials', async () => {
      const username = testData.username || ENV.CRM_USERNAME;
      const password = testData.password || ENV.CRM_PASSWORD;
      await loginPage.goto(ENV.CRM_URL);
      await loginPage.login(username, password);
      // Optionally, verify successful login (e.g., dashboard visible)
      await expect(page).toHaveURL(/dashboard|home/i);
    });

    // Step 2: Navigate to Contacts and click Create
    await test.step('Navigate to Contacts and click Create', async () => {
      await contactsPage.gotoContacts();
      await contactsPage.clickCreateContact();
      await expect(contactsPage.contactForm).toBeVisible();
    });

    // Step 3: Fill in Name, Phone, Company, Position, and Email (invalid format)
    await test.step('Fill in contact details with invalid email', async () => {
      const name = `${testData.firstName} ${testData.lastName}`;
      await contactsPage.fillName(name);
      await contactsPage.fillPhone(testData.phone);
      await contactsPage.fillCompany(testData.company);
      await contactsPage.fillPosition(testData.position);
      await contactsPage.fillEmail(testData.invalidEmail); // e.g., 'invalidemail.com'
    });

    // Step 4: Click Save
    await test.step('Click Save to attempt to create contact', async () => {
      await contactsPage.clickSave();
    });

    // Step 5: Capture and assert the email validation error
    await test.step('Assert email validation error is displayed', async () => {
      const emailError = await contactsPage.getEmailErrorMessage();
      expect(emailError).toMatch(/invalid email/i);
    });

    // Step 6: Optionally confirm that no contact is saved
    await test.step('Verify no contact is saved and no success message appears', async () => {
      await expect(contactsPage.successMessage).not.toBeVisible();
      // Optionally, assert still on the contact creation form
      await expect(contactsPage.contactForm).toBeVisible();
    });
  });
});
