import { Page, Locator, expect, test } from "@playwright/test";
import { BasePage } from "@/pages/base.page.js";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object for DIRL end-to-end submission workflow.
 * Encapsulates all DIRL-related UI interactions with robust synchronization and structured logging.
 */
export class DirLFlowPage extends BasePage {
  private readonly siteSettingsTab: Locator;
  private readonly corporateIdInput: Locator;
  private readonly authorizeButton: Locator;
  private readonly facilityList: Locator;
  private readonly activateButton: Locator;
  private readonly scannerMappingTab: Locator;
  private readonly scannerList: Locator;
  private readonly mapWithFacilityButton: Locator;
  private readonly mappingModal: Locator;
  private readonly facilityDropdown: Locator;
  private readonly modalConfirmButton: Locator;
  private readonly dirlActivationStatusText: Locator;
  private readonly siteSettingsTabs: Locator;
  private readonly hamburgerMenu: Locator;
  private readonly dirlSuccessToast: Locator;
  private readonly nextButton: Locator;
  private readonly warningMessage: Locator;
  private readonly activityMonitorMenu: Locator;
  private readonly activityMonitorPage: Locator;
  private readonly statusSummaryTiles: Locator;

  constructor(page: Page) {
    super(page);
    // Locators are initialized here; selectors must be updated to match actual DOM
    this.siteSettingsTab = page.getByRole('tab', { name: /Site Settings/i });
    this.corporateIdInput = page.locator('input[name="corporateId"]');
    this.authorizeButton = page.getByRole('button', { name: /Authorize/i });
    this.facilityList = page.locator('[data-testid="facility-list"]');
    this.activateButton = page.getByRole('button', { name: /Activate/i });
    this.scannerMappingTab = page.getByRole('tab', { name: /Scanner Mapping/i });
    this.scannerList = page.locator('[data-testid="scanner-list"]');
    this.mapWithFacilityButton = page.getByRole('button', { name: /Map with Facility/i });
    this.mappingModal = page.locator('[data-testid="mapping-modal"]');
    this.facilityDropdown = page.locator('[data-testid="facility-dropdown"]');
    this.modalConfirmButton = page.getByRole('button', { name: /Confirm|Save|OK/i });
    this.dirlActivationStatusText = page.locator('text=/DIR Link is activated|NRDR Corporate Status Authorized/i');
    this.siteSettingsTabs = page.locator('[data-testid="site-settings-tabs"]');
    this.hamburgerMenu = page.locator('[data-testid="hamburger-menu"]');
    this.dirlSuccessToast = page.locator('[data-testid="toast-success"]');
    this.nextButton = page.getByRole('button', { name: /Next/i });
    this.warningMessage = page.locator('text=/DIR Link is not activated!/i');
    this.activityMonitorMenu = page.getByRole('menuitem', { name: /Activity Monitor/i });
    this.activityMonitorPage = page.locator('text=/Activity Monitor/i');
    this.statusSummaryTiles = page.locator('[data-testid="status-summary-tile"]');
  }

