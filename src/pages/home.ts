import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';
import { RegistrationFormPage } from './registration-form.page.js';
import { SiteFeasibilityRegistrationFormPage } from './site-feasibility-registration-form.page.js';
//import test from 'node:test';
export class HomePage extends BasePage {
  private readonly landingPageImage: Locator;
  private readonly landingPageLogo: Locator;
  private readonly datadashboardLink: Locator;
  private readonly dementiaSiteRegisterLink: Locator;
  private readonly imagingFacilityRegisterLink: Locator;
  private readonly accessMySiteLink: Locator;
  private readonly accessMyFacilityLink: Locator;
  private readonly registrationStepsText: Locator;
  private readonly registerMySiteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.landingPageLogo = page.getByRole('img', { name: "Alzheimer's Network logo" });
    this.landingPageImage = page.getByRole('img', { name: "Alzheimer's Info" });
    this.registrationStepsText = page.locator('.landing-content');
    this.dementiaSiteRegisterLink = page.getByText('Dementia SiteREGISTER MY');
    this.imagingFacilityRegisterLink = page.getByText('Imaging FacilityREGISTER MY');
    this.accessMySiteLink = page.getByRole('button', { name: 'ACCESS MY SITE' });
    this.accessMyFacilityLink = page.getByRole('button', { name: 'ACCESS MY FACILITY' });
    this.datadashboardLink = page.locator("//a[contains(@class,'dashboard-link')]");
    this.registerMySiteButton = page.getByRole('button', { name: 'Register My Site' });
  }
  siteOrFacilityDropdownValue(siteName: string): Locator {
    return this.page.getByRole('button', { name: siteName });
  }
  get selectDropdown(): Locator {
    return this.page.getByRole('button', { name: '-Select-' });
  }
  get expandMoreIcon(): Locator {
    return this.page.locator('#mat-mdc-dialog-0').getByText('expand_more');
  }
  get goButton(): Locator {
    return this.page.getByRole('button', { name: 'GO' });
  }
  get emailUs(): Locator {
    return this.page.getByRole('link', { name: 'Email us' })
  }

  async verifylandingPageElements(): Promise<void> {
    await test.step('Vereify Landing page elements', async () => {
      await this.landingPageImage.waitFor({ state: 'visible', timeout: 10000 });
      await expect(this.datadashboardLink).toBeVisible();
      await expect(this.landingPageLogo).toBeVisible();
      await expect(this.landingPageImage).toBeVisible();
      await expect(this.registrationStepsText).toBeVisible();
      await expect(this.dementiaSiteRegisterLink).toBeVisible();
      await expect(this.imagingFacilityRegisterLink).toBeVisible();
      await expect(this.accessMySiteLink).toBeVisible();
      await expect(this.accessMyFacilityLink).toBeVisible();
      await this.verifytextInLandingPage();
      await this.verifyLogoutBtn();
    });
    //Access my facility and access my site links can be added here once available

  }
  async clickAccessMyFacilityAndVerify(siteOrFacilityName: string): Promise<void> {
    await expect(this.accessMyFacilityLink).toBeVisible();
    await this.accessMyFacilityLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.selectDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.expandMoreIcon.click();
    await this.siteOrFacilityDropdownValue(siteOrFacilityName).scrollIntoViewIfNeeded();
    await this.siteOrFacilityDropdownValue(siteOrFacilityName).waitFor({ state: 'visible', timeout: 10000 });
  }

  async accessSavedDraftRegistrationForm(siteOrFacilityName: string): Promise<RegistrationFormPage> {
    await test.step('Verify Access Saved Draft Registration form', async () => {
      await this.siteOrFacilityDropdownValue(siteOrFacilityName).scrollIntoViewIfNeeded();
      await this.siteOrFacilityDropdownValue(siteOrFacilityName).waitFor({ state: 'visible', timeout: 10000 });
      await this.siteOrFacilityDropdownValue(siteOrFacilityName).click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.goButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.goButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    });
    return new RegistrationFormPage(this.page);
  }
  async clickAccessMySiteAndVerify(siteOrFacilityName: string): Promise<void> {
    await test.step('Click Access Mysite and verify', async () => {
      await expect(this.accessMySiteLink).toBeVisible();
      await this.accessMySiteLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.selectDropdown.waitFor({ state: 'visible', timeout: 10000 });
      await this.expandMoreIcon.click();
      await this.siteOrFacilityDropdownValue(siteOrFacilityName).scrollIntoViewIfNeeded();
      await this.siteOrFacilityDropdownValue(siteOrFacilityName).waitFor({ state: 'visible', timeout: 10000 });
    });
  }

  /**
   * Navigates to the Site Registration flow by clicking the 'Register My Site' button and returns the SiteFeasibilityRegistrationFormPage.
   * This provides a stable entry point for tests needing to reach the Site Feasibility Registration form.
   */
  async navigateToSiteRegistrationForm(): Promise<SiteFeasibilityRegistrationFormPage> {
    await test.step('Navigate to Site Registration Form', async () => {
      await expect(this.registerMySiteButton).toBeVisible();
      await this.registerMySiteButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    });
    return new SiteFeasibilityRegistrationFormPage(this.page);
  }

  async verifyLogoutBtn(): Promise<void> {
    await test.step('Verify Logout from Application', async () => {
      const expandMore = this.page.locator("//*[contains(text(),'expand_more')]").nth(0);
      await expandMore.waitFor({ state: 'visible', timeout: 10000 });
      await expandMore.click();
      const logoutButton = this.page.locator("//button[contains(text(),'Log Out')]");
      await logoutButton.waitFor({ state: 'visible', timeout: 10000 });
    });
  }
  async verifytextInLandingPage() {
    await test.step('Verify Landing Page Text', async () => {

      const landingContent = this.registrationStepsText;
      // Verify important text fragments
      await expect(landingContent).toContainText('Thank you for your interest in participating in ALZ-NET.');
      await expect(landingContent).toContainText('Please designate one user from your site/facility');
      await expect(landingContent).toContainText('For returning users who are already registered');
      await expect(landingContent).toContainText('If any information has changed since the original submission');
      await expect(landingContent).toContainText('To register a new site or facility:');
      await expect(landingContent).toContainText('Select registration type below. Complete and submit the form.');
      await expect(landingContent).toContainText('Receive approval of Site registration via email');
      await expect(landingContent).toContainText('Once your site/facility is approved, you may add/edit staff.');
      await expect(landingContent).toContainText('Once your site/facility is activated, you may register cases and/or submit data.');
    });
  }
  async verifyEmailUsSection() {
    await test.step('Verify Emsil us link', async () => {
      await this.emailUs.scrollIntoViewIfNeeded();
      await this.emailUs.isVisible();
    });
  }
}
