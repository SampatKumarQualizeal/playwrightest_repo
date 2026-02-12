import { test, expect } from '@utils/pageFixture.js';
import { ENV } from '@/config/env.js';
import testDataArray from '@data/Staging/alznetdashboard/e2e/apply-multiple-sex-at-birth-filters-data.json' with { type: 'json' };

// Test Case: TCD_FT_01_FR-1 - Apply multiple Sex at Birth filters
test.describe('Apply multiple Sex at Birth filters - TCD_FT_01_FR-1', () => {
  // Get first test case from array
  const testData = testDataArray[0];
  const sexAtBirthFilters = testData.filters.sexAtBirth;
  const username = ENV.DASHBOARD_USERNAME;
  const password = ENV.DASHBOARD_PASSWORD;
  const url = ENV.BASE_URL;

  test.beforeEach(async ({ loginPage, exploreDataPage }) => {
    // Login and navigate to Explore Data Page
    await loginPage.goto(url);
    await loginPage.login(username, password);
    await exploreDataPage.goto();
    await exploreDataPage.waitForLoad();
  });

  test('should allow user to select and apply Sex at Birth filter', async ({ exploreDataPage }) => {
    // Step 1: Click on Demographics filter
    await exploreDataPage.clickOnFilters('Demographics');

    // Step 2: Apply Sex at Birth filter (e.g., 'Male')
    const sexValue = sexAtBirthFilters[0]; // Get first sex value from test data
    await exploreDataPage.applySexAtBirthFilter(sexValue);

    // Step 3: Click the search button to apply filters
    await exploreDataPage.clickSearch();

    // Step 4: Wait for results to load
    await exploreDataPage.waitForFiltersToApply();

    // Step 5: Verify results are displayed
    const results = await exploreDataPage.getFilteredDemographicResults();
    expect(results).toMatchObject({ race: expect.any(String) });
  });
});
