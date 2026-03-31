import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "@/pages/base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";
import { ENV } from "@/config/env.js";

/**
 * Page Object for DIRL Submission End-to-End Workflow
 * Covers login, DIRL navigation, NRDR Corporate ID handling, facility activation,
 * scanner mapping, and Activity Monitor verification.
 */
export class DirLSubmissionPage extends BasePage {
  private readonly signInWithAcrIdLink: Locator;
  // Okta login
  private readonly oktaUsernameField: Locator;
  private readonly oktaPasswordField: Locator;
  private readonly oktaLoginButton: Locator;
  // Main dashboard
  private readonly applicationsTab: Locator;
  private readonly dirlAppLink: Locator;
  // DIRL Tabs
  private readonly siteSettingsTab: Locator;
  private readonly receiverSettingsTab: Locator;
  private readonly scannerMappingTab: Locator;
  private readonly fileValidationSettingsTab: Locator;
  private readonly unmappedScannersTab: Locator;
  // NRDR Corporate ID
  private readonly nrdrCorporateIdInput: Locator;
  private readonly authorizeButton: Locator;
  // Facility activation
  private readonly activateButton: Locator;
  private readonly nextButton: Locator;
  // Hamburger menu
  private readonly hamburgerMenu: Locator;
  private readonly activityMonitorMenu: Locator;
  private readonly settingsMenu: Locator;
  // Activity Monitor
  private readonly statusSuccessTile: Locator;
  private readonly statusFailureTile: Locator;
  private readonly statusNotStartedTile: Locator;
  // Unmapped Scanners
  private readonly mapWithFacilityButton: Locator;
  // Pop-up mapping
  private readonly facilityIdDropdown: Locator;
  private readonly facilityNameInput: Locator;
  private readonly mapScannerButton: Locator;
  private readonly closeMappingPopupButton: Locator;

