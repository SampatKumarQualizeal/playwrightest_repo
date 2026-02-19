import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import invalidEmailData from "@data/Staging/crm/invalid-email.json";

/**
 * TC-N002: Invalid Email Format Rejection
 * Objective: Verify system rejects invalid email formats and displays appropriate error message.
 * Preconditions: User is logged into the CRM system and navigates to the contact creation screen.
 * Priority: Medium
 * Type: Functional
 */
test.describe("TC-N002: Invalid Email Format Rejection", () => {
  test("should display an error message for invalid email format on contact creation", async ({ loginPage, contactsPage, page }) => {
    // Step 1: Login to CRM
    await test.step("Login to CRM with valid credentials", async () => {
      await loginPage.goto(ENV.CRM_URL);
      await loginPage.login(ENV.CRM_USERNAME, ENV.CRM_PASSWORD);
    });

    // Step 2: Navigate to Contacts and initiate new contact creation
    await test.step("Navigate to Contacts and start new contact creation", async () => {
      await contactsPage.gotoContacts();
      await contactsPage.clickCreateContact();
    });

    // Step 3: Fill contact form with valid data except invalid email
    await test.step("Enter valid Name, Phone, Company, Position and invalid Email", async () => {
      await contactsPage.fillContactName(invalidEmailData.name);
      await contactsPage.fillContactPhone(invalidEmailData.phone);
      await contactsPage.fillContactCompany(invalidEmailData.company);
      await contactsPage.fillContactPosition(invalidEmailData.position);
      await contactsPage.fillContactEmail(invalidEmailData.invalidEmail); // e.g., 'invalidemail.com'
    });

    // Step 4: Click Save
    await test.step("Click Save to attempt contact creation", async () => {
      await contactsPage.clickSaveContact();
    });

    // Step 5: Assert error message for invalid email format
    await test.step("Assert error message for invalid email format is displayed", async () => {
      const errorMessageLocator = contactsPage.emailFormatErrorMessage();
      await expect(errorMessageLocator).toBeVisible({ timeout: 5000 });
      await expect(errorMessageLocator).toHaveText(/invalid email|email.*format/i);
    });
  });
});
