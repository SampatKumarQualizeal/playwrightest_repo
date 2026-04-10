import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";

// Step 1: Login using environment credentials

test.describe("TC-N001: Create a new contact - Step 1: Login", () => {
  test("Step 1: Login with valid credentials and land on CRM dashboard", async ({ loginPage, page }, testInfo) => {
    // Logging: Begin login step
    testInfo.attach("log", {
      body: JSON.stringify({
        level: "INFO",
        message: "Starting Step 1: Logging in with environment credentials",
        step: 1
      }),
      contentType: "application/json"
    });

    try {
      // Attempt login using ENV credentials
      await loginPage.goto(ENV.baseUrl);
      testInfo.attach("log", {
        body: JSON.stringify({
          level: "INFO",
          message: "Navigated to login page",
          url: ENV.baseUrl,
          step: 1
        }),
        contentType: "application/json"
      });

      await loginPage.login(ENV.username, ENV.password);
      testInfo.attach("log", {
        level: "INFO",
        message: "Login action performed",
        username: "[REDACTED]",
        step: 1
      });

      // Synchronization: Wait for navigation to dashboard/home
      await page.waitForLoadState('networkidle');
      // Wait for a key dashboard element (e.g., dashboard header or unique element)
      // This should be improved with a page object method in future steps
      await expect(page).toHaveURL(/(home|dashboard)/);
      testInfo.attach("log", {
        level: "SUCCESS",
        message: "Successfully landed on CRM dashboard/home after login",
        url: await page.url(),
        step: 1
      });
    } catch (error) {
      testInfo.attach("log", {
        level: "ERROR",
        message: "Error during Step 1: Login failed",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        step: 1
      });
      throw error;
    }
  });
});