  constructor(page: Page) {
    super(page);
    // Step 1-2: Login page
    this.signInWithAcrIdLink = page.locator('a[href="/External/Challenge?redirectUrl=%2F&provider=oidc"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('a:has-text("Sign in with ACR ID")')
    // page.locator('//a[normalize-space()="Sign in with ACR ID"]')

    // Step 2-3: Okta login
    this.oktaUsernameField = page.locator('#okta-signin-username'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('input[name="username"]')
    // page.locator('//input[@id="okta-signin-username"]')
    this.oktaPasswordField = page.locator('#okta-signin-password'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('input[name="password"][type="password"]')
    // page.locator('//input[@id="okta-signin-password"]')
    this.oktaLoginButton = page.locator('#okta-signin-submit'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('input[type="submit"]')
    // page.locator('//input[@id="okta-signin-submit"]')

    // Step 7: Applications tab and DIRL app link
    this.applicationsTab = page.locator('a', { hasText: 'Applications' }); // PRIMARY
    // SECONDARY: page.locator('a[data-tab="Applications"]')
    this.dirlAppLink = page.locator('a', { hasText: 'DIR Link' }); // PRIMARY
    // SECONDARY: page.locator('a[href*="dir-link"]')

    // Step 16-20: DIRL Tabs
    this.siteSettingsTab = page.locator('div[role="tab"]', { hasText: 'Site Settings' }); // PRIMARY
    // SECONDARY: page.locator('xpath=//div[@role="tab" and normalize-space()="Site Settings"]')
    this.receiverSettingsTab = page.locator('div[role="tab"]', { hasText: 'Receiver Settings' }); // PRIMARY
    this.scannerMappingTab = page.locator('div[role="tab"]', { hasText: 'Scanner Mapping' }); // PRIMARY
    this.fileValidationSettingsTab = page.locator('div[role="tab"]', { hasText: 'File Validation Settings' }); // PRIMARY
    this.unmappedScannersTab = page.locator('div[role="tab"]', { hasText: 'Unmapped Scanners' }); // PRIMARY

    // Step 8-10: NRDR Corporate ID and Authorize
    this.nrdrCorporateIdInput = page.locator('#NRDRCorporateId'); // PRIMARY
    // SECONDARY: page.locator('input#NRDRCorporateId')
    this.authorizeButton = page.locator('button', { hasText: 'Authorize' }); // PRIMARY
    // SECONDARY: page.locator('button.button-primary:has-text("Authorize")')

    // Step 12: Facility activation
    this.activateButton = page.locator('button', { hasText: 'Activate' }); // PRIMARY
    // SECONDARY: page.locator('button[type="submit"]:has-text("Activate")')
    this.nextButton = page.locator('button', { hasText: 'Next' }); // PRIMARY

    // Step 13-14: Hamburger menu and Activity Monitor
    this.hamburgerMenu = page.locator('button[aria-label="Open navigation menu"]'); // PRIMARY
    // SECONDARY: page.locator('mat-drawer button')
    this.activityMonitorMenu = page.locator('span', { hasText: 'Activity Monitor' }); // PRIMARY
    // SECONDARY: page.locator('mat-drawer span:has-text("Activity Monitor")')
    this.settingsMenu = page.locator('span', { hasText: 'Settings' }); // PRIMARY

    // Step 15: Activity Monitor tiles
    this.statusSuccessTile = page.locator('div', { hasText: 'SUCCESS' }); // PRIMARY
    this.statusFailureTile = page.locator('div', { hasText: 'FAILURE' }); // PRIMARY
    this.statusNotStartedTile = page.locator('div', { hasText: 'NOT STARTED' }); // PRIMARY

    // Step 20-32: Unmapped Scanners
    this.mapWithFacilityButton = page.locator('button', { hasText: 'Map with Facility' }); // PRIMARY
    // SECONDARY: page.locator('button.button-primary:has-text("Map with Facility")')
    this.facilityIdDropdown = page.locator('select[name="facilityList"]'); // PRIMARY
    this.facilityNameInput = page.locator('input[name="facilityName"]'); // PRIMARY
    this.mapScannerButton = page.locator('button', { hasText: 'Map Scanner' }); // PRIMARY
    this.closeMappingPopupButton = page.locator('button', { hasText: 'Close' }); // PRIMARY
  }

  /**
   * Step 1-3: Login to DIRL using credentials from ENV
   * Handles Okta login flow.
   */
  async loginToDirL(): Promise<void> {
    await test.step('Step 1-3: Login to DIRL', async () => {
      try {
        await ActionUtils.logInfo('Navigating to ConnectExpress login page', { url: ENV.DIRL_URL });
        await this.page.goto(ENV.DIRL_URL, { waitUntil: 'networkidle', timeout: 90000 });
        await this.signInWithAcrIdLink.waitFor({ state: 'visible', timeout: 15000 });
        await ActionUtils.click(this.signInWithAcrIdLink);
        await this.oktaUsernameField.waitFor({ state: 'visible', timeout: 20000 });
        await ActionUtils.fill(this.oktaUsernameField, ENV.DIRL_USER);
        await ActionUtils.fill(this.oktaPasswordField, ENV.DIRL_PASS);
        await ActionUtils.click(this.oktaLoginButton);
        // Wait for dashboard load
        await this.page.waitForLoadState('networkidle');
        await this.applicationsTab.waitFor({ state: 'visible', timeout: 30000 });
        await ActionUtils.logSuccess('Logged in and dashboard loaded');
      } catch (error) {
        await ActionUtils.logError('Login to DIRL failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Step 7: Navigate to DIRL Application from dashboard
   */
  async navigateToDirLApplication(): Promise<void> {
    await test.step('Step 7: Navigate to DIRL Application', async () => {
      try {
        await this.applicationsTab.waitFor({ state: 'visible', timeout: 15000 });
        await ActionUtils.click(this.applicationsTab);
        await this.dirlAppLink.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(this.dirlAppLink);
        await this.page.waitForLoadState('networkidle');
        await this.siteSettingsTab.waitFor({ state: 'visible', timeout: 20000 });
        await ActionUtils.logSuccess('Navigated to DIRL Application');
      } catch (error) {
        await ActionUtils.logError('Navigation to DIRL Application failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Step 8-10: Enter NRDR Corporate ID and Authorize
   * @param corporateId - The NRDR Corporate ID to authorize
   */
  async authorizeCorporateId(corporateId: string): Promise<void> {
    await test.step('Step 8-10: Authorize NRDR Corporate ID', async () => {
      try {
        await this.nrdrCorporateIdInput.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.fill(this.nrdrCorporateIdInput, corporateId);
        await this.authorizeButton.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(this.authorizeButton);
        // Wait for authorization processing and Site Settings refresh
        await this.page.waitForLoadState('networkidle');
        await this.siteSettingsTab.waitFor({ state: 'visible', timeout: 20000 });
        await ActionUtils.logSuccess('Corporate ID authorized');
      } catch (error) {
        await ActionUtils.logError('Corporate ID authorization failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Step 12: Activate a facility from the list
   */
  async activateFacility(): Promise<void> {
    await test.step('Step 12: Activate a Facility', async () => {
      try {
        await this.activateButton.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(this.activateButton);
        // Wait for activation pop-up and confirmation
        await this.page.waitForSelector('text=Activation Completed Successfully', { timeout: 15000 });
        await ActionUtils.click(this.closeMappingPopupButton);
        await ActionUtils.logSuccess('Facility activated');
      } catch (error) {
        await ActionUtils.logError('Facility activation failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Step 13-14: Open hamburger menu and navigate to Activity Monitor
   */
  async openActivityMonitor(): Promise<void> {
    await test.step('Step 13-14: Open Activity Monitor', async () => {
      try {
        await this.hamburgerMenu.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(this.hamburgerMenu);
        await this.activityMonitorMenu.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(this.activityMonitorMenu);
        await this.page.waitForLoadState('networkidle');
        await this.statusSuccessTile.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.logSuccess('Activity Monitor loaded');
      } catch (error) {
        await ActionUtils.logError('Failed to open Activity Monitor', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Step 16-20: Navigate DIRL tabs (Site Settings, Receiver Settings, Scanner Mapping, File Validation Settings, Unmapped Scanners)
   * @param tabName - Name of the tab to select
   */
  async selectDirLTab(tabName: 'Site Settings' | 'Receiver Settings' | 'Scanner Mapping' | 'File Validation Settings' | 'Unmapped Scanners'): Promise<void> {
    await test.step(`Step 16-20: Select DIRL Tab: ${tabName}`, async () => {
      try {
        let tabLocator: Locator;
        switch (tabName) {
          case 'Site Settings':
            tabLocator = this.siteSettingsTab;
            break;
          case 'Receiver Settings':
            tabLocator = this.receiverSettingsTab;
            break;
          case 'Scanner Mapping':
            tabLocator = this.scannerMappingTab;
            break;
          case 'File Validation Settings':
            tabLocator = this.fileValidationSettingsTab;
            break;
          case 'Unmapped Scanners':
            tabLocator = this.unmappedScannersTab;
            break;
          default:
            throw new Error(`Unknown tab: ${tabName}`);
        }
        await tabLocator.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(tabLocator);
        // Wait for tab panel to become visible
        await this.page.waitForTimeout(500); // Small debounce for tab animation
        await ActionUtils.logSuccess(`Tab '${tabName}' selected`);
      } catch (error) {
        await ActionUtils.logError('Tab selection failed', { tab: tabName, message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Step 20-32: Map an unmapped scanner to a facility
   * @param facilityId - Facility ID to map
   */
  async mapScannerToFacility(facilityId: string): Promise<void> {
    await test.step('Step 20-32: Map Scanner to Facility', async () => {
      try {
        await this.mapWithFacilityButton.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(this.mapWithFacilityButton);
        await this.facilityIdDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.selectDropdownByValue(this.facilityIdDropdown, facilityId);
        await this.mapScannerButton.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(this.mapScannerButton);
        // Wait for mapping confirmation
        await this.page.waitForSelector('text=Completed', { timeout: 10000 });
        await ActionUtils.click(this.closeMappingPopupButton);
        await ActionUtils.logSuccess('Scanner mapped to facility');
      } catch (error) {
        await ActionUtils.logError('Scanner mapping failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * Step 15/34-36: Verify Activity Monitor status transitions
   * @param expectedStatuses - Array of expected status strings (e.g., ['SUCCESS', 'FAILURE'])
   */
  async verifyActivityMonitorStatuses(expectedStatuses: string[]): Promise<void> {
    await test.step('Step 15/34-36: Verify Activity Monitor Statuses', async () => {
      try {
        for (const status of expectedStatuses) {
          let tile: Locator;
          switch (status) {
            case 'SUCCESS':
              tile = this.statusSuccessTile;
              break;
            case 'FAILURE':
              tile = this.statusFailureTile;
              break;
            case 'NOT STARTED':
              tile = this.statusNotStartedTile;
              break;
            default:
              throw new Error(`Unknown status: ${status}`);
          }
          await tile.waitFor({ state: 'visible', timeout: 10000 });
          await expect(tile).toBeVisible();
        }
        await ActionUtils.logSuccess('Activity Monitor statuses verified', { statuses: expectedStatuses });
      } catch (error) {
        await ActionUtils.logError('Activity Monitor status verification failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }

  /**
   * High-level orchestrator for end-to-end DIRL submission flow
   * @param corporateId - NRDR Corporate ID
   * @param facilityId - Facility ID for mapping
   * @param expectedStatuses - Statuses to verify in Activity Monitor
   */
  async completeDirlSubmissionFlow(corporateId: string, facilityId: string, expectedStatuses: string[]): Promise<void> {
    await test.step('Step 1-36: Complete DIRL Submission Flow', async () => {
      try {
        await this.loginToDirL();
        await this.navigateToDirLApplication();
        await this.authorizeCorporateId(corporateId);
        await this.activateFacility();
        await this.openActivityMonitor();
        await this.verifyActivityMonitorStatuses(expectedStatuses);
        await this.selectDirLTab('Unmapped Scanners');
        await this.mapScannerToFacility(facilityId);
        await this.openActivityMonitor();
        await this.verifyActivityMonitorStatuses(['SUCCESS']);
        await ActionUtils.logSuccess('DIRL submission flow completed');
      } catch (error) {
        await ActionUtils.logError('DIRL submission flow failed', { message: error.message, stack: error.stack });
        throw error;
      }
    });
  }
}
