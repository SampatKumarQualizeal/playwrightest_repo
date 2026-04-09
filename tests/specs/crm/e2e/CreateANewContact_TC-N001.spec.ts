import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import testData from "@data/TC-N001.json";
import { logger } from "@/utils/logger.js";

// Step 1: Login and navigate to the Contacts creation screen

test.describe("TC-N001: Create a new contact - CRM", () => {
  test("should login and navigate to create contact screen", async ({ page, pageObjects }) => {
    // Logging context for this test
    const logMeta = { testCase: "TC-N001", feature: "CRM-ContactCreation" };

    // Step 1: Login and navigate to CRM dashboard
    try {
      logger.info("[Step 1] Navigating to CRM login page", logMeta);
      await pageObjects.LoginPage.goto(ENV.crmUrl);
      logger.info("[Step 1] Performing login", logMeta);
      await pageObjects.LoginPage.login(ENV.username, ENV.password);
      logger.info("[Step 1] Waiting for CRM dashboard to load (networkidle)", logMeta);
      await page.waitForLoadState("networkidle");
      // Wait for a key dashboard element (e.g., Contacts menu) to be visible
      await pageObjects.ContactsPage.waitForContactsMenu();
      logger.info("[Step 1] Successfully logged in and dashboard loaded", logMeta);
    } catch (error) {
      logger.error("[Step 1] Error during login/navigation", { ...logMeta, error: error.message, stack: error.stack });
      throw error;
    }

    // Step 1: Navigate to Contacts creation screen
    try {
      logger.info("[Step 1] Navigating to Contacts section", logMeta);
      await pageObjects.ContactsPage.openContactsMenu();
      await pageObjects.ContactsPage.waitForContactsList();
      logger.info("[Step 1] Navigating to Create Contact screen", logMeta);
      await pageObjects.ContactsPage.openCreateContact();
      await pageObjects.ContactsPage.waitForCreateContactForm();
      logger.info("[Step 1] Create Contact form loaded and ready", logMeta);
    } catch (error) {
      logger.error("[Step 1] Error navigating to create contact screen", { ...logMeta, error: error.message, stack: error.stack });
      throw error;
    }
  });
});
