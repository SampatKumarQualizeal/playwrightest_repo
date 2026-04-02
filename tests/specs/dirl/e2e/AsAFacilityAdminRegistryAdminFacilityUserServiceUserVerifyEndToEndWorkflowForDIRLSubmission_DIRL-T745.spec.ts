import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import { TestDataUtils } from "@/utils/test-data-utils.js";

// Step 1-43: As a Facility Admin/Registry Admin/Facility User/Service User, verify end to end workflow for DIRL submission.
test.describe("DIRL-T745: End-to-End DIRL Submission Workflow", () => {
  let dirlTestData: any;
  const logger = {
    info: (message: string, meta?: any) => console.info(`[INFO] ${message}`, meta || ""),
    error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta || "")
  };

  test.beforeAll(async () => {
    // Step 1: Load test data for DIRL-T745
    try {
      logger.info("// Step 1: Loading test data for DIRL-T745", { file: "DIRL-T745.json" });
      dirlTestData = await TestDataUtils.getInstance().getTestDataByEnvironment(
        "Staging",
        "dirl/e2e/DIRL-T745.json"
      );
      logger.info("Test data loaded successfully", { keys: Object.keys(dirlTestData) });
    } catch (error: any) {
      logger.error("Failed to load DIRL-T745 test data", { error: error.message, stack: error.stack });
      throw error;
    }
  });

  test("[DIRL-T745] End-to-End DIRL Submission Flow", async ({ page, loginPage, dirLDashboardPage, dirLUnmappedScannersPage }) => {
    // Step 2: Navigate to ConnectExpress Test environment homepage
    try {
      logger.info("// Step 2: Navigating to ConnectExpress Test environment homepage", { url: ENV.baseUrl });
      await page.goto(ENV.baseUrl, { waitUntil: "networkidle" });
      await expect(page).toHaveURL(ENV.baseUrl);
      logger.info("Homepage loaded successfully");
    } catch (error: any) {
      logger.error("Failed to load homepage", { error: error.message, stack: error.stack });
      throw error;
    }

    // Step 3: Login using ENV credentials
    try {
      logger.info("// Step 3: Logging in using environment credentials");
      await loginPage.login(ENV.username, ENV.password);
      logger.info("Login successful");
    } catch (error: any) {
      logger.error("Login failed", { error: error.message, stack: error.stack });
      throw error;
    }

    // Step 4-7: Navigate to DIRL from Applications list
    try {
      logger.info("// Step 4-7: Navigating to DIRL from Applications list");
      await dirLDashboardPage.navigateToDIRL();
      await dirLDashboardPage.waitForDashboardReady();
      logger.info("DIRL dashboard loaded");
    } catch (error: any) {
      logger.error("Failed to navigate to DIRL dashboard", { error: error.message, stack: error.stack });
      throw error;
    }

    // Step 8-10: Enter Corporate ID and Authorize
    try {
      logger.info("// Step 8-10: Entering Corporate ID and Authorizing");
      await dirLDashboardPage.verifyCorporateIdFieldState();
      await dirLDashboardPage.enterCorporateIdAndAuthorize(dirlTestData.corporateId);
      logger.info("Corporate ID authorized");
    } catch (error: any) {
      logger.error("Failed to authorize Corporate ID", { error: error.message, stack: error.stack });
      throw error;
    }

    // Step 11-12: Activate a facility
    try {
      logger.info("// Step 11-12: Activating a facility");
      await dirLDashboardPage.activateFacility(dirlTestData.facilityName);
      logger.info("Facility activated");
    } catch (error: any) {
      logger.error("Failed to activate facility", { error: error.message, stack: error.stack });
      throw error;
    }

    // Step 13: Open Hamburger menu
    try {
      logger.info("// Step 13: Opening Hamburger menu");
      await dirLDashboardPage.openHamburgerMenu();
      logger.info("Hamburger menu opened");
    } catch (error: any) {
      logger.error("Failed to open Hamburger menu", { error: error.message, stack: error.stack });
      throw error;
    }

    // Step 14-15: Navigate to Activity Monitor and verify layout
    try {
      logger.info("// Step 14-15: Navigating to Activity Monitor and verifying layout");
      await dirLDashboardPage.navigateToActivityMonitor();
      await dirLDashboardPage.verifyActivityMonitorLayout();
      logger.info("Activity Monitor layout verified");
    } catch (error: any) {
      logger.error("Failed to verify Activity Monitor", { error: error.message, stack: error.stack });
      throw error;
    }

    // Step 16-17: Navigate to Settings > Receiver Settings
    try {
      logger.info("// Step 16-17: Navigating to Settings > Receiver Settings");
      await dirLDashboardPage.navigateToSettings();
      await dirLDashboardPage.selectReceiverSettingsTab();
      await dirLDashboardPage.verifyReceiverSettingsLayout();
      logger.info("Receiver Settings layout verified");
    } catch (error: any) {
      logger.error("Failed to verify Receiver Settings", { error: error.message, stack: error.stack });
      throw error;
    }

    // Step 18-20: Navigate to Scanner Mapping, File Validation, and Unmapped Scanners tabs
    try {
      logger.info("// Step 18: Navigating to Scanner Mapping tab");
      await dirLDashboardPage.selectScannerMappingTab();
      logger.info("Scanner Mapping tab verified");
      logger.info("// Step 19: Navigating to File Validation Settings tab");
      await dirLDashboardPage.selectFileValidationSettingsTab();
      logger.info("File Validation Settings tab verified");
      logger.info("// Step 20: Navigating to Unmapped Scanners tab");
      await dirLDashboardPage.selectUnmappedScannersTab();
      await dirLUnmappedScannersPage.verifyUnmappedScannersLayout();
      logger.info("Unmapped Scanners tab verified");
    } catch (error: any) {
      logger.error("Failed to verify tabs in Settings", { error: error.message, stack: error.stack });
      throw error;
    }

    // Step 21-43: (External system and backend validation steps)
    logger.info("// Step 21-43: External system and backend validation steps are not automated in this UI test. Please validate manually as per test case.");
  });
});
