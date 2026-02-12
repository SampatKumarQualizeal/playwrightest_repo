// Playwright test for TCD_FT_04_FR-4: Apply combined filters for Sex at Birth, Age Range, and Race
import { test, expect } from '@utils/pageFixture.js';
import testData from '@data/Staging/alznetdashboard/smoke/verify-explore-data-page.json' with { type: 'json' };
import { ENV } from '@/config/env.js';

// Test Data - Read from JSON and ENV
const filters = testData.filterTabs;
const sexAtBirth = testData.filters.sexAtBirth; // 'Male'
const minAge = testData.ageRange.min; // 30
const race = testData.race;
const ethnicity = testData.ethnicity; // 'Black, African American, or African'
const siteId = testData.searchCriteria.siteId;
const username = ENV.DASHBOARD_USERNAME;
const password = ENV.DASHBOARD_PASSWORD;
const url = ENV.BASE_URL;

test.describe('Verify Explore Data Page', () => {
  const validCaseId = testData.searchInput.caseId;
  test('Verify the Explore Data Page elements is accessible and functional', async ({
    page,
    loginPage,
    exploreDataPage,
  }) => {
    // Step 1: Login
    await loginPage.goto(url);
    await loginPage.login(username, password);

    // Step 2: Navigate to Explore Data page
    await exploreDataPage.goto();
    await exploreDataPage.toBeVisible();

    // Step 3: Verify filter options are displayed
    await exploreDataPage.verifyFilterOptionsDisplayed();

    // Step 4: Apply and verify Demographics filters
    await exploreDataPage.clickOnFilters(filters.demographics);
    await exploreDataPage.verifyDemographics(sexAtBirth, minAge, race, ethnicity);
    await exploreDataPage.resetFilters();

    // Step 5: Verify Clinical Information fields
    await exploreDataPage.clickOnFilters(filters.clinicalInformation);
    await exploreDataPage.verifyClinicalInformationFields();
    await exploreDataPage.resetFilters();

    // Step 6: Enter and verify Case ID
    await exploreDataPage.enterCaseId(validCaseId);
    await exploreDataPage.resetFilters();

    // Step 7: Enter and verify Site ID
    await exploreDataPage.enterSiteId(siteId);
    await exploreDataPage.resetFilters();

    // Step 8: Create and verify dataset
    const dynamicDatasetName = `test-dataset-${Date.now()}`;
    await exploreDataPage.clickDataSetAndverify(dynamicDatasetName);
  });
});