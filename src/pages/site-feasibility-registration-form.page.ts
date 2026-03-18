// src/pages/site-feasibility-registration-form.page.ts
import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from './base.page.js';
import { ActionUtils } from '../utils/action-utils.js';

export class SiteFeasibilityRegistrationFormPage extends BasePage {
  // Placeholder locators for key UI elements
  private readonly siteFeasibilityMenu: Locator; // Navigation/menu item to access the form
  private readonly registrationFormTitle: Locator; // Unique title or heading of the form
  private readonly formContainer: Locator; // Main form container
  private readonly accessLogIndicator: Locator; // Indicator/log message for access logging
  private readonly rmsRoleBadge: Locator; // Badge or indicator for RMS role

  constructor(page: Page) {
    super(page);
    // TODO: Replace with actual locators
    this.siteFeasibilityMenu = page.locator('locator("<PLACEHOLDER_site_feasibility_menu>")'); // TODO: Replace with actual locator
    this.registrationFormTitle = page.locator('locator("<PLACEHOLDER_registration_form_title>")'); // TODO: Replace with actual locator
    this.formContainer = page.locator('locator("<PLACEHOLDER_form_container>")'); // TODO: Replace with actual locator
    this.accessLogIndicator = page.locator('locator("<PLACEHOLDER_access_log_indicator>")'); // TODO: Replace with actual locator
    this.rmsRoleBadge = page.locator('locator("<PLACEHOLDER_rms_role_badge>")'); // TODO: Replace with actual locator
  }

  /**
   * Navigates to the Site Feasibility & Registration Form from the public-facing website.
   */
  async navigateToSiteFeasibilityRegistrationForm(): Promise<void> {
    await test.step('Navigate to Site Feasibility & Registration Form', async () => {
      await this.siteFeasibilityMenu.waitFor({ state: 'visible', timeout: 20000 });
      await ActionUtils.click(this.siteFeasibilityMenu);
      await this.page.waitForLoadState('networkidle');
    });
  }

  /**
   * Verifies that the Site Feasibility & Registration Form is displayed.
   */
  async isRegistrationFormDisplayed(): Promise<boolean> {
    await test.step('Verify Site Feasibility & Registration Form is displayed', async () => {
      await this.registrationFormTitle.waitFor({ state: 'visible', timeout: 10000 });
      await this.formContainer.waitFor({ state: 'visible', timeout: 10000 });
    });
    return await this.registrationFormTitle.isVisible() && await this.formContainer.isVisible();
  }

  /**
   * Verifies that the Site Administrator has the RMS role assigned (precondition).
   */
  async isRMSRoleAssigned(): Promise<boolean> {
    await test.step('Verify RMS role badge is visible', async () => {
      await this.rmsRoleBadge.waitFor({ state: 'visible', timeout: 5000 });
    });
    return await this.rmsRoleBadge.isVisible();
  }

  /**
   * Verifies that the form access attempt is logged in the system (post-condition).
   * This is a placeholder and should be implemented according to actual UI/logging feedback.
   */
  async isFormAccessLogged(): Promise<boolean> {
    await test.step('Verify form access attempt is logged', async () => {
      await this.accessLogIndicator.waitFor({ state: 'visible', timeout: 10000 });
    });
    return await this.accessLogIndicator.isVisible();
  }

