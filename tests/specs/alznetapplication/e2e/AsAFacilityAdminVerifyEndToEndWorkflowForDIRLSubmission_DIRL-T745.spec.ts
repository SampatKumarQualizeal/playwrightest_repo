import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import dirlTestData from "@data/Staging/dirl/e2e/DIRL-T745.json";
import { Logger } from "@/utils/logger/logger.js";

// Test: DIRL-T745 - As a Facility Admin, verify end to end workflow for DIRL submission

test.describe("DIRL-T745: As a Facility Admin, verify end to end workflow for DIRL submission", () => {
  test("should complete the DIRL submission flow successfully", async ({ page, loginPage, homePage, dirLFlowPage }) => {
    const logger = Logger.getInstance();
    const username = ENV.username;
    const password = ENV.password;
    const appUrl = ENV.baseUrl || "https://connectexpress-test.acr.org/";

    try {
      await test.step("Navigate to ConnectExpress Test environment homepage", async () => {
        logger.info("Navigating to application homepage", { url: appUrl });
        await page.goto(appUrl, { waitUntil: "networkidle" });
        await loginPage.verifyLoginPageContent();
        logger.info("Homepage loaded and login page content verified");
      });

      await test.step("Login with valid credentials", async () => {
        logger.info("Attempting login with ENV credentials");
        await loginPage.login(username, password);
        // Wait for dashboard/homepage to load
        await homePage.verifylandingPageElements();
        logger.info("Login successful and dashboard loaded");
      });

      await test.step("Access DIRL application from Applications list", async () => {
        logger.info("Accessing DIRL application");
        await homePage.openApplication("DIRL");
        await dirLFlowPage.waitForSiteSettingsPage();
        logger.info("DIRL Site Settings page loaded");
      });

      await test.step("Check Corporate ID authorization state", async () => {
        logger.info("Checking Corporate ID authorization state");
        const isCorporateIdAuthorized = await dirLFlowPage.isCorporateIdAuthorized();
        if (isCorporateIdAuthorized) {
          logger.info("Corporate ID is already authorized");
          const isAnyFacilityInactive = await dirLFlowPage.isAnyFacilityInactive();
          if (isAnyFacilityInactive) {
            logger.info("At least one facility is inactive. Proceeding to activate.");
            await dirLFlowPage.clickNextButton();
            await dirLFlowPage.selectFacilityAndActivate();
            logger.info("Facility activated");
          } else {
            logger.info("All facilities already activated. Skipping activation.");
          }
        } else {
          logger.info("Corporate ID not authorized. Proceeding with authorization flow.");
          await dirLFlowPage.enterCorporateIdAndAuthorize(dirlTestData.corporateId);
          await dirLFlowPage.verifyCorporateIdAuthorizedState(dirlTestData.corporateId);
          logger.info("Corporate ID authorized");
          await dirLFlowPage.selectFacilityAndActivate();
          logger.info("Facility activated after authorization");
        }
      });

      await test.step("Map scanner to facility and verify mapping", async () => {
        logger.info("Mapping scanner to facility");
        await dirLFlowPage.mapScannerToFacility(dirlTestData.scannerDetails, dirlTestData.facilityId);
        await dirLFlowPage.verifyScannerMappingSuccess();
        logger.info("Scanner mapped to facility successfully");
      });

      await test.step("Verify data anonymization and upload to DIRL", async () => {
        logger.info("Waiting for data anonymization and upload");
        await dirLFlowPage.waitForDataAnonymizationAndUpload();
        await dirLFlowPage.verifyUploadSuccess();
        logger.info("Data anonymized and uploaded to DIRL successfully");
      });

      await test.step("Verify CBS ingestion and database entries", async () => {
        logger.info("Verifying CBS ingestion and database entries");
        await dirLFlowPage.verifyCBSIngestion();
        await dirLFlowPage.verifyDatabaseEntries();
        logger.info("CBS ingestion and database entries verified");
      });

      await test.step("Verify S3 and DataDog logs", async () => {
        logger.info("Verifying S3 bucket and DataDog logs");
        await dirLFlowPage.verifyS3Upload();
        await dirLFlowPage.verifyDataDogLogs();
        logger.info("S3 and DataDog logs verified");
      });

      await test.step("Verify Activity Monitor and final UI state", async () => {
        logger.info("Navigating to Activity Monitor");
        await dirLFlowPage.navigateToActivityMonitor();
        await dirLFlowPage.verifyActivityMonitorUI();
        logger.info("Activity Monitor UI verified");
      });

      await test.step("Final assertion: DIRL submission process completed successfully", async () => {
        const isSuccess = await dirLFlowPage.isSubmissionSuccess();
        expect(isSuccess).toBe(true);
        logger.info("DIRL submission process completed successfully");
      });

    } catch (error: any) {
      logger.error("DIRL-T745 test failed", { message: error.message, stack: error.stack });
      throw error;
    }
  });
});
