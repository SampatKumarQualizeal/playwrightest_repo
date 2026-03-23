import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from '../base.page.js';

/**
 * Page Object for CRM Login Page.
 * Encapsulates login interactions for the CRM application.
 */
export class CrmLoginPage extends BasePage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;

  /**
   * @param page Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('input[name="email"]');
    this.passwordField = page.locator('input[name="password"]');
    this.loginButton = page.locator('button:has-text("Login")');
  }

  /**
   * Logs in to the CRM application using provided credentials.
   * Synchronization: Waits for username field to be visible, types credentials, clicks login, waits for network idle.
   * Logs all major steps and errors.
   * @param username User's username (email)
   * @param password User's password
   */
  async login(username: string, password: string): Promise<void> {
    await test.step('Login to CRM Application', async () => {
      try {
        console.info('[CrmLoginPage] Waiting for username field to be visible', { selector: 'input[name="email"]' });
        await this.usernameField.waitFor({ state: 'visible' });
        console.info('[CrmLoginPage] Username field is visible');

        console.info('[CrmLoginPage] Filling username');
        await this.usernameField.fill(username);
        console.info('[CrmLoginPage] Username filled');

        console.info('[CrmLoginPage] Filling password');
        await this.passwordField.waitFor({ state: 'visible' });
        await this.passwordField.fill(password);
        console.info('[CrmLoginPage] Password filled');

        console.info('[CrmLoginPage] Clicking login button', { selector: 'button:has-text("Login")' });
        await this.loginButton.waitFor({ state: 'visible' });
        await this.loginButton.click();
        console.info('[CrmLoginPage] Login button clicked');

        // Synchronization: Wait for network to be idle after login
        console.info('[CrmLoginPage] Waiting for network to be idle after login');
        await this.page.waitForLoadState('networkidle');
        console.info('[CrmLoginPage] Network is idle. Login flow complete.');
      } catch (error: any) {
        console.error('[CrmLoginPage] Error during login', {
          message: error.message,
          stack: error.stack,
          step: 'login',
        });
        throw error;
      }
    });
  }
}
