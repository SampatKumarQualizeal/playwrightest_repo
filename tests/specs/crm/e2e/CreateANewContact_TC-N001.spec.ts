import { test, expect } from "@utils/pageFixture.js";
import testData from "@data/Staging/crm/e2e/TC-N001.json";

/**
 * TC-N001: Create a new contact
 * Objective: Verify system accepts valid inputs and displays appropriate message.
 * Preconditions: User is logged into the CRM system and navigates to the contact creation screen.
 * Steps:
 *   1. Login with valid credentials
 *   2. Enter valid contact details
 *   3. Click 'Save' and verify confirmation message
 * Expected Result: System displays appropriate message and new contact is saved.
 */

test.describe("CRM - Create a New Contact [TC-N001]", () => {
  test("should create a new contact with valid data and display confirmation message", async ({ page, loginPage, contactsPage }) => {
    // Logging utility fallback
    const logger = {
      info: (msg: string, meta?: any) => console.log(`[INFO] ${msg}`, meta || ""),
      error: (msg: string, meta?: any) => console.error(`[ERROR] ${msg}`, meta || "")
    };

    try {
      await test.step("Login to CRM application", async () => {
        logger.info("Starting login step", { step: "login", user: "[REDACTED]" });
        await loginPage.goto();
        await loginPage.login(testData.login.username, testData.login.password);
        logger.info("Login successful", { step: "login" });
        // Wait for dashboard/home element to ensure navigation is complete
        await contactsPage.waitForDashboardLoaded();
        logger.info("Dashboard loaded", { step: "login" });
      });

      await test.step("Navigate to Contacts and open Create Contact screen", async () => {
        logger.info("Navigating to Contacts section", { step: "navigateContacts" });
        await contactsPage.navigateToContacts();
        await contactsPage.waitForContactsListLoaded();
        logger.info("Contacts list loaded", { step: "navigateContacts" });
        await contactsPage.openCreateContact();
        await contactsPage.waitForCreateContactForm();
        logger.info("Create Contact form loaded", { step: "openCreateContact" });
      });

      await test.step("Fill in contact details and save", async () => {
        logger.info("Filling contact details", { step: "fillContact", contact: { firstName: testData.contact.firstName, lastName: testData.contact.lastName } });
        await contactsPage.fillContactFirstName(testData.contact.firstName);
        await contactsPage.fillContactLastName(testData.contact.lastName);
        await contactsPage.fillContactPhoneNumber(testData.contact.phoneNumber);
        await contactsPage.fillContactCompany(testData.contact.company);
        await contactsPage.fillContactEmail(testData.contact.email);
        logger.info("Contact details filled", { step: "fillContact" });
        await contactsPage.clickSaveContact();
        logger.info("Clicked Save", { step: "saveContact" });
        // Wait for network idle and confirmation message
        await contactsPage.waitForContactSaveConfirmation();
        logger.info("Contact save confirmation displayed", { step: "saveContact" });
      });

      await test.step("Verify contact creation confirmation message", async () => {
        logger.info("Verifying confirmation message", { step: "verifyConfirmation" });
        const confirmationMsg = await contactsPage.getContactSaveConfirmationMessage();
        expect(confirmationMsg).toContain(testData.expectedConfirmationMessage);
        logger.info("Confirmation message verified", { step: "verifyConfirmation", confirmationMsg });
      });
    } catch (error) {
      logger.error("Test execution failed", { error: error.message, stack: error.stack });
      throw error;
    }
  });
});
