import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import { CommonUtils } from "@/utils/common-utils.js";
import { Logger } from "@/logger/logger.js";
import path from "path";

const logger = new Logger("CreateANewContact_TC-N001");

// Test data path for TC-N001
const testDataPath = path.resolve(__dirname, "../../../../data/Staging/alznetapplication/e2e/TC-N001.json");

// Utility to load test data
async function loadContactTestData() {
  logger.info("Loading test data for TC-N001", { testDataPath });
  return await CommonUtils.loadJSONData(testDataPath);
}

test.describe("[TC-N001] Create a new contact - E2E", () => {
  test("Should create a new contact with valid data and display success message", async ({ page, loginPage, contactsPage }) => {
    let testData: any;
    try {
      await test.step("Load test data", async () => {
        testData = await loadContactTestData();
        logger.info("Test data loaded successfully", { fields: Object.keys(testData) });
      });
    } catch (error) {
      logger.error("Failed to load test data", { error: error.message, stack: error.stack });
      throw error;
    }

    // Login Step
    try {
      await test.step("Login to CRM application", async () => {
        logger.info("Starting login process");
        await loginPage.goto(ENV.baseUrl);
        await page.waitForLoadState('networkidle');
        logger.info("Login page loaded");
        await loginPage.login(ENV.username, ENV.password);
        await page.waitForLoadState('networkidle');
        logger.info("Logged in successfully");
      });
    } catch (error) {
      logger.error("Login failed", { error: error.message, stack: error.stack });
      throw error;
    }

    // Navigate to Contacts List
    try {
      await test.step("Navigate to Contacts list", async () => {
        logger.info("Navigating to Contacts list");
        await contactsPage.navigateToContactsList();
        await contactsPage.waitForContactsListVisible();
        logger.info("Contacts list page loaded");
      });
    } catch (error) {
      logger.error("Navigation to Contacts list failed", { error: error.message, stack: error.stack });
      throw error;
    }

    // Open Create Contact Form
    try {
      await test.step("Open Create Contact form", async () => {
        logger.info("Opening Create Contact form");
        await contactsPage.openCreateContactForm();
        await contactsPage.waitForCreateContactFormVisible();
        logger.info("Create Contact form is visible");
      });
    } catch (error) {
      logger.error("Failed to open Create Contact form", { error: error.message, stack: error.stack });
      throw error;
    }

    // Fill Contact Details
    try {
      await test.step("Fill contact details from test data", async () => {
        logger.info("Filling contact details", {
          firstName: testData.firstName,
          lastName: testData.lastName,
          phone: testData.phone,
          company: testData.company,
          email: testData.email
        });
        await contactsPage.fillContactForm({
          firstName: testData.firstName,
          lastName: testData.lastName,
          phone: testData.phone,
          company: testData.company,
          email: testData.email
        });
        logger.info("Contact details filled");
      });
    } catch (error) {
      logger.error("Failed to fill contact details", { error: error.message, stack: error.stack });
      throw error;
    }

    // Save Contact and Wait for Confirmation
    try {
      await test.step("Save the new contact and wait for confirmation", async () => {
        logger.info("Saving the new contact");
        const [response] = await Promise.all([
          page.waitForResponse(resp =>
            resp.url().includes("/api/contacts") && resp.status() === 200
          ),
          contactsPage.saveContact()
        ]);
        logger.info("Save contact API responded", { status: response.status() });
        await page.waitForLoadState('networkidle');
        await contactsPage.waitForSuccessMessageVisible();
        logger.info("Success message is visible");
      });
    } catch (error) {
      logger.error("Failed to save contact or wait for confirmation", { error: error.message, stack: error.stack });
      throw error;
    }

    // Assert Success Message
    try {
      await test.step("Assert success message is displayed", async () => {
        const successMsg = await contactsPage.getSuccessMessageText();
        logger.info("Success message text", { successMsg });
        expect(successMsg).toContain("Contact created successfully");
        logger.info("Success message assertion passed");
      });
    } catch (error) {
      logger.error("Success message assertion failed", { error: error.message, stack: error.stack });
      throw error;
    }
  });
});
