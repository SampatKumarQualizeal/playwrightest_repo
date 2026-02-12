import { test, expect } from '@utils/pageFixture.js';
import testDataArray from '../../../../test-data/Staging/alznetdashboard/e2e/search-using-single-valid-site-id-data.json' with { type: 'json' };
import { ENV } from '@/config/env.js';
const testData = testDataArray;
// NOTE: If an ExploreDataPage page object does not exist, it should be created in src/pages/explore-data.page.ts
// For this test, we will assume it exists and exposes the necessary methods.
// Test Data: Site IDs and user credentials
const url = ENV.BASE_URL;
const validSiteId = testData.searchCriteria.siteId || 'SITE12345'; // fallback if not present
const username = ENV.DASHBOARD_USERNAME;
const password = ENV.DASHBOARD_PASSWORD;

// Main test
test.describe('TCD_FT_02_FR-2: Search using a single valid Site ID', () => {
  test.beforeEach(async ({ page, loginPage, exploreDataPage }) => {
    // Login and navigate to Explore Data page
    await loginPage.goto(url);
    await loginPage.login(username, password);
    await exploreDataPage.goto();
  });

  test('should allow searching with a single valid Site ID and display correct results', async ({
    exploreDataPage,
  }) => {
    // Step 1: Enter the single valid Site ID in the search field
    await exploreDataPage.enterSiteId(validSiteId);

    // Step 2: Initiate the search
    await exploreDataPage.clickSearchButton();

    // Step 3: Wait for search results to load
    await exploreDataPage.waitForResults();

    // Step 4: Assert that results are displayed and correspond to the Site ID
    const results = await exploreDataPage.getSearchResults();
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.siteId).toBe(validSiteId);
    }
  });
});
