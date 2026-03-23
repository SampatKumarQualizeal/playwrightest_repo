import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import testData from "@data/TC-N001.json";

/**
 * TC-N001: Create a new contact
 * Objective: Verify system accepts valid inputs and displays appropriate message.
 * Preconditions: User is logged into the CRM system and navigates to the contact creation screen.
 * Steps:
 *   1. Login to CRM
 *   2. Navigate to contact creation form
 *   3. Fill in contact details
 *   4. Save and verify success message
 * Expected Result: System displays appropriate message and contact is saved.
 */
test.describe("CRM E2E - Create a New Contact [TC-N001]", () => {
  test("should create a new contact with valid data and display success message [TC-N001]", async ({ page, pageObjects }, testInfo) => {
    const { LoginPage, ContactPage } = pageObjects;
    const logger = testInfo.attach;
    
    try {
      await test.step("Launch CRM login page", async () => {
        logger("info", { message: "Navigating to CRM login page", url: ENV.crmUrl });
        await LoginPage.goto(ENV.crmUrl);
        await page.waitForLoadState('networkidle');
        logger("info", { message: "CRM login page loaded successfully" });
      });

      await test.step("Login to CRM", async () => {
        logger("info", { message: "Attempting login", user: testData.userName });
        await LoginPage.login(testData.userName, testData.password);
        // Wait for dashboard or home element to appear after login
        await LoginPage.waitForDashboard();
        logger("info", { message: "Login successful" });
      });

      await test.step("Navigate to contact creation form", async () => {
        logger("info", { message: "Navigating to Contacts section" });
        await ContactPage.gotoContactsSection();
        await ContactPage.waitForContactsSection();
        logger("info", { message: "Contacts section loaded" });
        logger("info", { message: "Opening Create Contact form" });
        await ContactPage.openCreateContactForm();
        await ContactPage.waitForCreateContactForm();
        logger("info", { message: "Create Contact form is visible" });
      });

      await test.step("Fill in contact details", async () => {
        logger("info", { message: "Filling contact details", fields: { firstName: testData.firstName, lastName: testData.lastName, phone: testData.phone, company: testData.company, email: testData.email } });
        await ContactPage.fillContactForm({
          firstName: testData.firstName,
          lastName: testData.lastName,
          phone: testData.phone,
          company: testData.company,
          email: testData.email
        });
        logger("info", { message: "Contact details filled" });
      });

      await test.step("Save the new contact", async () => {
        logger("info", { message: "Clicking Save button" });
        const [response] = await Promise.all([
          page.waitForResponse(resp => resp.url().includes('/contacts') && resp.status() === 200),
          ContactPage.saveContact()
        ]);
        await page.waitForLoadState('networkidle');
        logger("info", { message: "Save request completed", status: response.status() });
      });

      await test.step("Verify success message", async () => {
        logger("info", { message: "Verifying success message" });
        await ContactPage.waitForSuccessMessage();
        const actualMessage = await ContactPage.getSuccessMessage();
        expect(actualMessage).toBe(testData.expectedMessage);
        logger("info", { message: "Success message verified", actualMessage });
      });

      logger("info", { message: "Test completed successfully" });
    } catch (error) {
      logger("error", { message: "Test failed", error: error.message, stack: error.stack });
      throw error;
    }
  });
});
