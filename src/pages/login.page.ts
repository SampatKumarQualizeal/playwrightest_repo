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

  // Step 1: Locators for username and password fields with multiple strategies
  private readonly crmUsernameField: Locator; // PRIMARY: CSS selector
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('xpath=//input[@name="email" and @type="text" and @placeholder="Email"]')
  // this.page.locator('input[name="email"][placeholder="Email"]')

  private readonly crmPasswordField: Locator; // PRIMARY: CSS selector
  // SECONDARY LOCATORS (fallback)
  // this.page.locator('xpath=//input[@name="password" and @type="password" and @placeholder="Password"]')
  // this.page.locator('input[name="password"][type="password"][placeholder="Password"]')

  private readonly crmLoginButton: Locator; // PRIMARY: role/button
  // SECONDARY LOCATORS (fallback)
  // this.page.getByRole('button', { name: /Login/i })
  // this.page.locator('button[type="submit"]')

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

    // Step 1: CRM login page locators
    this.crmUsernameField = page.locator('input[name="email"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="email" and @type="text" and @placeholder="Email"]')
    // page.locator('input[name="email"][placeholder="Email"]')

    this.crmPasswordField = page.locator('input[name="password"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('xpath=//input[@name="password" and @type="password" and @placeholder="Password"]')
    // page.locator('input[name="password"][type="password"][placeholder="Password"]')

    this.crmLoginButton = page.getByRole('button', { name: /Login|Sign In|Log In/i }); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('button[type="submit"]')
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

  // Step 1: Enter valid data for userName and Password to do login.
  /**
   * Logs in to the CRM system using provided credentials and navigates to the new contact creation screen.
   * Uses multiple locator strategies for username and password fields.
   * Navigates to /contacts/new after successful login.
   * Includes structured logging and error handling.
   * @param userName - CRM username
   * @param password - CRM password
   */
  async loginToCrmAndGoToNewContact(userName: string, password: string): Promise<void> {
    // Step 1: Enter valid data for userName and Password to do login.
    const logger = console;
    try {
      logger.info('[Step 1] Attempting CRM login', { step: 1 });
      await test.step('Step 1: Enter valid data for userName and Password to do login', async () => {
        // Wait for username field (primary locator)
        await this.crmUsernameField.waitFor({ state: 'visible', timeout: 15000 });
        logger.info('CRM username field is visible (primary locator)');
        await this.crmUsernameField.fill(userName);
        logger.info('Filled CRM username field');

        // Wait for password field (primary locator)
        await this.crmPasswordField.waitFor({ state: 'visible', timeout: 15000 });
        logger.info('CRM password field is visible (primary locator)');
        await this.crmPasswordField.fill(password);
        logger.info('Filled CRM password field');

        // Click the login button
        await this.crmLoginButton.waitFor({ state: 'visible', timeout: 10000 });
        logger.info('CRM login button is visible');
        await this.crmLoginButton.click();
        logger.info('Clicked CRM login button');

        // Wait for navigation/network to complete
        await this.page.waitForLoadState('networkidle');
        logger.info('CRM login networkidle state reached');

        // Navigate to /contacts/new
        logger.info('Navigating to /contacts/new');
        await this.page.goto('/contacts/new', { waitUntil: 'networkidle' });
        logger.info('Navigation to /contacts/new complete');

        // Wait for a key element on the new contact page to be visible (e.g., first name field)
        const firstNameField = this.page.locator('input[name="first_name"]'); // PRIMARY
        // SECONDARY LOCATORS (fallback)
        // this.page.locator('xpath=//input[@name="first_name" and @type="text"]')
        // this.page.locator('input[name="first_name"]')
        await firstNameField.waitFor({ state: 'visible', timeout: 15000 });
        logger.info('First name field on new contact page is visible');
      });
      logger.info('[Step 1] CRM login and navigation to new contact successful', { step: 1 });
    } catch (error: any) {
      logger.error('[Step 1] CRM login or navigation failed', { step: 1, message: error.message, stack: error.stack });
      throw error;
    }
  }
}
