import { test, expect } from '@utils/pageFixture.js'; // Import Page type
import { Page } from '@playwright/test';
import { ENV } from '@/config/env.js';
import { ExploreDataPage } from '@pages/explore-data.page.js';
import { LoginPage } from '@pages/login.page.js';
import filterTestData from '@data/Staging/alznetdashboard/e2e/apply-race-filters-data.json' with { type: 'json' };

test.describe('Parameterized Filter Tests', () => {
    const username = ENV.DASHBOARD_USERNAME;
    const password = ENV.DASHBOARD_PASSWORD;
    const url = ENV.BASE_URL;

    let loggedInPage: Page; // This will hold the page instance after login
    let loginPage: LoginPage;
    let exploreDataPage: ExploreDataPage;

    // Login once before all tests in this describe block
    test.beforeAll(async ({ browser }) => {
        loggedInPage = await browser.newPage(); // Create a new page instance
        loginPage = new LoginPage(loggedInPage);
        exploreDataPage = new ExploreDataPage(loggedInPage); // Initialize with the logged-in page

        await loginPage.goto(url);
        await loginPage.login(username, password);
    });

    // Use this logged-in page for all tests within this describe block
    test.use({
        page: async ({}, use) => {
            await use(loggedInPage); // Provide the logged-in page instance
        }
    });

    test.beforeEach(async () => {
        // For each test, navigate to the Explore Data page to clear filters
        // The page object instances are already tied to loggedInPage from beforeAll
        await exploreDataPage.goto();
        await exploreDataPage.waitForLoad();
    });

    // Loop through each test case from the JSON file.
    for (const testData of filterTestData) {
        if (testData.category === "Demographics") {
            test(`should correctly apply all filter variations for ${testData.category}`, async () => {
                const { category, filterName, anyOption, multipleOptions, allOptions } = testData;

                // --- Scenario 1: Select a single option ---
                await test.step(`Select one option from ${filterName}`, async () => {
                    await exploreDataPage.clickOnFilters(category);
                    await exploreDataPage.selectAnyOneRace(filterName, anyOption);
                    await exploreDataPage.clickSearch();
                    await exploreDataPage.waitForResults();
                    
                    // Verify that the results match the selected option
                    await exploreDataPage.resetFilters(); // reset filters after each scenario
                });

                // --- Scenario 2: Select multiple options ---
                await test.step(`Select multiple options from ${filterName}`, async () => {
                    await exploreDataPage.selectMultiple(filterName, multipleOptions);
                    await exploreDataPage.clickSearch();
                    await exploreDataPage.waitForResults();

                    // Verify that the results match the selected options
                  
                    await exploreDataPage.resetFilters(); // Reset filters after each scenario
                });

                // --- Scenario 3: Select all options ---
                await test.step(`Select all options from ${filterName}`, async () => {
                    await exploreDataPage.selectAll(filterName);
                    await exploreDataPage.clickSearch();
                    await exploreDataPage.waitForResults();

                    // Verify that the results include all options
    
                    await exploreDataPage.resetFilters(); // Reset filters after each scenario
                });
            });
        } 
    }
});