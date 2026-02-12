// src/pages/site-feasibility-registration.page.ts
import { Page, test ,expect} from '@playwright/test';
import { BasePage } from './base.page.js';
import { RegistrationFormPage } from './registration-form.page.js';


export class SiteFeasibilityRegistrationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates to the Site Feasibility & Registration Form from the public-facing website.
   */
  async navigateToSiteRegisterForm(): Promise<RegistrationFormPage> {
    return await test.step('Navigate to Site Registration Form', async () => {
      // Ensure the current page is loaded
      await this.page.waitForLoadState('domcontentloaded');

      // Wait for the new page to open after clicking the button
      const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        this.page.getByRole('button', { name: 'REGISTER MY SITE' }).click()
      ]);

      // Wait for the new page to load
      await newPage.waitForLoadState('domcontentloaded');

      // Return the new page object
      return new RegistrationFormPage(newPage);
    });
  }


  /**
   * Verifies that the Site Feasibility & Registration Form is visible.
   */
  async isFormDisplayed(text: string): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForPageLoad(30000);
    const siteRegisterButton = this.page.getByText(text, { exact: true });
    await siteRegisterButton.waitFor({ state: 'visible', timeout: 30000 });
    expect(siteRegisterButton).toBeVisible();
  }
  /**
   * Navigates to the Site Feasibility & Registration Form from the public-facing website.
   */
  async navigateToImageRegisterForm(): Promise<RegistrationFormPage> {
    return await test.step('Navigate to Imaging Facility Registration Form', async () => {
      await this.page.waitForLoadState('domcontentloaded');

      // Wait for the new page to open
      const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        this.page.getByRole('button', { name: 'REGISTER MY FACILITY' }).click()
      ]);

      await newPage.waitForLoadState('domcontentloaded');
      return new RegistrationFormPage(newPage);
    });
  }

}