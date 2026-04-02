import { Page, Locator, expect, test } from "@playwright/test";
import { ActionUtils } from "@/utils/action-utils.js";

/**
 * Page Object for DIRL Unmapped Scanners page and Map Scanner modal.
 * Handles Unmapped Scanners tab, table headers, Map with Facility modal, and mapping workflow.
 *
 * Step Mapping: [28]
 */
export class DirLUnmappedScannersPage {
  private readonly page: Page;

  // --- Unmapped Scanners Tab & Table Locators ---
  private readonly unmappedScannersTab: Locator;
  // Table headers
  private readonly tableHeaderModality: Locator;
  private readonly tableHeaderStationName: Locator;
  private readonly tableHeaderManufacturer: Locator;
  private readonly tableHeaderModelName: Locator;
  private readonly tableHeaderInstitutionName: Locator;
  private readonly tableHeaderDeviceSerialNo: Locator;
  private readonly tableHeaderSoftwareVersion: Locator;
  private readonly tableHeaderNoOfStudies: Locator;
  private readonly tableHeaderNoOfFiles: Locator;
  private readonly tableHeaderAction: Locator;
  // Table rows
  private readonly scannerRows: Locator;
  private readonly mapWithFacilityButton: Locator;

  // --- Map Scanner Modal Locators ---
  private readonly modalDialog: Locator;
  private readonly facilityIdDropdown: Locator;
  private readonly facilityNameField: Locator;
  private readonly saveButton: Locator;
  private readonly closeButton: Locator;
  // Modal scanner detail fields (read-only)
  private readonly stationNameField: Locator;
  private readonly manufacturerField: Locator;
  private readonly modelNameField: Locator;
  private readonly institutionNameField: Locator;
  private readonly deviceSerialNoField: Locator;
  private readonly softwareVersionField: Locator;

  // --- Navigation/Close elements ---
  private readonly modalCloseIcon: Locator;
  private readonly returnToUnmappedScannersLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // --- Unmapped Scanners Tab & Table ---
    this.unmappedScannersTab = page.locator('div[role="tab"]:has-text("Unmapped Scanners")'); // PRIMARY
    // SECONDARY: //div[contains(@role,'tab')][normalize-space()='Unmapped Scanners']
    this.tableHeaderModality = page.locator('th:has-text("Modality")'); // PRIMARY
    // SECONDARY: //th[contains(text(),'Modality')]
    this.tableHeaderStationName = page.locator('th:has-text("Station Name")'); // PRIMARY
    // SECONDARY: //th[contains(text(),'Station Name')]
    this.tableHeaderManufacturer = page.locator('th:has-text("Manufacturer")'); // PRIMARY
    this.tableHeaderModelName = page.locator('th:has-text("Model Name")'); // PRIMARY
    this.tableHeaderInstitutionName = page.locator('th:has-text("Institution Name")'); // PRIMARY
    this.tableHeaderDeviceSerialNo = page.locator('th:has-text("Device Serial No.")'); // PRIMARY
    this.tableHeaderSoftwareVersion = page.locator('th:has-text("Software Version")'); // PRIMARY
    this.tableHeaderNoOfStudies = page.locator('th:has-text("No. of Studies")'); // PRIMARY
    this.tableHeaderNoOfFiles = page.locator('th:has-text("No. of Files")'); // PRIMARY
    this.tableHeaderAction = page.locator('th:has-text("Action")'); // PRIMARY
    // Table rows
    this.scannerRows = page.locator('tbody tr'); // PRIMARY
    // SECONDARY: //tbody/tr
    this.mapWithFacilityButton = page.locator('button:has-text("Map with Facility")'); // PRIMARY
    // SECONDARY: //button[contains(text(),'Map with Facility')]

