import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import contactData from "@data/Staging/alznetapplication/e2e/TC-N001.json";

// Logging utility (fallback if not present in repo)
const logger = {
  info: (message: string, meta?: any) => {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, meta || "");
  },
  error: (message: string, meta?: any) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, meta || "");
  }
};

test.describe("TC-N001: Create a new contact", () => {
  test("should create a new contact with valid data and display success message", async ({ page, loginPage, contactsPage }) => {
    try {
      logger.info("Starting test: TC-N001 - Create a new contact");

      await test.step("Login to CRM with environment credentials", async () => {
        logger.info("Logging in using ENV credentials");
        await loginPage.goto(ENV.baseUrl);
        await loginPage.login(ENV.username, ENV.password);
        logger.info("Login successful");
        // Optionally, verify landing page or dashboard loaded
      });

      await test.step("Navigate to Contacts section", async () => {
        logger.info("Navigating to Contacts section");
        await contactsPage.gotoContacts();
        await contactsPage.waitForContactsList();
        logger.info("Contacts section loaded");
      });

      await test.step("Open Create New Contact form", async () => {
        logger.info("Opening Create New Contact form");
        await contactsPage.openCreateContactForm();
        await contactsPage.waitForCreateContactForm();
        logger.info("Create New Contact form is visible");
      });

      await test.step("Fill in contact details from test data", async () => {
        logger.info("Filling contact details", { firstName: contactData.firstName, lastName: contactData.lastName });
        await contactsPage.fillContactFirstName(contactData.firstName);
        await contactsPage.fillContactLastName(contactData.lastName);
        await contactsPage.fillContactPhone(contactData.phone);
        await contactsPage.fillContactCompany(contactData.company);
        await contactsPage.fillContactEmail(contactData.email);
        logger.info("Contact details filled");
      });

      await test.step("Save the new contact and wait for backend processing", async () => {
        logger.info("Clicking Save to create contact");
        await contactsPage.clickSaveContact();
        await page.waitForLoadState('networkidle');
        logger.info("Save action completed, waiting for UI confirmation");
      });

      await test.step("Verify success indicator for contact creation", async () => {
        logger.info("Verifying contact creation success message or list update");
        await contactsPage.waitForContactSuccessIndicator();
        const isContactCreated = await contactsPage.isContactCreated(contactData.firstName, contactData.lastName);
        expect(isContactCreated).toBeTruthy();
        logger.info("Contact created successfully", { firstName: contactData.firstName, lastName: contactData.lastName });
      });

      logger.info("Test TC-N001 completed successfully");
    } catch (error) {
      logger.error("Test TC-N001 failed", { message: error.message, stack: error.stack });
      throw error;
    }
  });
});
