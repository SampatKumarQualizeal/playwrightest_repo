import { test, expect } from "@utils/pageFixture.js";
import testData from "@data/Staging/alznetapplication/e2e/ALZ-TN001.json";
import { ENV } from "@/config/env.js";
import { LoginPage } from "@/pages/login.page.js";
import { ContactsPage } from "@/pages/contacts.page.js";

// Simple logger fallback for step-level logging
const logger = {
  info: (msg: string, meta?: any) => console.log(`INFO: ${msg}`, meta ?? ""),
  error: (msg: string, err?: any) => console.error(`ERROR: ${msg}`, err ?? "")
};

test("TC-N001: Create a new contact", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const contactsPage = new ContactsPage(page);

  try {
    await test.step("Login to CRM", async () => {
      logger.info("Navigating to login page", { url: ENV.APP_URL });
      await loginPage.goto(ENV.APP_URL);
      await page.waitForLoadState('networkidle');
      logger.info("Performing login", { username: testData.username });
      await loginPage.login(testData.username, testData.password);
      // Wait for a key post-login UI element (Contacts menu)
      const contactsMenu = page.locator('a[href="/contacts"]');
      await contactsMenu.waitFor({ state: 'visible' });
      logger.info("Login successful and Contacts menu visible");
    });

    await test.step("Navigate to Contacts and open Create", async () => {
      logger.info("Navigating to Contacts page");
      await contactsPage.navigateToContacts();
      // Wait for Contacts page to load and Create button to be visible
      const createContactBtn = page.locator('a[href="/contacts/new"]');
      await createContactBtn.waitFor({ state: 'visible' });
      logger.info("Opening Create Contact form");
      await contactsPage.openCreateContact();
      // Wait for the contact creation form to be visible
      const firstNameField = page.locator('input[name="first_name"]');
      await firstNameField.waitFor({ state: 'visible' });
      logger.info("Create Contact form loaded");
    });

    await test.step("Fill contact details", async () => {
      logger.info("Filling contact form", {
        firstName: testData.firstName,
        lastName: testData.lastName,
        phone: testData.phone,
        company: testData.company,
        email: testData.email
      });
      await contactsPage.fillContactForm(
        testData.firstName,
        testData.lastName,
        testData.phone,
        testData.company,
        testData.email
      );
      // Wait for Save button to be visible before clicking
      const saveBtn = page.locator('button:has-text("Save")');
      await saveBtn.waitFor({ state: 'visible' });
      logger.info("Saving new contact");
      const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/contacts') && resp.status() === 200),
        contactsPage.saveContact()
      ]);
      await page.waitForLoadState('networkidle');
      logger.info("Contact save API completed", { status: response.status() });
    });

    await test.step("Verify contact creation", async () => {
      logger.info("Verifying contact creation success message");
      const message = await contactsPage.getSubmissionSuccessMessage();
      expect(message).toBeTruthy();
      logger.info("Contact creation success message verified", { message });
    });

    logger.info("Test TC-N001 completed successfully");
  } catch (error) {
    logger.error("Test TC-N001 failed", { message: error.message, stack: error.stack });
    throw error;
  }
});
