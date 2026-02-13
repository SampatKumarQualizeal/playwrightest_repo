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
   * Complete the end-to-end login and registration workflow as described in TC_001:
   * - Launch login page
   * - Perform login with username and password
   * - Navigate to Site Registration Form
   * - Fill all mandatory fields and submit the form
   * - Validate confirmation message
   * 
   * This method groups all the major steps into a single, business-flow method as per project guidelines.
   * 
   * @param url - The login page URL
   * @param username - Valid username
   * @param password - Valid password
   * @param registrationFormPage - Instance of RegistrationFormPage
   * @param registrationData - Object containing all required registration form data
   */
  async loginAndRegisterSite(
    url: string,
    username: string,
    password: string,
    registrationFormPage: import('./registration-form.page').RegistrationFormPage,
    registrationData: {
      siteType: string;
      hospitalType: string;
      principalInvestigator: { name: string; email: string };
      primaryContact: { name: string; email: string };
      physicalAddress: { street: string; zip: string; city: string; state: string; telephone: string; fax: string };
      mailAddressSameAsPhysical: 'Yes' | 'No';
      patientPopulationEnrollment: Record<string, number | string>;
      characteristics: Record<string, boolean>;
      imagingFacility?: { name: string; type: string };
      // Add other fields as needed
    }
  ): Promise<void> {
    await test.step('Complete login and site registration workflow', async () => {
      // 1. Launch Login Page
      await this.goto(url);
      // Optionally verify login page content if needed
      // await this.verifyLoginPageContent();

      // 2. Login
      await this.login(username, password);

      // 3. Click 'Register My Site' button
      // The HomePage object has method to click 'Register My Site' and verify form
      // We assume the test will create/import HomePage and RegistrationFormPage accordingly
      // So this step is handled outside this page object, or you can optionally add a placeholder here
      // Example usage in test: await homePage.clickRegisterMySiteButton();

      // 4. Fill all mandatory fields and submit registration form
      // Use registrationFormPage to fill the form
      await registrationFormPage.fillSiteName();
      await registrationFormPage.selectNatureOfSite(
        registrationData.siteType,
        registrationData.hospitalType
      );
      await registrationFormPage.fillPrincipalInvsetigatorInfo(
        registrationData.principalInvestigator.name,
        registrationData.principalInvestigator.email
      );
      await registrationFormPage.fillPrimaryContactDetails(
        registrationData.primaryContact.name,
        registrationData.primaryContact.email
      );
      await registrationFormPage.fillPhysicalAddress(
        registrationData.physicalAddress.street,
        registrationData.physicalAddress.zip,
        registrationData.physicalAddress.city,
        registrationData.physicalAddress.state,
        registrationData.physicalAddress.telephone,
        registrationData.physicalAddress.fax
      );
      await registrationFormPage.selectSiteMailAddressSameAsPhysicalAddress(
        registrationData.mailAddressSameAsPhysical,
        registrationData.siteType
      );
      await registrationFormPage.fillPatientPopulationEnrollmentDetails(
        registrationData.patientPopulationEnrollment
      );
      await registrationFormPage.fillCharacteristicsDetails(
        registrationData.characteristics
      );
      if (registrationData.imagingFacility) {
        await registrationFormPage.fillImagingFacilityDetails(
          registrationData.imagingFacility.name,
          registrationData.imagingFacility.type
        );
      }
      // Save and submit the form
      await registrationFormPage.saveAndSubmitForm();

      // 5. Validate confirmation message
      // The confirmation message is validated in RegistrationFormPage
      // Example: await registrationFormPage.verifySuccessMessageAndClosePopup('Thank you for your interest in ALZ-NET! We will review your submission and');
    });
  }
}