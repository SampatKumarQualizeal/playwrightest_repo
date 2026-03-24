export const ENV = {
  BASE_URL: process.env.BASE_URL!,
  TEST_ENV: process.env.TEST_ENV!,
  DASHBOARD_USERNAME: process.env.DASHBOARD_USERNAME!,
  DASHBOARD_PASSWORD: process.env.DASHBOARD_PASSWORD!,
  BROWSER: process.env.BROWSER!,
  OS: process.env.OS!,
  APPUSERNAME: process.env.APPUSERNAME!,
  APPPASSWORD: process.env.APPPASSWORD!,
  ACTIVE_APPUSERNAME: process.env.ACTIVE_APPUSERNAME!,
  ACTIVE_APPPASSWORD: process.env.ACTIVE_APPPASSWORD!,
  TAU_APPUSERNAME: process.env.TAU_APPUSERNAME!,
  TAU_APPPASSWORD: process.env.TAU_APPPASSWORD!,
  APP_URL: process.env.APP_URL!
};

/**
 * Environment Variables Documentation
 *
 * The following environment variables are expected to be set for authentication and environment configuration:
 *
 * - BASE_URL: Base URL of the application under test
 * - TEST_ENV: Name of the test environment (e.g., Staging, QA, Production)
 * - DASHBOARD_USERNAME: Username for dashboard login (if applicable)
 * - DASHBOARD_PASSWORD: Password for dashboard login (if applicable)
 * - BROWSER: Browser type to use for Playwright (e.g., chromium, firefox, webkit)
 * - OS: Operating system identifier
 * - APPUSERNAME: Application user login (for general flows)
 * - APPPASSWORD: Application user password (for general flows)
 * - ACTIVE_APPUSERNAME: Application user login for active user scenarios
 * - ACTIVE_APPPASSWORD: Application user password for active user scenarios
 * - TAU_APPUSERNAME: Application user login for TAU scenarios
 * - TAU_APPPASSWORD: Application user password for TAU scenarios
 * - APP_URL: Application URL (if different from BASE_URL)
 *
 * For DIRL submission end-to-end tests (e.g., DIRL-T745), ensure the following environment variables are set:
 *   - APPUSERNAME: Valid email for DIRL login (e.g., acrconnect.testuser2@gmail.com)
 *   - APPPASSWORD: Valid password for DIRL login (e.g., TEstaccount2)
 *
 * All authentication credentials must be provided via environment variables and must NOT be hardcoded in test data or code.
 *
 * Example usage in test files:
 *   import { ENV } from '@/config/env.js';
 *   await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
 */