  /**
   * Fills out the registration form with provided data in a data-driven way.
   * Supports mapping from keys in formData to corresponding UI fields using name, id, or label text.
   * Uses ActionUtils for interactions and includes robust waits and error handling for mandatory fields.
   * @param formData An object containing the form data (keys should match form field names, ids, or label text)
   */
  async fillRegistrationForm(formData: Record<string, string>): Promise<void> {
    await test.step('Fill out Site Feasibility & Registration Form (data-driven)', async () => {
      for (const [fieldKey, value] of Object.entries(formData)) {
        let fieldLocator: Locator | null = null;
        // Try to find by name attribute
        fieldLocator = this.page.locator(`[name="${fieldKey}"]`);
        if (await fieldLocator.count() === 0) {
          // Try by id
          fieldLocator = this.page.locator(`#${fieldKey}`);
        }
        if (await fieldLocator.count() === 0) {
          // Try by label text (exact match)
          fieldLocator = this.page.getByLabel(fieldKey, { exact: true });
        }
        if (await fieldLocator.count() === 0) {
          // Try by label text (partial match)
          fieldLocator = this.page.getByLabel(fieldKey, { exact: false });
        }
        if (await fieldLocator.count() === 0) {
          // Try by placeholder (sometimes fieldKey is the placeholder)
          fieldLocator = this.page.locator(`[placeholder="${fieldKey}"]`);
        }
        if (await fieldLocator.count() === 0) {
          // Try by role textbox with accessible name
          fieldLocator = this.page.getByRole('textbox', { name: fieldKey });
        }
        if (await fieldLocator.count() === 0) {
          // Try by role combobox/select with accessible name
          fieldLocator = this.page.getByRole('combobox', { name: fieldKey });
        }
        if (await fieldLocator.count() === 0) {
          // Try by role radio with accessible name
          fieldLocator = this.page.getByRole('radio', { name: fieldKey });
        }
        if (await fieldLocator.count() === 0) {
          // Try by role checkbox with accessible name
          fieldLocator = this.page.getByRole('checkbox', { name: fieldKey });
        }
        if (await fieldLocator.count() === 0) {
          // Try by role option (for selects)
          fieldLocator = this.page.getByRole('option', { name: fieldKey });
        }
        if (await fieldLocator.count() === 0) {
          throw new Error(`Unable to locate form field for key: '${fieldKey}'. Please check the mapping.`);
        }

        await fieldLocator.first().waitFor({ state: 'visible', timeout: 7000 });

        // Handle different input types
        const tagName = await fieldLocator.first().evaluate((el) => el.tagName.toLowerCase());
        if (tagName === 'input' || tagName === 'textarea') {
          const inputType = await fieldLocator.first().getAttribute('type');
          if (inputType === 'checkbox') {
            // For checkbox, set checked state
            const shouldCheck = value === 'true' || value === 'checked' || value === 'on' || value === 'yes';
            if (shouldCheck) {
              if (!(await fieldLocator.first().isChecked())) {
                await ActionUtils.click(fieldLocator.first());
              }
            } else {
              if (await fieldLocator.first().isChecked()) {
                await ActionUtils.click(fieldLocator.first());
              }
            }
          } else if (inputType === 'radio') {
            // For radio, select by value
            await ActionUtils.click(fieldLocator.first());
          } else {
            // For text/password/email/number/date inputs
            await ActionUtils.fill(fieldLocator.first(), value);
          }
        } else if (tagName === 'select') {
          await ActionUtils.selectOption(fieldLocator.first(), value);
        } else {
          // For custom dropdowns or other widgets, try to fill or click
          try {
            await ActionUtils.fill(fieldLocator.first(), value);
          } catch (e) {
            // If fill fails, try click/select
            try {
              await ActionUtils.click(fieldLocator.first());
              // Try to select option if dropdown
              const optionLocator = this.page.getByRole('option', { name: value });
              if (await optionLocator.count() > 0) {
                await ActionUtils.click(optionLocator.first());
              }
            } catch (innerErr) {
              throw new Error(`Unable to fill or select value for field '${fieldKey}': ${innerErr}`);
            }
          }
        }
      }
    });
  }

  /**
   * Submits the registration form (placeholder for actual submit button locator).
   */
  async submitRegistrationForm(): Promise<void> {
    await test.step('Submit Site Feasibility & Registration Form', async () => {
      const submitButton = this.page.locator('locator("<PLACEHOLDER_submit_button>")'); // TODO: Replace with actual locator
      await submitButton.waitFor({ state: 'visible', timeout: 5000 });
      await ActionUtils.click(submitButton);
      await this.page.waitForLoadState('networkidle');
    });
  }
}