    // --- Map Scanner Modal ---
    this.modalDialog = page.locator('div[role="dialog"]:has-text("Map Scanner")'); // PRIMARY
    // SECONDARY: //div[@role='dialog' and contains(.,'Map Scanner')]
    this.facilityIdDropdown = page.locator('select[name="facilityList"]'); // PRIMARY
    // SECONDARY: //select[@name='facilityList']
    this.facilityNameField = page.locator('input[name="facilityName"]'); // PRIMARY
    // SECONDARY: //input[@name='facilityName']
    this.saveButton = page.locator('button:has-text("Map Scanner")'); // PRIMARY
    // SECONDARY: //button[contains(text(),'Map Scanner')]
    this.closeButton = page.locator('button:has-text("Close")'); // PRIMARY
    // SECONDARY: //button[contains(text(),'Close')]
    this.modalCloseIcon = page.locator('button[aria-label="Close"]'); // PRIMARY
    // SECONDARY: //button[@aria-label='Close']
    // Modal scanner detail fields
    this.stationNameField = page.locator('input[name="stationName"]'); // PRIMARY
    this.manufacturerField = page.locator('input[name="manufacturer"]'); // PRIMARY
    this.modelNameField = page.locator('input[name="modelName"]'); // PRIMARY
    this.institutionNameField = page.locator('input[name="institutionName"]'); // PRIMARY
    this.deviceSerialNoField = page.locator('input[name="deviceSerialNo"]'); // PRIMARY
    this.softwareVersionField = page.locator('input[name="softwareVersion"]'); // PRIMARY
    // Navigation/return
    this.returnToUnmappedScannersLink = page.locator('a:has-text("Unmapped Scanners")'); // PRIMARY
    // SECONDARY: //a[contains(text(),'Unmapped Scanners')]
  }

  /**
   * Loads the Unmapped Scanners tab and waits for table to be visible.
   * // Step 28: Load Unmapped Scanners tab
   */
  async loadUnmappedScannersTab(): Promise<void> {
    try {
      console.info("[DIRL][UnmappedScanners] Navigating to Unmapped Scanners tab", { step: 28 });
      await this.unmappedScannersTab.waitFor({ state: 'visible' });
      await ActionUtils.click(this.unmappedScannersTab);
      await this.tableHeaderModality.waitFor({ state: 'visible' });
      console.info("[DIRL][UnmappedScanners] Unmapped Scanners tab loaded successfully", { step: 28 });
    } catch (error) {
      console.error("[DIRL][UnmappedScanners] Failed to load Unmapped Scanners tab", { step: 28, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Verifies all expected table headers are present.
   * // Step 28: Verify Unmapped Scanners table headers
   */
  async verifyTableHeaders(): Promise<void> {
    try {
      console.info("[DIRL][UnmappedScanners] Verifying table headers", { step: 28 });
      await Promise.all([
        this.tableHeaderModality.waitFor({ state: 'visible' }),
        this.tableHeaderStationName.waitFor({ state: 'visible' }),
        this.tableHeaderManufacturer.waitFor({ state: 'visible' }),
        this.tableHeaderModelName.waitFor({ state: 'visible' }),
        this.tableHeaderInstitutionName.waitFor({ state: 'visible' }),
        this.tableHeaderDeviceSerialNo.waitFor({ state: 'visible' }),
        this.tableHeaderSoftwareVersion.waitFor({ state: 'visible' }),
        this.tableHeaderNoOfStudies.waitFor({ state: 'visible' }),
        this.tableHeaderNoOfFiles.waitFor({ state: 'visible' }),
        this.tableHeaderAction.waitFor({ state: 'visible' })
      ]);
      console.info("[DIRL][UnmappedScanners] All table headers verified", { step: 28 });
    } catch (error) {
      console.error("[DIRL][UnmappedScanners] Table header verification failed", { step: 28, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Selects a scanner row by index (default: first row).
   * // Step 28: Select scanner row
   */
  async selectScannerRow(rowIndex = 0): Promise<void> {
    try {
      console.info("[DIRL][UnmappedScanners] Selecting scanner row", { step: 28, rowIndex });
      const row = this.scannerRows.nth(rowIndex);
      await row.waitFor({ state: 'visible' });
      await row.scrollIntoViewIfNeeded();
      console.info("[DIRL][UnmappedScanners] Scanner row selected", { step: 28, rowIndex });
    } catch (error) {
      console.error("[DIRL][UnmappedScanners] Failed to select scanner row", { step: 28, rowIndex, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Clicks 'Map with Facility' for a given scanner row (default: first row).
   * // Step 28: Open Map Scanner modal
   */
  async openMapScannerModal(rowIndex = 0): Promise<void> {
    try {
      console.info("[DIRL][UnmappedScanners] Opening Map Scanner modal", { step: 28, rowIndex });
      const row = this.scannerRows.nth(rowIndex);
      await row.waitFor({ state: 'visible' });
      const mapBtn = row.locator('button:has-text("Map with Facility")');
      await mapBtn.waitFor({ state: 'visible' });
      await ActionUtils.click(mapBtn);
      await this.modalDialog.waitFor({ state: 'visible' });
      console.info("[DIRL][UnmappedScanners] Map Scanner modal opened", { step: 28 });
    } catch (error) {
      console.error("[DIRL][UnmappedScanners] Failed to open Map Scanner modal", { step: 28, rowIndex, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Maps the scanner to a Facility ID and saves.
   * // Step 28: Map scanner to facility
   * @param facilityId Facility ID to select
   */
  async mapScannerToFacility(facilityId: string): Promise<void> {
    try {
      console.info("[DIRL][UnmappedScanners] Mapping scanner to facility", { step: 28, facilityId });
      await this.facilityIdDropdown.waitFor({ state: 'visible' });
      await ActionUtils.click(this.facilityIdDropdown);
      await this.facilityIdDropdown.selectOption({ value: facilityId });
      await this.facilityNameField.waitFor({ state: 'visible' });
      // Facility Name should auto-populate after selection
      const facilityNameValue = await this.facilityNameField.inputValue();
      if (!facilityNameValue) {
        throw new Error(`Facility Name did not auto-populate for Facility ID ${facilityId}`);
      }
      console.info("[DIRL][UnmappedScanners] Facility selected and name populated", { step: 28, facilityId, facilityNameValue });
      await this.saveButton.waitFor({ state: 'visible' });
      await ActionUtils.click(this.saveButton);
      // Wait for modal to close (save triggers mapping API and UI update)
      await this.modalDialog.waitFor({ state: 'hidden' });
      console.info("[DIRL][UnmappedScanners] Scanner mapped to facility and modal closed", { step: 28, facilityId });
    } catch (error) {
      console.error("[DIRL][UnmappedScanners] Failed to map scanner to facility", { step: 28, facilityId, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Closes the Map Scanner modal using the Close button.
   * // Step 28: Close Map Scanner modal
   */
  async closeMapScannerModal(): Promise<void> {
    try {
      console.info("[DIRL][UnmappedScanners] Closing Map Scanner modal", { step: 28 });
      await this.closeButton.waitFor({ state: 'visible' });
      await ActionUtils.click(this.closeButton);
      await this.modalDialog.waitFor({ state: 'hidden' });
      console.info("[DIRL][UnmappedScanners] Map Scanner modal closed", { step: 28 });
    } catch (error) {
      console.error("[DIRL][UnmappedScanners] Failed to close Map Scanner modal", { step: 28, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Verifies that the scanner is no longer present in the Unmapped Scanners table (i.e., mapping succeeded).
   * // Step 28: Verify scanner is mapped (absent from table)
   * @param scannerIdentifierText Text uniquely identifying the scanner row (e.g., serial no or station name)
   */
  async verifyScannerIsMapped(scannerIdentifierText: string): Promise<void> {
    try {
      console.info("[DIRL][UnmappedScanners] Verifying scanner is mapped (absent from table)", { step: 28, scannerIdentifierText });
      await this.scannerRows.first().waitFor({ state: 'visible' });
      const matchingRows = await this.scannerRows.filter({ hasText: scannerIdentifierText }).count();
      expect(matchingRows).toBe(0);
      console.info("[DIRL][UnmappedScanners] Scanner is no longer present in Unmapped Scanners table", { step: 28, scannerIdentifierText });
    } catch (error) {
      console.error("[DIRL][UnmappedScanners] Scanner mapping verification failed", { step: 28, scannerIdentifierText, error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Verifies that all scanner details are auto-populated in the modal except Facility ID and Facility Name.
   * // Step 28: Verify scanner details in modal
   */
  async verifyModalScannerDetailsPopulated(): Promise<void> {
    try {
      console.info("[DIRL][UnmappedScanners] Verifying scanner details are auto-populated in modal", { step: 28 });
      await this.stationNameField.waitFor({ state: 'visible' });
      await this.manufacturerField.waitFor({ state: 'visible' });
      await this.modelNameField.waitFor({ state: 'visible' });
      await this.institutionNameField.waitFor({ state: 'visible' });
      await this.deviceSerialNoField.waitFor({ state: 'visible' });
      await this.softwareVersionField.waitFor({ state: 'visible' });
      // Facility ID and Name should be empty
      const facilityIdValue = await this.facilityIdDropdown.inputValue();
      const facilityNameValue = await this.facilityNameField.inputValue();
      expect(facilityIdValue).toBe('');
      expect(facilityNameValue).toBe('');
      console.info("[DIRL][UnmappedScanners] Modal scanner details verified", { step: 28 });
    } catch (error) {
      console.error("[DIRL][UnmappedScanners] Modal scanner details verification failed", { step: 28, error: error.message, stack: error.stack });
      throw error;
    }
  }
}
