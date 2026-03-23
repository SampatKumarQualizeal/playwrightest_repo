import { test, expect } from "@utils/pageFixture.js";
import testData from "@data/Staging/crm/e2e/TC-N001.json";
import { ENV } from "@/config/env.js";

// Standard logger utility for structured logging
const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ level: "INFO", message, ...meta }));
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ level: "ERROR", message, ...meta }));
  },
};

test.describe("TC-N001: Create a new contact - E2E", () => {
  test("Should create a new contact with valid data and display success message", async ({ page, loginPage, contactsPage }) => {
    logger.info("Starting test execution for TC-N001: Create a new contact");
    try {
      await test.step("Navigate to CRM login page and perform login", async () => {
        logger.info("Navigating to login page", { url: ENV.crmUrl });
        await loginPage.goto(ENV.crmUrl);
        logger.info("Waiting for login page to be visible");
        await loginPage.waitForLoginForm();
        logger.info("Performing login", { username: "<hidden>" });
        await loginPage.login(testData.username, testData.password);
        logger.info("Waiting for dashboard/home element after login");
        await loginPage.waitForDashboard();
        logger.info("Login successful");
      });

      await test.step("Navigate to Contacts > Create", async () => {
        logger.info("Navigating to Contacts area");
        await contactsPage.openContactsMenu();
        await contactsPage.waitForContactsList();
        logger.info("Clicking Create contact");
        await contactsPage.clickCreateContact();
        logger.info("Waiting for Create Contact form to be visible");
        await contactsPage.waitForCreateContactForm();
        logger.info("Create Contact form is ready");
      });

      await test.step("Fill in the contact form with test data", async () => {
        logger.info("Filling contact form fields", {
          firstName: testData.firstName,
          lastName: testData.lastName,
          phone: testData.phone,
          company: testData.company,
          email: testData.email,
        });
        await contactsPage.fillContactForm({
          firstName: testData.firstName,
          lastName: testData.lastName,
          phone: testData.phone,
          company: testData.company,
          email: testData.email,
        });
        logger.info("All contact form fields filled");
      });

      await test.step("Save the contact and verify success message", async () => {
        logger.info("Clicking Save button");
        await contactsPage.clickSaveContact();
        logger.info("Waiting for network idle after Save");
        await page.waitForLoadState("networkidle");
        logger.info("Waiting for success message to appear");
        await contactsPage.waitForSuccessMessage();
        const actualMessage = await contactsPage.getSuccessMessageText();
        logger.info("Verifying success message", { actualMessage, expectedMessage: testData.expectedMessage });
        expect(actualMessage).toContain(testData.expectedMessage);
        logger.info("Success message verified and contact creation completed");
      });

      logger.info("Test TC-N001 completed successfully");
    } catch (error) {
      logger.error("Test execution failed", {
        errorMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        step: "See previous logs for step context",
      });
      throw error;
    }
  });
});
