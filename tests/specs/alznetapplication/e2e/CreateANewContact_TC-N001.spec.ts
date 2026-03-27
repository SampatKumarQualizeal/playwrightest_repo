import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import contactData from "@data/Staging/alznetapplication/e2e/TC-N001.json";

// Logger fallback (since no logger in repo)
const logger = {
  info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta || ""),
  error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta || "")
};

test.describe("TC-N001: Create a new contact", () => {
  test("Should allow creation of a new contact with valid data and show success message", async ({ page, loginPage, contactsPage }) => {
    // Data-driven: load from test data
    const { firstName, lastName, phone, company, email } = contactData;

    try {
      await test.step("Authenticate using LoginPage", async () => {
        logger.info("Starting authentication step", { username: ENV.username });
        await loginPage.goto(ENV.baseUrl);
        await loginPage.login(ENV.username, ENV.password);
        logger.info("Authentication successful");
        // Wait for dashboard/home element to be visible as post-login confirmation
        await page.locator('a[href="/contacts"]').waitFor({ state: 'visible' });
        logger.info("Dashboard loaded, Contacts menu visible");
      });

      await test.step("Navigate to Contacts and open Create Contact", async () => {
        logger.info("Navigating to Contacts screen");
        await contactsPage.gotoContacts();
        await page.waitForLoadState('networkidle');
        await contactsPage.openCreateContact();
        // Wait for Create Contact form to be visible
        await contactsPage.firstNameField.waitFor({ state: 'visible' });
        logger.info("Create Contact form loaded");
      });

      await test.step("Fill contact details from test data", async () => {
        logger.info("Filling contact form", { firstName, lastName, phone, company, email });
        await contactsPage.fillContactForm({ firstName, lastName, phone, company, email });
        logger.info("Contact form filled");
      });

      await test.step("Save contact and wait for network idle", async () => {
        logger.info("Clicking Save to submit contact");
        const [response] = await Promise.all([
          page.waitForResponse(resp => resp.url().includes('/contacts') && resp.status() === 200),
          contactsPage.saveContact()
        ]);
        await page.waitForLoadState('networkidle');
        logger.info("Save action complete, network idle");
      });

      await test.step("Assert submission success message is displayed", async () => {
        logger.info("Verifying submission success message");
        const successMessage = await contactsPage.getSubmissionSuccessMessage();
        expect(successMessage.toLowerCase()).toContain('success');
        logger.info("Submission success message verified", { message: successMessage });
      });

    } catch (error: any) {
      logger.error("Test execution failed", { message: error.message, stack: error.stack });
      throw error;
    }
  });
});