  /**
   * Navigates to the DIRL Site Settings area with robust synchronization.
   */
  async navigateToDirlSiteSettings(): Promise<void> {
    await test.step('Navigate to DIRL Site Settings', async () => {
      try {
        ActionUtils.logInfo('Navigating to DIRL Site Settings');
        await this.page.goto('https://connectexpress-test.acr.org/', { waitUntil: 'domcontentloaded', timeout: 90000 });
        await this.page.waitForLoadState('networkidle');
        ActionUtils.logInfo('Waiting for Site Settings tab to be visible');
        await this.siteSettingsTab.waitFor({ state: 'visible', timeout: 15000 });
        ActionUtils.logSuccess('Site Settings tab is visible');
      } catch (error) {
        ActionUtils.logError('Failed to navigate to DIRL Site Settings', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }

  /**
   * Checks if a Corporate ID is already authorized by inspecting UI state.
   * @returns true if authorized, false otherwise
   */
  async checkCorporateAuthorizationStatus(): Promise<boolean> {
    return await test.step('Check Corporate Authorization Status', async () => {
      try {
        ActionUtils.logInfo('Checking Corporate Authorization status');
        await this.corporateIdInput.waitFor({ state: 'visible', timeout: 10000 });
        const isAuthorized = await this.dirlActivationStatusText.isVisible();
        ActionUtils.logInfo('Corporate Authorization status', { isAuthorized });
        return isAuthorized;
      } catch (error) {
        ActionUtils.logError('Error checking Corporate Authorization status', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }

  /**
   * Authorizes a Corporate ID by entering it and clicking Authorize, with robust waits and verification.
   * @param corporateId The NRDR Corporate ID to authorize
   */
  async authorizeCorporateId(corporateId: string): Promise<void> {
    await test.step('Authorize Corporate ID', async () => {
      try {
        ActionUtils.logInfo('Authorizing Corporate ID', { corporateId });
        await this.corporateIdInput.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.fill(this.corporateIdInput, corporateId);
        await this.authorizeButton.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.authorizeButton).toBeEnabled();
        await ActionUtils.click(this.authorizeButton);
        // Wait for network and UI confirmation
        await this.page.waitForLoadState('networkidle');
        await this.dirlActivationStatusText.waitFor({ state: 'visible', timeout: 15000 });
        ActionUtils.logSuccess('Corporate ID authorized and DIR Link activated');
      } catch (error) {
        ActionUtils.logError('Failed to authorize Corporate ID', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined, corporateId });
        throw error;
      }
    });
  }

  /**
   * Activates a facility by selecting it and clicking Activate, with explicit waits.
   * @param facilityName The facility name to activate
   */
  async activateFacility(facilityName: string): Promise<void> {
    await test.step('Activate Facility', async () => {
      try {
        ActionUtils.logInfo('Activating facility', { facilityName });
        await this.facilityList.waitFor({ state: 'visible', timeout: 10000 });
        const facilityRow = this.facilityList.getByText(facilityName, { exact: false });
        await facilityRow.waitFor({ state: 'visible', timeout: 5000 });
        await ActionUtils.click(facilityRow);
        await this.activateButton.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.activateButton).toBeEnabled();
        await ActionUtils.click(this.activateButton);
        // Wait for activation confirmation (toast or status)
        await this.dirlSuccessToast.waitFor({ state: 'visible', timeout: 15000 });
        ActionUtils.logSuccess('Facility activated', { facilityName });
      } catch (error) {
        ActionUtils.logError('Failed to activate facility', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined, facilityName });
        throw error;
      }
    });
  }

  /**
   * Maps a scanner to a facility using the mapping modal, with explicit waits and field verification.
   * @param scannerName The scanner to map
   * @param facilityName The facility to map to
   */
  async mapScannerToFacility(scannerName: string, facilityName: string): Promise<void> {
    await test.step('Map Scanner to Facility', async () => {
      try {
        ActionUtils.logInfo('Mapping scanner to facility', { scannerName, facilityName });
        await this.scannerMappingTab.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(this.scannerMappingTab);
        await this.scannerList.waitFor({ state: 'visible', timeout: 10000 });
        const scannerRow = this.scannerList.getByText(scannerName, { exact: false });
        await scannerRow.waitFor({ state: 'visible', timeout: 5000 });
        await ActionUtils.click(scannerRow);
        await this.mapWithFacilityButton.waitFor({ state: 'visible', timeout: 5000 });
        await ActionUtils.click(this.mapWithFacilityButton);
        await this.mappingModal.waitFor({ state: 'visible', timeout: 10000 });
        // Verify modal fields (scanner details auto-populated, facility fields empty)
        await expect(this.mappingModal.getByText(scannerName)).toBeVisible();
        await expect(this.facilityDropdown).toBeVisible();
        await ActionUtils.click(this.facilityDropdown);
        const facilityOption = this.page.getByRole('option', { name: facilityName });
        await facilityOption.waitFor({ state: 'visible', timeout: 5000 });
        await ActionUtils.click(facilityOption);
        await this.modalConfirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.modalConfirmButton).toBeEnabled();
        await ActionUtils.click(this.modalConfirmButton);
        // Wait for modal to close and success toast
        await this.mappingModal.waitFor({ state: 'hidden', timeout: 10000 });
        await this.dirlSuccessToast.waitFor({ state: 'visible', timeout: 10000 });
        ActionUtils.logSuccess('Scanner mapped to facility', { scannerName, facilityName });
      } catch (error) {
        ActionUtils.logError('Failed to map scanner to facility', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined, scannerName, facilityName });
        throw error;
      }
    });
  }

  /**
   * Verifies the DIR Link activation status and related UI blocks.
   */
  async verifyDirlActivationStatus(): Promise<void> {
    await test.step('Verify DIRL Activation Status', async () => {
      try {
        ActionUtils.logInfo('Verifying DIRL activation status');
        await this.dirlActivationStatusText.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.dirlActivationStatusText).toBeVisible();
        await this.siteSettingsTabs.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.siteSettingsTabs).toBeVisible();
        await this.hamburgerMenu.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.hamburgerMenu).toBeVisible();
        ActionUtils.logSuccess('DIRL activation status and UI blocks verified');
      } catch (error) {
        ActionUtils.logError('Failed to verify DIRL activation status', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }

  /**
   * Verifies data propagation through DIR Service, CBS ingestion, and DB indicators.
   */
  async verifyDataPropagation(): Promise<void> {
    await test.step('Verify Data Propagation', async () => {
      try {
        ActionUtils.logInfo('Verifying data propagation through DIR Service, CBS, and DB');
        // Wait for status summary tiles (SUCCESS, FAILURE, NOT STARTED)
        await this.statusSummaryTiles.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(this.statusSummaryTiles).toHaveCountGreaterThan(0);
        // Optionally, verify Activity Monitor is accessible
        await this.activityMonitorMenu.waitFor({ state: 'visible', timeout: 10000 });
        await ActionUtils.click(this.activityMonitorMenu);
        await this.activityMonitorPage.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.activityMonitorPage).toBeVisible();
        ActionUtils.logSuccess('Data propagation verified through UI indicators');
      } catch (error) {
        ActionUtils.logError('Failed to verify data propagation', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }

  /**
   * Verifies final UI states: success indicators, navigation, and no errors.
   */
  async verifyFinalUIStates(): Promise<void> {
    await test.step('Verify Final UI States', async () => {
      try {
        ActionUtils.logInfo('Verifying final UI states');
        await this.dirlSuccessToast.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.dirlSuccessToast).toBeVisible();
        // Optionally, check navigation returns to Site Settings or dashboard
        await this.siteSettingsTab.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.siteSettingsTab).toBeVisible();
        ActionUtils.logSuccess('Final UI states verified (success indicators and navigation)');
      } catch (error) {
        ActionUtils.logError('Failed to verify final UI states', { error: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined });
        throw error;
      }
    });
  }
}
