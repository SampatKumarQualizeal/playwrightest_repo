import { Page, test, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';

let casesCount: number;
export class ExploreDataPage extends BasePage {
  private readonly ageRangeFilter: Locator;
  private readonly ageSelector: Locator;
  private readonly ageRangeToggle: Locator;
  private readonly minAgeSlider: Locator;
  private readonly maxAgeSlider: Locator;
  private readonly sliderBar: Locator;
  private readonly displayedAges: Locator;
  private readonly minAgeInput: Locator;
  private readonly maxAgeInput: Locator;
  private readonly exploreDataButton: Locator;
  private readonly sexAtBirthFilter: Locator;
  private readonly raceFilter: Locator;
  private readonly ethnicityFilter: Locator;
  private readonly demographicResults: Locator;
  private readonly firstDemographicResult: Locator;
  private readonly raceCell: Locator;
  private readonly demographicRows: Locator;
  private readonly sexDropdownFilter: Locator;
  private readonly ageMinFilter: Locator;
  private readonly raceDropdownFilter: Locator;
  private readonly sexAtBirthFilterDropdown: Locator;
  private readonly demographicDataUpdated: Locator;
  private readonly demographicSexAtBirthValue: Locator;
  private readonly appliedSexAtBirthFilter: Locator;
  private readonly exploreDataSearchField: Locator;
  private readonly caseIdButton: Locator;
  private readonly caseIdInput: Locator;
  private readonly polygon: Locator;
  private readonly sidePanelArrowLeft: Locator;
  private readonly searchButton: Locator;
  private readonly status: Locator;
  private readonly totalCountValue: Locator;
  private readonly resultsList: Locator;
  private readonly siteIdButton: Locator;
  private readonly customSelectBox: Locator;
  private readonly siteIdCells: Locator;
  private readonly caseIdCells: Locator;
  private readonly clearButton: Locator;


  constructor(page: Page) {
    super(page);
    this.ageRangeFilter = page.locator('[data-testid="age-range-filter"]');
    this.ageSelector = page.locator('.age-selector');
    this.ageRangeToggle = this.ageSelector.locator('.toggle-row input[type="checkbox"]');
    this.minAgeSlider = this.ageSelector.locator('[role="slider"][aria-label="ngx-slider"]');
    this.maxAgeSlider = this.ageSelector.locator('[role="slider"][aria-label="ngx-slider-max"]');
    this.sliderBar = this.ageSelector.locator('.ngx-slider-full-bar');
    this.displayedAges = page.locator('[data-testid="demographic-age-value"]');
    this.minAgeInput = page.locator('[data-testid="age-range-min"]');
    this.maxAgeInput = page.locator('[data-testid="age-range-max"]');
    this.exploreDataButton = page.locator(
      '//div[contains(@class,"nav-buttons")]/descendant::button[contains(text(),"Explore Data")]',
    );
    this.sexAtBirthFilter = page.locator('.custom-select-box').first().filter({ hasText: 'Select Options' });
    this.raceFilter = page.locator('.col-md-3.demographics_gap > .bottom-border-select-wrapper > .custom-select-box');
    this.ethnicityFilter = page.locator('.col-md-3.demographics_gap_last > .bottom-border-select-wrapper > .custom-select-box').first();
    this.demographicResults = page.locator(
      '[data-testid="demographic-row"], [data-testid="search-results"], table.table tbody tr',
    );
    this.firstDemographicResult = this.demographicResults.first();
    this.raceCell = this.firstDemographicResult.locator('td:nth-child(6)');
    this.demographicRows = page.locator('[data-testid="demographic-row"]');
    this.sexDropdownFilter = page.locator('[data-testid="filter-sex-dropdown"]');
    this.ageMinFilter = page.locator('[data-testid="filter-age-min"]');
    this.raceDropdownFilter = page.locator('[data-testid="filter-race-dropdown"]');
    this.sexAtBirthFilterDropdown = page.locator('[data-test-id="sex-at-birth-filter-dropdown"]');
    this.demographicDataUpdated = page.locator('[data-test-id="demographic-data-updated"]');
    this.demographicSexAtBirthValue = page.locator('[data-test-id="demographic-sex-at-birth-value"]');
    this.appliedSexAtBirthFilter = page.locator('[data-test-id="applied-sex-at-birth-filter"]');
    this.exploreDataSearchField = page.locator('[data-testid="explore-data-search-field"]');
    this.caseIdButton = page.getByRole('button', { name: 'Case ID' });
    this.caseIdInput = page.locator('input[formcontrolname="caseId"]');
    this.polygon = page.locator('polygon');
    this.sidePanelArrowLeft = page.locator('.ci.ci-sidepanel-arrow-left');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.status = page.getByRole('status');
    this.totalCountValue = page.locator("//span[contains(@class,'TotalCountValue')]");
    this.resultsList = page.locator('[data-testid="explore-data-results-list"]');
    this.siteIdButton = page.getByRole('button', { name: 'Site ID' });
    this.customSelectBox = page.locator('.custom-select-box');
    this.siteIdCells = page.locator('table.table tbody tr td:nth-child(1)');
    this.caseIdCells = page.locator('table.table tbody tr td:nth-child(2)');
    this.clearButton = page.getByRole('button', { name: 'Clear' });
  }

  private get createDatasetButton(): Locator {
    return this.page.getByRole('button', { name: 'Create Dataset' });
  }

  private get createDatasetPopup(): Locator {
    return this.page.locator('div').filter({ hasText: 'Create DatasetPlease enter a' }).nth(3);
  }

  private get datasetNameTextbox(): Locator {
    return this.page.getByRole('textbox', { name: 'Dataset Name' });
  }

  private get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }

  private get datasetSuccessMessage(): Locator {
    return this.page.getByText('The dataset has been successfully createdPlease select “My Workspace" option to');
  }

  private get stayOnThisPageButton(): Locator {
    return this.page.getByRole('button', { name: 'Stay on this page' });
  }

  private get selectAllButton(): Locator {
    return this.page.getByText('Select All', { exact: true });
  }

  private get optionsCheckbox(): Locator {
    return this.page.getByRole('option').locator('input[type="checkbox"]');
  }

  private get resetButton(): Locator {
    return this.page.getByRole('button', { name: 'Reset' });
  }

  private get options(): Locator {
    return this.page.getByRole('option');
  }

  private getAppliedFiltersPills(filterName: string): Locator {
    return this.page.locator('.applied-filters-container', { hasText: filterName }).locator('.filter-pill');
  }

  private getSexOption(sex: string): Locator {
    return this.page.getByText(sex, { exact: true });
  }

  private getRaceOption(race: string): Locator {
    return this.page.locator('text=' + race);
  }
  private getEthnicityOption(ethnicity: string): Locator {
    return this.page.getByText(ethnicity, { exact: true })
  }

  private getSexAtBirthOption(option: string): Locator {
    return this.page.locator(`[data-test-id="sex-at-birth-option-${option.toLowerCase()}"]`);
  }

  private getSiteIdOption(siteId: string): Locator {
    return this.page.getByText(siteId, { exact: true });
  }

  private getFilterButton(name: string): Locator {
    return this.page.getByRole('button', { name });
  }
  get ClinicalInformationHeader() {
    return this.page.locator('form');
  }

  async openAgeRangeFilter() {
    await this.ageRangeFilter.click();
  }

  async setAgeRange(min: number, max: number) {
    await test.step('Set Age Range Filter', async () => {
      await this.ageSelector.waitFor({ state: 'visible' });
      const isChecked = await this.ageRangeToggle.isChecked();
      if (isChecked) {
        await this.ageRangeToggle.click({ force: true });
        await this.page.waitForTimeout(500);
      }
      await this.minAgeSlider.waitFor({ state: 'visible' });
      await this.maxAgeSlider.waitFor({ state: 'visible' });
      const currentMin = Number(await this.minAgeSlider.getAttribute('aria-valuenow'));
      const currentMax = Number(await this.maxAgeSlider.getAttribute('aria-valuenow'));
      await this.minAgeSlider.focus();
      const minDiff = min - currentMin;
      if (minDiff > 0) {
        for (let i = 0; i < minDiff; i++) {
          await this.page.keyboard.press('ArrowRight');
        }
      } else {
        for (let i = 0; i < -minDiff; i++) {
          await this.page.keyboard.press('ArrowLeft');
        }
      }
      await this.maxAgeSlider.focus();
      const maxDiff = max - currentMax;
      if (maxDiff > 0) {
        for (let i = 0; i < maxDiff; i++) {
          await this.page.keyboard.press('ArrowRight');
        }
      } else {
        for (let i = 0; i < -maxDiff; i++) {
          await this.page.keyboard.press('ArrowLeft');
        }
      }
    });
  }

  async getDisplayedAges(): Promise<number[]> {
    const ageElements = await this.displayedAges.all();
    const ages = [];
    for (const el of ageElements) {
      const text = await el.textContent();
      if (text) {
        const age = parseInt(text, 10);
        if (!isNaN(age)) {
          ages.push(age);
        }
      }
    }
    return ages;
  }

  async isAgeRangeFilterSticky(min: number, max: number): Promise<boolean> {
    const minValue = await this.minAgeInput.inputValue();
    const maxValue = await this.maxAgeInput.inputValue();
    return minValue === min.toString() && maxValue === max.toString();
  }

  async goto() {
    await test.step('Navigate to Explore Data Page', async () => {
      await this.exploreDataButton.click({ timeout: 90000 });
      await this.page.waitForLoadState('networkidle');
    });
  }

  async toBeVisible() {
    await this.getFilterButton('Explore Data').first().waitFor({ state: 'visible' });
  }

  async applySexAtBirthFilter(sex: string) {
    await test.step('Apply Sex at Birth Filter', async () => {
      await this.sexAtBirthFilter.waitFor({ state: 'visible' });
      await this.sexAtBirthFilter.click();
      const option = this.getSexOption(sex);
      await option.waitFor({ state: 'visible' });
      await option.click();
    });
  }

  async applyAgeRangeFilter(minAge: number) {
    await test.step('Apply Age Range Filter', async () => {
      await this.minAgeSlider.waitFor({ state: 'visible' });
      const sliderBoundingBox = await this.sliderBar.boundingBox();
      if (sliderBoundingBox) {
        const targetX = sliderBoundingBox.x + (sliderBoundingBox.width * (minAge - 1)) / 99;
        await this.minAgeSlider.hover();
        await this.page.mouse.down();
        await this.page.mouse.move(targetX, sliderBoundingBox.y + sliderBoundingBox.height / 2);
        await this.page.mouse.up();
      }
    });
  }

  async applyRaceFilter(race: string) {
    await test.step('Apply Race Filter', async () => {
      await this.raceFilter.waitFor({ state: 'visible' });
      await this.raceFilter.click();
      const option = this.getRaceOption(race);
      await option.waitFor({ state: 'visible' });
      await option.click();
    });
  }

  async waitForFiltersToApply() {
    await this.page.waitForTimeout(500);
    await test.step('Wait for demographic results to be visible', async () => {
      await this.firstDemographicResult.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
        return this.page.waitForLoadState('networkidle');
      });
    });
  }

  async getFilteredDemographicResults() {
    await this.firstDemographicResult.waitFor({ state: 'visible' });
    const race = (await this.raceCell.textContent())?.trim() || '';
    return { race };
  }

  async areOnlyExpectedResultsDisplayed(filters: { sexAtBirth: string; minAge: number; race: string }) {
    await test.step('Verify Only Expected Results Are Displayed', async () => {
      const count = await this.demographicRows.count();
      for (let i = 0; i < count; i++) {
        const row = this.demographicRows.nth(i);
        const sex = await row.locator('[data-testid="row-sex"]').textContent();
        const age = Number(await row.locator('[data-testid="row-age"]').textContent());
        const race = await row.locator('[data-testid="row-race"]').textContent();
        if (sex !== filters.sexAtBirth || age < filters.minAge || race !== filters.race) {
          return false;
        }
      }
      return true;
    });
  }

  async areFiltersPersisted(filters: { sexAtBirth: string; minAge: number; race: string }) {
    await test.step('Verify Filters Are Persisted', async () => {
      const sexValue = await this.sexDropdownFilter.inputValue();
      const ageValue = await this.ageMinFilter.inputValue();
      const raceValue = await this.raceDropdownFilter.inputValue();
      return sexValue === filters.sexAtBirth && Number(ageValue) === filters.minAge && raceValue === filters.race;
    });
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async openSexAtBirthFilter() {
    await this.sexAtBirthFilterDropdown.click();
  }

  async selectSexAtBirthOption(option: string) {
    await this.getSexAtBirthOption(option).click();
  }

  async waitForDemographicDataUpdate() {
    await this.demographicDataUpdated.waitFor({ state: 'visible' });
  }

  async getDemographicData() {
    const sexAtBirthValues = await this.demographicSexAtBirthValue.allTextContents();
    return {
      sexAtBirth: sexAtBirthValues.map((e) => e.trim() || ''),
    };
  }

  async getAppliedSexAtBirthFilters() {
    const appliedFilters = await this.appliedSexAtBirthFilter.allTextContents();
    return appliedFilters.map((e) => e.trim() || '');
  }

  async isLoaded(): Promise<boolean> {
    return this.exploreDataSearchField.isVisible();
  }

  async enterCaseId(caseId: string) {
    await test.step('Enter case Id', async () => {
      await this.page.waitForLoadState('networkidle');
      await this.caseIdButton.waitFor({ state: 'visible' });
      await this.caseIdButton.click();
      await this.caseIdInput.waitFor({ state: 'visible' });
      await this.caseIdInput.fill(caseId);
      await this.polygon.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async clickSearch() {
    await test.step('Click Search Button', async () => {
      await this.page.waitForLoadState('networkidle');
      if ((await this.sidePanelArrowLeft.count()) > 0) {
        if (await this.sidePanelArrowLeft.isVisible()) {
          await this.sidePanelArrowLeft.click({ force: true });
        }
      }
      await this.page.waitForLoadState('networkidle');
      await this.searchButton.click();
    });
  }

  async waitForResults() {
    await this.page.waitForLoadState('networkidle');
    await this.status.waitFor({ state: 'hidden' });
    await this.totalCountValue.waitFor({ state: 'visible', timeout: 10000 });
    const text = await this.totalCountValue.textContent();
    const numberMatch = text?.match(/\d+/);
    casesCount = numberMatch ? parseInt(numberMatch[0], 10) : 0;
    console.log('Extracted number:', casesCount);
  }

  async isResultsListDisplayed(): Promise<boolean> {
    return this.resultsList.isVisible();
  }

  async enterSiteId(siteId: string) {
    await test.step('Enter Site ID', async () => {
      await this.siteIdButton.waitFor({ state: 'visible' });
      await this.siteIdButton.click();
      await this.customSelectBox.waitFor({ state: 'visible' });
      this.customSelectBox.click();
      const option = this.getSiteIdOption(siteId);
      await option.waitFor({ state: 'visible' });
      await option.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async clickSearchButton() {
    await test.step('Click Search Button', async () => {
      await this.page.waitForLoadState('networkidle');
      await this.searchButton.waitFor({ state: 'visible', timeout: 50000 });
      await this.searchButton.hover();
      await this.searchButton.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async getSearchResults(): Promise<Array<{ siteId: string }>> {
    await this.page.waitForLoadState('networkidle');
    await this.status.waitFor({ state: 'hidden' });
    await this.siteIdCells.first().waitFor({ state: 'visible' });
    const texts = await this.siteIdCells.allTextContents();
    const results = texts
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((siteId) => ({ siteId }));
    return results;
  }

  async getResultsCaseIds(): Promise<string[]> {
    await this.caseIdCells.first().waitFor({ state: 'visible' });
    const texts = await this.caseIdCells.allTextContents();
    const caseIds = texts.map((t) => t.trim()).filter((t) => t.length > 0);
    return caseIds;
  }

  async hasCaseId(targetCaseId: string): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const caseIds = await this.getResultsCaseIds();
    return caseIds.includes(targetCaseId);
  }

  async clickOnFilters(Locator: string) {
    await test.step('Click on Filters', async () => {
      const subMenu = this.getFilterButton(Locator);
      await subMenu.waitFor({ state: 'visible' });
      await subMenu.click();
    });
  }

  /**
   * Helper to get the dropdown locator for a given filter name.
   * This method needs to be updated with specific locators for each filter.
   * @param filterName The visible name of the filter (e.g., "Sex at Birth").
   */
  private getFilterDropdownLocator(filterName: string): Locator {
    switch (filterName) {
      case "Sex at Birth":
        return this.page.locator('.custom-select-box').first();
      case "Race":
        return this.page.locator('.custom-select-box').nth(1);
      case "Ethnicity":
        return this.page.locator('.custom-select-box').nth(2);
      default:
        console.warn(`No specific locator defined for filter: ${filterName}. Using a generic approach which might fail.`);
        // Fallback to a generic locator if no specific one is found.
        // This might need adjustment based on the actual HTML structure.
        // This locator attempts to find a div that contains the filterName text and then a custom-select-box within it.
        return this.page.locator('div', { has: this.page.locator(`:text-is("${filterName}")`) }).locator('.custom-select-box');
    }
  }

  /**
   * Selects a single option from a filter dropdown.
   * @param filterName The visible name of the filter, e.g., "Sex at Birth".
   * @param option The option text to select.
   */
  async selectAnyOne(filterName: string, option: string): Promise<void> {
    const dropdown = this.getFilterDropdownLocator(filterName);
    await dropdown.click();
    const optionLocator = this.getSexOption(option);
    await optionLocator.waitFor({ state: 'visible' });
    await optionLocator.click();
  }

  /**
   * Selects multiple options from a filter dropdown.
   * Assumes the dropdown has checkboxes for multi-selection.
   * @param filterName The visible name of the filter.
   * @param options An array of option texts to select.
   */
  async selectMultiple(filterName: string, options: string[]): Promise<void> {
    const dropdown = this.getFilterDropdownLocator(filterName);
    await dropdown.click();
    for (const option of options) {
      const optionLocator = this.getSexOption(option);
      await optionLocator.waitFor({ state: 'visible' });
      await optionLocator.locator('input[type="checkbox"]').check();
    }
    // Click body to close the dropdown
    await this.page.locator('body').click({ force: true, position: { x: 0, y: 0 } });
  }

  /**
   * Selects all options from a filter dropdown.
   * Assumes there is a "Select All" button or checkbox.
   * @param filterName The visible name of the filter.
   */
  async selectAll(filterName: string): Promise<void> {
    const dropdown = this.getFilterDropdownLocator(filterName);
    await dropdown.click();
    if (await this.selectAllButton.isVisible()) {
      await this.selectAllButton.click();
    } else {
      // Fallback for multi-select lists without a 'Select All'
      const allOptions = await this.optionsCheckbox.all();
      for (const option of allOptions) {
        await option.waitFor({ state: 'visible' });
        await option.check();
      }
    }
    await this.page.locator('body').click({ force: true, position: { x: 0, y: 0 } });
  }

  /**
   * Clears all applied filters to reset the state.
   */
  async resetFilters(): Promise<void> {
    await test.step('Reset Filters', async () => {
      if (await this.resetButton.isVisible()) {
        await this.resetButton.click();
        await this.page.waitForLoadState('networkidle');
      } else {
        console.warn("Could not find a 'Reset Filters' button. Tests might be affected by previous state.");
      }
    });
  }

  /**
   * Gets the currently applied filter pills for a given filter name.
   * @param filterName The name of the filter to get applied values for.
   */
  async getAppliedFilters(filterName: string): Promise<string[]> {
    const pills = await this.getAppliedFiltersPills(filterName).allTextContents();
    return pills.map(p => p.trim());
  }

  /**
   * Gets all available options from a filter dropdown.
   * @param filterName The visible name of the filter.
   */
  async getFilterOptions(filterName: string): Promise<string[]> {
    const dropdown = this.getFilterDropdownLocator(filterName);
    await dropdown.click();
    const options = await this.options.allTextContents();
    await dropdown.click(); // Click again to close
    return options.map(o => o.trim());
  }
  async selectAnyOneRace(filterName: string, race: string): Promise<void> {
    const dropdown = this.getFilterDropdownLocator(filterName);
    await dropdown.click();
    const option = this.getRaceOption(race);
    await option.waitFor({ state: 'visible' });
    await option.click();
  }
  async verifyFilterOptionsDisplayed(): Promise<void> {
    await test.step('Verify Filter Options are Displayed', async () => {
      const filters = ['Demographics', 'Clinical Information', 'case ID', 'Site ID'];
      for (const filter of filters) {
        const filterLocator = this.getFilterButton(filter);
        await filterLocator.waitFor({ state: 'visible' });
      }
    });
  }
  async applyEthnicityFilter(ethnicity: string) {
    await test.step('Apply Ethnicity Filter', async () => {
      await this.ethnicityFilter.waitFor({ state: 'visible' });
      await this.ethnicityFilter.click();
      const option = this.getEthnicityOption(ethnicity);
      await option.waitFor({ state: 'visible' });
      await option.click();
    });
  }
  async verifyDemographics(sexAtBirth: string, minAge: number, race: string, ethnicity: string) {
    await test.step('Verify Demographics SexAtBirth, AgerangeFilters,Race, Ethnicity', async () => {
      await this.applySexAtBirthFilter(sexAtBirth);
      await this.applyAgeRangeFilter(minAge);
      await this.applyRaceFilter(race);
      await this.applyEthnicityFilter(ethnicity);
    });

  }
  private get clinicalDataElements(): Locator {
    return this.page.locator('.custom-select-box').first();
  }

  private get subjectLevelFolder(): Locator {
    return this.page.locator('.col-md-3 > .bottom-border-select-wrapper > .custom-select-box').first();
  }

  private get caseReportForm(): Locator {
    return this.page.locator('div:nth-child(3) > .bottom-border-select-wrapper > .custom-select-box');
  }

  async verifyClinicalInformationFields() {
    await test.step('verify clinical Information', async () => {
      await this.ClinicalInformationHeader.waitFor({ state: 'visible' });
      await this.clinicalDataElements.waitFor({ state: 'visible' });
      await this.subjectLevelFolder.waitFor({ state: 'visible' });
      await this.caseReportForm.waitFor({ state: 'visible' });
    });

  }
  async clickDataSetAndverify(datasetName: string) {
    await test.step('Click Data set and verify', async () => {
      await this.createDatasetButton.waitFor({ state: 'visible' });
      await this.createDatasetButton.click();
      await this.createDatasetPopup.waitFor({ state: 'visible' });
      await this.datasetNameTextbox.click();
      await this.datasetNameTextbox.fill(datasetName);
      await this.saveButton.click();
      await this.datasetSuccessMessage.waitFor({ state: 'visible' });
      await this.stayOnThisPageButton.click();
    });
  }
}