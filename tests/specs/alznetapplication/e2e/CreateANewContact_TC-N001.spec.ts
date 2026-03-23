import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@config/env.js";
import testData from "@data/Staging/alznetapplication/e2e/TC-N001.json";

// Lightweight logger for test steps
const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, meta || "");
  },
  error: (message: string, meta?: Record<string, any>) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, meta || "");
  },
};

test.describe("CreateANewContact_TC-N001 - Create a new contact", () => {
  test("CreateANewContact_TC-N001 - Should create a new contact with valid data and display success message", async ({ page, LoginPage, ContactsPage }) => {
    logger.info("Starting test: Create a new contact", { testCase: "TC-N001" });
    try {
      // Step 1: Login
      logger.info("Navigating to login page", { url: ENV.baseUrl });
      await LoginPage.goto(ENV.baseUrl);
      logger.info("Performing login", { user: "[REDACTED]" });
      await LoginPage.login(testData.login.userName, testData.login.password);
      logger.info("Login successful");

      // Step 2: Navigate to Contacts
      logger.info("Navigating to Contacts section");
      await ContactsPage.navigateToContacts();
      await ContactsPage.waitForContactsListVisible();
      logger.info("Contacts list loaded");

      // Step 3: Click Create
      logger.info("Navigating to Create Contact form");
      await ContactsPage.clickCreateContact();
      await ContactsPage.waitForCreateContactFormVisible();
      logger.info("Create Contact form is visible");

      // Step 4: Fill the form
      logger.info("Filling contact creation form", { contact: testData.contact });
      await ContactsPage.fillContactForm(testData.contact);
      logger.info("Contact form filled");

      // Step 5: Save
      logger.info("Saving the new contact");
      const [saveResponse] = await Promise.all([
        page.waitForResponse(resp =>
          resp.url().includes("/contacts") && resp.status() === 200
        ),
        ContactsPage.clickSaveContact()
      ]);
      logger.info("Save request completed", { status: saveResponse.status() });
      await page.waitForLoadState("networkidle");
      logger.info("Network idle after save");

      // Step 6: Validate success message or navigation
      logger.info("Validating success message or navigation");
      const successMessage = await ContactsPage.getSuccessMessage();
      if (successMessage) {
        logger.info("Success message found", { message: successMessage });
        expect(successMessage).toMatch(/(Saved|Contact created|Successfully saved)/i);
      } else {
        // Fallback: check navigation to contacts list
        const isContactsListVisible = await ContactsPage.isContactsListVisible();
        logger.info("Success message not found, checking contacts list visibility", { isContactsListVisible });
        expect(isContactsListVisible).toBeTruthy();
      }
      logger.info("Contact creation validated successfully");
    } catch (error) {
      logger.error("Test execution failed", { error: error.message, stack: error.stack });
      throw error;
    }
  });
});
