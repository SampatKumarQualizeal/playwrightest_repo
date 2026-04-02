import { Page, Locator, expect, test } from "@playwright/test";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * DirLDashboardPage encapsulates DIRL portal navigation and actions.
 * All locators use primary and fallback strategies. All actions use explicit waits and logging.
 * StepMapping: [7]
 */
export class DirLDashboardPage {
  private readonly page: Page;

  // Applications menu
  private readonly applicationsMenu: Locator;
  // DIRL application tile within Applications list
  private readonly dirlAppTile: Locator;
  // Activity Monitor menu item
  private readonly activityMonitorMenu: Locator;
  // Settings tab/menu
  private readonly settingsTab: Locator;
  // Unmapped Scanners tab
  private readonly unmappedScannersTab: Locator;

  constructor(page: Page) {
    this.page = page;
    // Applications menu
    this.applicationsMenu = page.locator('button[aria-label="Applications"]'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('nav[role="navigation"] button:has-text("Applications")')
    // page.locator('//button[contains(@aria-label, "Applications")]')

    // DIRL application tile
    this.dirlAppTile = page.locator('div[role="listitem"]:has-text("DIR Link")'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('div.app-tile:has-text("DIR Link")')
    // page.locator('//div[contains(@class, "app-tile") and contains(., "DIR Link")]')

    // Activity Monitor menu item
    this.activityMonitorMenu = page.locator('a[role="menuitem"]:has-text("Activity Monitor")'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('nav[role="navigation"] a:has-text("Activity Monitor")')
    // page.locator('//a[contains(@role, "menuitem") and contains(., "Activity Monitor")]')

    // Settings tab/menu
    this.settingsTab = page.locator('a[role="tab"]:has-text("Settings")'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('nav[role="navigation"] a:has-text("Settings")')
    // page.locator('//a[contains(@role, "tab") and contains(., "Settings")]')

    // Unmapped Scanners tab
    this.unmappedScannersTab = page.locator('a[role="tab"]:has-text("Unmapped Scanners")'); // PRIMARY
    // SECONDARY LOCATORS (fallback)
    // page.locator('nav[role="navigation"] a:has-text("Unmapped Scanners")')
    // page.locator('//a[contains(@role, "tab") and contains(., "Unmapped Scanners")]')
  }

  /**
   * // Step 7: Open the Applications menu
   */
  async openApplications(): Promise<void> {
    const logger = this.getLogger();
    try {
      logger.info("// Step 7: Opening Applications menu");
      await test.step("Open Applications menu", async () => {
        await this.applicationsMenu.waitFor({ state: 'visible' });
        logger.info("Applications menu is visible");
        await ActionUtils.click(this.applicationsMenu);
        logger.info("Clicked Applications menu");
      });
    } catch (error: any) {
      logger.error("Failed to open Applications menu", { step: 7, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * // Step 7: Select the DIRL application from the Applications list
   */
  async selectDirLApp(): Promise<void> {
    const logger = this.getLogger();
    try {
      logger.info("// Step 7: Selecting DIRL application tile");
      await test.step("Select DIRL application tile", async () => {
        await this.dirlAppTile.waitFor({ state: 'visible' });
        logger.info("DIRL application tile is visible");
        await ActionUtils.click(this.dirlAppTile);
        logger.info("Clicked DIRL application tile");
        // Wait for navigation to complete (networkidle and UI ready)
        await this.page.waitForLoadState('networkidle');
        logger.info("Page load state is networkidle after DIRL app selection");
        // Wait for a key UI element on DIRL dashboard (e.g., Activity Monitor menu)
        await this.activityMonitorMenu.waitFor({ state: 'visible' });
        logger.info("DIRL dashboard loaded, Activity Monitor menu is visible");
      });
    } catch (error: any) {
      logger.error("Failed to select DIRL application tile", { step: 7, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * // Step 7: Navigate to Activity Monitor via menu
   */
  async navigateToActivityMonitor(): Promise<void> {
    const logger = this.getLogger();
    try {
      logger.info("// Step 7: Navigating to Activity Monitor");
      await test.step("Navigate to Activity Monitor", async () => {
        await this.activityMonitorMenu.waitFor({ state: 'visible' });
        logger.info("Activity Monitor menu is visible");
        await ActionUtils.click(this.activityMonitorMenu);
        logger.info("Clicked Activity Monitor menu");
        // Wait for navigation (networkidle and UI ready)
        await this.page.waitForLoadState('networkidle');
        // Wait for a key Activity Monitor UI element (e.g., status summary tile)
        // This is a placeholder; replace with actual locator if available
        const statusSummaryTile = this.page.locator('div.status-summary-tile');
        await statusSummaryTile.waitFor({ state: 'visible' });
        logger.info("Activity Monitor page loaded, status summary tile is visible");
      });
    } catch (error: any) {
      logger.error("Failed to navigate to Activity Monitor", { step: 7, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * // Step 7: Open the Settings tab/menu
   */
  async openSiteSettings(): Promise<void> {
    const logger = this.getLogger();
    try {
      logger.info("// Step 7: Opening Settings tab");
      await test.step("Open Settings tab", async () => {
        await this.settingsTab.waitFor({ state: 'visible' });
        logger.info("Settings tab is visible");
        await ActionUtils.click(this.settingsTab);
        logger.info("Clicked Settings tab");
        // Wait for navigation (networkidle and UI ready)
        await this.page.waitForLoadState('networkidle');
        // Wait for a key Site Settings UI element (e.g., NRDR Corporate ID input)
        const corporateIdInput = this.page.locator('input[placeholder="Corporate ID"]');
        await corporateIdInput.waitFor({ state: 'visible' });
        logger.info("Site Settings page loaded, Corporate ID input is visible");
      });
    } catch (error: any) {
      logger.error("Failed to open Settings tab", { step: 7, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * // Step 7: Open the Unmapped Scanners tab
   */
  async openUnmappedScanners(): Promise<void> {
    const logger = this.getLogger();
    try {
      logger.info("// Step 7: Opening Unmapped Scanners tab");
      await test.step("Open Unmapped Scanners tab", async () => {
        await this.unmappedScannersTab.waitFor({ state: 'visible' });
        logger.info("Unmapped Scanners tab is visible");
        await ActionUtils.click(this.unmappedScannersTab);
        logger.info("Clicked Unmapped Scanners tab");
        // Wait for navigation (networkidle and UI ready)
        await this.page.waitForLoadState('networkidle');
        // Wait for a key Unmapped Scanners UI element (e.g., table header)
        const unmappedScannersTableHeader = this.page.locator('th:has-text("Modality")');
        await unmappedScannersTableHeader.waitFor({ state: 'visible' });
        logger.info("Unmapped Scanners page loaded, table header is visible");
      });
    } catch (error: any) {
      logger.error("Failed to open Unmapped Scanners tab", { step: 7, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * // Step 7: Initiate the scanner mapping workflow from Unmapped Scanners
   */
  async initiateMappingWorkflow(scannerRowIndex: number = 0): Promise<void> {
    const logger = this.getLogger();
    try {
      logger.info("// Step 7: Initiating scanner mapping workflow", { scannerRowIndex });
      await test.step("Initiate Mapping Workflow", async () => {
        // Wait for the Unmapped Scanners table to be visible
        const unmappedScannersTable = this.page.locator('table.unmapped-scanners');
        await unmappedScannersTable.waitFor({ state: 'visible' });
        logger.info("Unmapped Scanners table is visible");
        // Find the Map with Facility button in the specified row
        const mapWithFacilityButton = unmappedScannersTable.locator('button:has-text("Map with Facility")').nth(scannerRowIndex);
        await mapWithFacilityButton.waitFor({ state: 'visible' });
        logger.info("Map with Facility button is visible in row", { scannerRowIndex });
        await ActionUtils.click(mapWithFacilityButton);
        logger.info("Clicked Map with Facility button");
        // Wait for the mapping popup/dialog to appear
        const mappingDialog = this.page.locator('div[role="dialog"]:has-text("Map Scanner with Facility")');
        await mappingDialog.waitFor({ state: 'visible' });
        logger.info("Mapping dialog is visible");
      });
    } catch (error: any) {
      logger.error("Failed to initiate mapping workflow", { step: 7, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Simple logger for structured logging.
   */
  private getLogger() {
    return {
      info: (message: string, meta?: any) => console.info(`[DIRL-Dashboard][INFO] ${message}`, meta || ""),
      error: (message: string, meta?: any) => console.error(`[DIRL-Dashboard][ERROR] ${message}`, meta || "")
    };
  }
}
