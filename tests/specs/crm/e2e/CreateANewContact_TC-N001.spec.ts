import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import contactData from "@data/Staging/crm/e2e/TC-N001.json";

/**
 * TC-N001: Create a new contact
 * Objective: Verify system accepts valid inputs and displays appropriate message.
 * Preconditions: User is logged into the CRM system and navigates to the contact creation screen.
 * Post-conditions: New contact is saved in the CRM system.
 */

test.describe("CRM - Create a New Contact | TC-N001", () => {
  test("should create a new contact with valid details and display a success message [TC-N001]", async ({ page, loginPage, contactsPage }) => {
    const logger = test.info().annotations.find(a => a.type === 'logger')?.description || console;
    try {
      await test.step("Login to Application", async () => {
        logger.info("[TC-N001] Starting login step");
        await loginPage.goto(ENV.baseUrl);
        logger.info("Navigated to login page", { url: ENV.baseUrl });
        await loginPage.login(ENV.username, ENV.password);
        logger.info("Submitted login credentials");
        // Wait for navigation and dashboard/home element
        await page.waitForLoadState('networkidle');
        logger.info("Page loaded after login (networkidle)");
        await expect(page).toHaveURL(/.*dashboard|.*home|.*contacts/i);
        logger.info("Login successful, dashboard/home loaded");
      });

      await test.step("Navigate to Contacts section", async () => {
        logger.info("Navigating to Contacts section");
        await contactsPage.gotoContacts();
        logger.info("Contacts page navigation triggered");
        await page.waitForLoadState('networkidle');
        logger.info("Contacts page loaded (networkidle)");
        await contactsPage.waitForContactsList();
        logger.info("Contacts list is visible");
      });

      await test.step("Open Create Contact form", async () => {
        logger.info("Opening Create Contact form");
        await contactsPage.openCreateContactForm();
        await contactsPage.waitForCreateContactForm();
        logger.info("Create Contact form is visible");
      });

      await test.step("Fill Contact Details", async () => {
        logger.info("Filling contact details", { contactData });
        await contactsPage.fillContactFirstName(contactData.firstName);
        logger.info("First name entered", { firstName: contactData.firstName });
        await contactsPage.fillContactLastName(contactData.lastName);
        logger.info("Last name entered", { lastName: contactData.lastName });
        await contactsPage.fillContactPhoneNumber(contactData.phoneNumber);
        logger.info("Phone number entered", { phoneNumber: contactData.phoneNumber });
        await contactsPage.fillContactCompany(contactData.company);
        logger.info("Company entered", { company: contactData.company });
        await contactsPage.fillContactEmail(contactData.email);
        logger.info("Email entered", { email: contactData.email });
      });

      await test.step("Save Contact", async () => {
        logger.info("Clicking Save button for new contact");
        await contactsPage.clickSaveContact();
        await page.waitForLoadState('networkidle');
        logger.info("Save triggered, waiting for network idle");
        await contactsPage.waitForContactSaveSuccessMessage();
        logger.info("Success message appeared after saving contact");
      });

      await test.step("Verify Success Message", async () => {
        logger.info("Verifying success message for contact creation");
        const successMsg = await contactsPage.getContactSaveSuccessMessage();
        logger.info("Success message retrieved", { successMsg });
        expect(successMsg).toMatch(/successfully created|contact created|saved successfully/i);
        logger.info("Success message assertion passed");
      });

      logger.info("[TC-N001] Test completed successfully");
    } catch (error) {
      logger.error("[TC-N001] Test execution failed", {
        message: error.message,
        stack: error.stack,
        step: test.info().title
      });
      throw error;
    }
  });
});
