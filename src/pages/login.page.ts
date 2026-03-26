import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';
import { ActionUtils } from '@/utils/action-utils.js';
import { ENV } from '@/config/env.js';

export class LoginPage extends BasePage {
  private readonly usernameField: Locator;
  private readonly loginPasswordField: Locator; // Renamed for clarity
  private readonly loginButton: Locator;
  private readonly loginBtn: Locator;
  private readonly loadingIcon: Locator;

  // New locators for registration
  private readonly welcomeHeading: Locator;
  private readonly portalDescription: Locator;
  private readonly loginWithAcrIdButton: Locator;
  private readonly createAcrIdButton: Locator;
  private readonly createButton: Locator;
  private readonly createAnAccountLink: Locator;
  private readonly registrationEmailField: Locator;
  private readonly registrationPasswordField: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly secondaryEmailField: Locator;
  private readonly registerButton: Locator;
  private readonly verificationEmailSentMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('input[name="username"]');
    this.loginPasswordField = page.locator('input[name="password"]'); // Renamed
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginBtn = page.getByRole('button', { name: 'Log In' });
    this.loadingIcon = page.locator('overlay-loader').getByText('Loading Data Dashboard');

    // Initialize new locators
    this.welcomeHeading = page.getByRole('heading', { name: 'Welcome to the ALZ-NET Portal' });
    this.portalDescription = page.locator('app-okta-login');
    this.loginWithAcrIdButton = page.getByText('Login with your ACR IDClick');
    this.createAcrIdButton = page.getByText('Create your ACR IDClick here');
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.createAnAccountLink = page.getByRole('link', { name: 'Create an account' });
    this.registrationEmailField = page.getByRole('textbox', { name: 'Email *', exact: true });
    this.registrationPasswordField = page.getByRole('textbox', { name: 'Password *' });
    this.firstNameField = page.getByRole('textbox', { name: 'First name *' });
    this.lastNameField = page.getByRole('textbox', { name: 'Last name *' });
    this.secondaryEmailField = page.getByRole('textbox', { name: 'Secondary email *' });
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.verificationEmailSentMessage = page.locator('#okta-sign-in');
  }

  async goto(url: string): Promise<void> {
    await test.step('Launch the application', async () => {
      await this.page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
      // Wait for login page to be visible for robust navigation
      await this.usernameField.waitFor({ state: 'visible' });
    });
  }

  async login(username: string, password: string): Promise<void> {
    await test.step('Login to Application', async () => {
      try {
        await ActionUtils.click(this.loginButton);
        await this.page.waitForLoadState('networkidle');
        await this.usernameField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.usernameField, username);
        await ActionUtils.click(this.loginBtn);
        await this.loginPasswordField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.loginPasswordField, password);
        await ActionUtils.click(this.loginBtn);
        await this.loadingIcon.waitFor({ state: 'hidden' });
        await expect(this.page).toHaveURL(/home/);
      } catch (error) {
        // Structured logging for error context
        // eslint-disable-next-line no-console
        console.error('[LoginPage][login] Login failed', { message: (error as Error).message, stack: (error as Error).stack });
        throw error;
      }
    });
  }

  /**
   * Logs in using environment credentials (ENV.USERNAME, ENV.PASSWORD)
   * For use in tests that require a standard login step.
   * Includes robust logging and error handling.
   */
  async loginWithEnvCredentials(): Promise<void> {
    await test.step('Login using ENV credentials', async () => {
      try {
        // Structured log before action
        // eslint-disable-next-line no-console
        console.info('[LoginPage][loginWithEnvCredentials] Logging in with ENV credentials');
        const username = ENV.USERNAME;
        const password = ENV.PASSWORD;
        if (!username || !password) {
          // eslint-disable-next-line no-console
          console.error('[LoginPage][loginWithEnvCredentials] ENV credentials missing');
          throw new Error('Environment credentials (USERNAME or PASSWORD) are not set.');
        }
        await this.login(username, password);
        // Structured log after success
        // eslint-disable-next-line no-console
        console.info('[LoginPage][loginWithEnvCredentials] Login successful');
      } catch (error) {
        // Structured error log
        // eslint-disable-next-line no-console
        console.error('[LoginPage][loginWithEnvCredentials] Login failed', { message: (error as Error).message, stack: (error as Error).stack });
        throw error;
      }
    });
  }

  async verifyLoginPageContent(): Promise<void> {
    await test.step('Verify Login Page Content', async () => {
      await expect(this.welcomeHeading).toBeVisible();
      await expect(this.portalDescription).toContainText('Welcome to the ALZ-NET Portal'); // More specific assertion
      await expect(this.loginWithAcrIdButton).toBeVisible();
      await expect(this.createAcrIdButton).toBeVisible();
    });
  }

  async clickCreateAccount(): Promise<void> {
    await test.step('Click Create Account button', async () => {
      await this.createButton.click();
      await this.createAnAccountLink.click();
      await this.registrationEmailField.waitFor({ state: 'visible' });
    });
  }

  async fillRegistrationForm(email: string, password: string, firstName: string, lastName: string, secondaryEmail: string): Promise<void> {
    await test.step('Fill Registration Form', async () => {
      await this.registrationEmailField.fill(email);
      await this.registrationPasswordField.fill(password);
      await this.firstNameField.fill(firstName);
      await this.lastNameField.fill(lastName);
      await this.secondaryEmailField.fill(secondaryEmail);
    });
  }

  async clickRegisterButton(): Promise<void> {
    await test.step('Click Register button', async () => {
      await this.registerButton.click();
    });
  }

  async verifyVerificationEmailSentMessage(): Promise<void> {
    await test.step('Verify Verification Email Sent Message', async () => {
      await expect(this.verificationEmailSentMessage).toContainText('A verification email has been sent!To finish signing in, check your email.Back to sign in');
    });
  }
}
