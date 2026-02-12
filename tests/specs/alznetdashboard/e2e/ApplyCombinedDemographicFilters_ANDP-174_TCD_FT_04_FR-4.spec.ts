// Playwright test for TCD_FT_04_FR-4: Apply combined filters for Sex at Birth, Age Range, and Race
import { test, expect } from '@utils/pageFixture.js';
import testData from '@data/Staging/alznetdashboard/e2e/apply-combined-filters-sex-age-race-data.json' with { type: 'json' };
import { ENV } from '@/config/env.js';

// Test Data - Read from JSON and ENV
const sexAtBirth = testData.filters.sexAtBirth[0].value; // 'Male'
const minAge = testData.filters.ageRange[0].min; // 30
const race = testData.filters.race[0].value; // 'Black, African American, or African'
const username = ENV.DASHBOARD_USERNAME;
const password = ENV.DASHBOARD_PASSWORD;
const url = ENV.BASE_URL;

test.describe('TCD_FT_04_FR-4: Apply combined filters for Sex at Birth, Age Range, and Race', () => {
  test('should display data filtered by Male, age 30+, and Black/African American/African', async ({
    loginPage,
    exploreDataPage,
  }) => {
    // Step 1: Login
    await loginPage.goto(url);
    await loginPage.login(username, password);

    // Step 2: Navigate to Explore Data Page
    await exploreDataPage.goto();
    await exploreDataPage.toBeVisible();

    await exploreDataPage.clickOnFilters('Demographics');
    // Step 3: Apply Sex at Birth filter
    await exploreDataPage.applySexAtBirthFilter(sexAtBirth); // e.g., 'Male'

    // Step 4: Apply Age Range filter (e.g., 30 and above)
    await exploreDataPage.applyAgeRangeFilter(minAge); // e.g., 30

    // Step 5: Apply Race filter
    await exploreDataPage.applyRaceFilter(race); // e.g., 'Black, African American, or African'

    // Step 6: Click the search button to apply filters
    await exploreDataPage.clickSearch();

    // Step 7: Wait for filters to apply and results to load
    await exploreDataPage.waitForFiltersToApply();
    const results = await exploreDataPage.getFilteredDemographicResults();
    expect(results).toMatchObject({ race: race });
  });
});
