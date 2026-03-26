import { test, expect } from "@utils/pageFixture.js";
import testData from "@data/Staging/alznetapplication/e2e/TC-N002.json";
import { ENV } from "@/config/env.js";

/**
 * TC-N002: Invalid Email Format Rejection
 * Objective: Verify system rejects invalid email formats and displays appropriate error message.
 * Preconditions: User is logged in, navigates to contact creation screen.
 * Steps:
 * 1. Enter valid data in Name, Phone Number, Company, and Position fields.
 * 2. Enter an invalid email format (e.g., 'invalidemail.com') in the Email field.
 * 3. Click the 'Save' button.
 * Expected: System displays an error message indicating the email format is invalid. No contact is saved.
 */

test.describe("TC-N002: Invalid Email Format Rejection", () => {
  test("Should reject invalid email format and display error message", async ({ page, loginPage, contactsPage }) => {
    // Logging utility
    const logger = console;
    
    try {
      await test.step("Login with valid credentials from ENV", async () => {
        logger.info("[TC-N002] Navigating to login page and logging in", { url: ENV.BASE_URL });
        await loginPage.goto(ENV.BASE_URL);
        await loginPage.login(ENV.USERNAME, ENV.PASSWORD);
        logger.info("[TC-N002] Login successful");
      });

      await test.step("Navigate to Contacts creation screen", async () => {
        logger.info("[TC-N002] Navigating to /contacts/new");
        await page.goto("/contacts/new");
        await page.waitForLoadState("networkidle");
        // Wait for the Name field to be visible as a readiness check
        await contactsPage.nameField.waitFor({ state: "visible" });
        logger.info("[TC-N002] Contacts creation screen loaded");
      });

      await test.step("Fill in contact details with invalid email", async () => {
        logger.info("[TC-N002] Filling Name", { value: testData.name });
        await contactsPage.nameField.waitFor({ state: "visible" });
        await contactsPage.nameField.fill(testData.name);

        logger.info("[TC-N002] Filling Phone Number", { value: testData.phone });
        await contactsPage.phoneField.waitFor({ state: "visible" });
        await contactsPage.phoneField.fill(testData.phone);

        logger.info("[TC-N002] Filling Company", { value: testData.company });
        await contactsPage.companyField.waitFor({ state: "visible" });
        await contactsPage.companyField.fill(testData.company);

        logger.info("[TC-N002] Filling Position", { value: testData.position });
        await contactsPage.positionField.waitFor({ state: "visible" });
        await contactsPage.positionField.fill(testData.position);

        logger.info("[TC-N002] Filling Email with invalid format", { value: testData.invalidEmail });
        await contactsPage.emailField.waitFor({ state: "visible" });
        await contactsPage.emailField.fill(testData.invalidEmail);
      });

      await test.step("Click Save and wait for validation", async () => {
        logger.info("[TC-N002] Clicking Save button");
        await contactsPage.saveButton.waitFor({ state: "visible" });
        await contactsPage.saveButton.click();
        logger.info("[TC-N002] Save clicked, waiting for network idle");
        await page.waitForLoadState("networkidle");
      });

      await test.step("Assert error message for invalid email format", async () => {
        logger.info("[TC-N002] Checking for email format error message");
        await contactsPage.emailError.waitFor({ state: "visible" });
        await expect(contactsPage.emailError).toBeVisible();
        await expect(contactsPage.emailError).toContainText(/invalid email|email.*format/i);
        logger.info("[TC-N002] Error message for invalid email format displayed");
      });

      await test.step("Assert navigation did not proceed to success", async () => {
        logger.info("[TC-N002] Verifying still on contact creation page");
        expect(page.url()).toContain("/contacts/new");
        // Optionally, check that no success indicator is present
        await expect(contactsPage.successBanner).not.toBeVisible();
        logger.info("[TC-N002] Navigation did not proceed to success");
      });
    } catch (error) {
      logger.error("[TC-N002] Test execution failed", { message: error.message, stack: error.stack });
      throw error;
    }
  });
});
