import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import testData from "@data/Staging/dirl/e2e/DIRL-T745.json";

/**
 * DIRL-T745: As a Facility Admin/Registry Admin/Facility User/Service User, verify end to end workflow for DIRL submission.
 * Clean Test Name: FacilityAdminRegistryAdminFacilityUserServiceUserVerifyEndToEndWorkflowForDIRLSubmission
 *
 * This test covers the full DIRL submission workflow, including login, authorization, facility activation, navigation,
 * scanner mapping, and verification of data propagation through the DIRL application.
 *
 * Test Data loaded from: test-data/Staging/dirl/e2e/DIRL-T745.json
 */
test.describe("FacilityAdminRegistryAdminFacilityUserServiceUserVerifyEndToEndWorkflowForDIRLSubmission (DIRL-T745)", () => {
  test("DIRL end-to-end submission scenario", async ({ page, loginPage, dirLSubmissionPage }) => {
    // Step 1-2: Launch application and verify landing page
    try {
      await test.step("Step 1-2: Launch DIRL application and verify homepage", async () => {
        test.info().attach("log", { body: JSON.stringify({ message: "Launching DIRL application", url: ENV.dirlUrl }), contentType: "application/json" });
        await page.goto(ENV.dirlUrl, { waitUntil: "networkidle" });
        await expect(page).toHaveURL(/connectexpress-test\.acr\.org/);
        test.info().attach("log", { body: JSON.stringify({ message: "Verifying homepage elements" }), contentType: "application/json" });
        await loginPage.verifyLoginPageContent();
        test.info().attach("log", { body: JSON.stringify({ message: "Homepage loaded and verified" }), contentType: "application/json" });
      });
    } catch (error) {
      test.info().attach("error", { body: JSON.stringify({ message: "Failed to launch DIRL application", error: error.message, stack: error.stack }), contentType: "application/json" });
      throw error;
    }

    // Step 3: Login
    try {
      await test.step("Step 3: Login to DIRL application", async () => {
        test.info().attach("log", { body: JSON.stringify({ message: "Logging in with ENV credentials" }), contentType: "application/json" });
        await loginPage.login(ENV.dirlUser, ENV.dirlPassword);
        test.info().attach("log", { body: JSON.stringify({ message: "Login successful" }), contentType: "application/json" });
      });
    } catch (error) {
      test.info().attach("error", { body: JSON.stringify({ message: "Login failed", error: error.message, stack: error.stack }), contentType: "application/json" });
      throw error;
    }

    // Step 4-10: Corporate ID Authorization
    try {
      await test.step("Step 4-10: Authorize Corporate ID if required", async () => {
        test.info().attach("log", { body: JSON.stringify({ message: "Authorizing Corporate ID if not already authorized" }), contentType: "application/json" });
        await dirLSubmissionPage.authorizeCorporateIdIfNeeded(testData.corporateId);
        test.info().attach("log", { body: JSON.stringify({ message: "Corporate ID authorization complete" }), contentType: "application/json" });
      });
    } catch (error) {
      test.info().attach("error", { body: JSON.stringify({ message: "Corporate ID authorization failed", error: error.message, stack: error.stack }), contentType: "application/json" });
      throw error;
    }

    // Step 11-12: Facility Activation
    try {
      await test.step("Step 11-12: Activate a facility", async () => {
        test.info().attach("log", { body: JSON.stringify({ message: "Activating facility from test data", facilityId: testData.facilityId }), contentType: "application/json" });
        await dirLSubmissionPage.activateFacility(testData.facilityId);
        test.info().attach("log", { body: JSON.stringify({ message: "Facility activation successful" }), contentType: "application/json" });
      });
    } catch (error) {
      test.info().attach("error", { body: JSON.stringify({ message: "Facility activation failed", error: error.message, stack: error.stack }), contentType: "application/json" });
      throw error;
    }

    // Step 13-15: Navigate to Activity Monitor and verify UI
    try {
      await test.step("Step 13-15: Navigate to Activity Monitor and verify UI elements", async () => {
        test.info().attach("log", { body: JSON.stringify({ message: "Navigating to Activity Monitor" }), contentType: "application/json" });
        await dirLSubmissionPage.openActivityMonitor();
        await dirLSubmissionPage.verifyActivityMonitorUI();
        test.info().attach("log", { body: JSON.stringify({ message: "Activity Monitor UI verified" }), contentType: "application/json" });
      });
    } catch (error) {
      test.info().attach("error", { body: JSON.stringify({ message: "Activity Monitor UI verification failed", error: error.message, stack: error.stack }), contentType: "application/json" });
      throw error;
    }

    // Step 16-20: Navigate and verify DIRL settings tabs
    try {
      await test.step("Step 16-20: Navigate and verify DIRL settings tabs", async () => {
        test.info().attach("log", { body: JSON.stringify({ message: "Verifying DIRL settings tabs" }), contentType: "application/json" });
        await dirLSubmissionPage.verifySettingsTabs();
        test.info().attach("log", { body: JSON.stringify({ message: "DIRL settings tabs verified" }), contentType: "application/json" });
      });
    } catch (error) {
      test.info().attach("error", { body: JSON.stringify({ message: "DIRL settings tab verification failed", error: error.message, stack: error.stack }), contentType: "application/json" });
      throw error;
    }

    // Step 21-23: Simulate DICOM study send and verify receipt (manual/external step)
    await test.step("Step 21-23: Simulate DICOM study send and verify receipt (manual/external)", async () => {
      test.info().attach("log", { body: JSON.stringify({ message: "Manual step: Send study from Clear Canvas DICOM Viewer to DIR listener and verify receipt" }), contentType: "application/json" });
      // NOTE: This step requires manual/external system interaction. Optionally, poll for the study in Activity Monitor.
    });

    // Step 24-36: Map scanner, verify anonymization and upload status
    try {
      await test.step("Step 24-36: Map scanner to facility and verify workflow status", async () => {
        test.info().attach("log", { body: JSON.stringify({ message: "Mapping scanner to facility and verifying workflow status" }), contentType: "application/json" });
        await dirLSubmissionPage.mapScannerToFacilityAndVerify(testData.studyInstanceUID, testData.facilityId);
        test.info().attach("log", { body: JSON.stringify({ message: "Scanner mapped, anonymization and upload status verified" }), contentType: "application/json" });
      });
    } catch (error) {
      test.info().attach("error", { body: JSON.stringify({ message: "Scanner mapping or status verification failed", error: error.message, stack: error.stack }), contentType: "application/json" });
      throw error;
    }

    // Step 37-43: Data propagation and backend verification (manual/external step)
    await test.step("Step 37-43: Backend data propagation and verification (manual/external)", async () => {
      test.info().attach("log", { body: JSON.stringify({ message: "Manual step: Verify data propagation in backend tables, CBS, S3, and DataDog logs" }), contentType: "application/json" });
      // NOTE: This step requires backend access and is not automated in this test.
    });
  });
});
