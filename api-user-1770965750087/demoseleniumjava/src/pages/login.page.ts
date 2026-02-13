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
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    });
  }

  async login(username: string, password: string): Promise<void> {
    await test.step('Login to Application', async () => {
      await ActionUtils.click(this.loginButton);
      await this.page.waitForLoadState('domcontentloaded');
      await this.usernameField.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.usernameField, username);
      await ActionUtils.click(this.loginBtn);
      await this.loginPasswordField.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.loginPasswordField, password);
      await ActionUtils.click(this.loginBtn);
      await this.loadingIcon.waitFor({ state: 'hidden' });
      await expect(this.page).toHaveURL(/home/);
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

  /**
   * Complete end-to-end login workflow for a valid user.
   * Launches the login page, enters credentials, submits, and verifies navigation to Home page.
   * This method consolidates all steps required for TC_001: Verify user can login successfully.
   * @param url Application login URL
   * @param username Valid username
   * @param password Valid password
   */
  async loginAndVerifyHomeNavigation(url: string, username: string, password: string): Promise<void> {
    await test.step('Launch login page and perform login workflow', async () => {
      // Launch the login page
      await this.goto(url);
      // Wait for login button to be visible (entry point)
      await this.loginButton.waitFor({ state: 'visible', timeout: 20000 });
      // Click login button to open login form
      await ActionUtils.click(this.loginButton);
      // Wait for username field
      await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
      // Enter username
      await ActionUtils.fill(this.usernameField, username);
      // Click 'Log In' to proceed to password
      await ActionUtils.click(this.loginBtn);
      // Wait for password field
      await this.loginPasswordField.waitFor({ state: 'visible', timeout: 10000 });
      // Enter password
      await ActionUtils.fill(this.loginPasswordField, password);
      // Click 'Log In' to submit
      await ActionUtils.click(this.loginBtn);
      // Wait for loading to finish
      await this.loadingIcon.waitFor({ state: 'hidden', timeout: 30000 });
      // Verify navigation to Home page (URL contains /home/)
      await expect(this.page).toHaveURL(/home\//);
    });
  }

  /**
   * Verifies that the login page is displayed and all expected elements are present.
   * This includes header, directions, login widget, logo, and create account button.
   * Can be used as a precondition check for login tests.
   */
  async verifyLoginPageUIElements(): Promise<void> {
    await test.step('Verify all key login page UI elements are visible', async () => {
      // Page header
      await expect(this.page.locator('#page-header')).toBeVisible();
      // Directions paragraph
      await expect(this.page.locator('#page-directions')).toBeVisible();
      // Okta sign-in widget container
      await expect(this.page.locator('#okta-login-container')).toBeVisible();
      // ACR logo
      await expect(this.page.locator('img.auth-org-logo[alt="acrstaff logo"]')).toBeVisible();
      // Create an account button
      await expect(this.page.getByRole('link', { name: 'Create an account' })).toBeVisible();
    });
  }
}