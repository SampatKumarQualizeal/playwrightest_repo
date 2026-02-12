import { test, expect } from '@utils/pageFixture.js';
import testData from '@data/Staging/alznetapplication/smoke/ALZ-T141.json' with { type: 'json' };
import { ENV } from '@/config/env.js';
import { CommonUtils } from '@/utils/common-utils.js';
import * as path from 'path';

test.describe('Case List Export - ALZ-T141', () => {
  test.slow();

  test('Filter and Export Case List', async ({ page, loginPage, homePage, caseListPage }) => {
    // Login
    await loginPage.goto(ENV.APP_URL);
    await loginPage.login(testData.username, testData.password);

    // Access site and open Case List
    await homePage.clickAccessMySiteAndVerify(testData.siteName);
    let registrationFormPage = await homePage.accessSavedDraftRegistrationForm(testData.siteName);
    await caseListPage.openCaseList();

    // Apply filter
    // await caseListPage.filterAltIcon.click();
    // await caseListPage.filterTextbox.fill(testData.filterValue);
    // await caseListPage.applyFilterButton.click();

    // Verify at least one row matches the filter
    // const filteredRow = page.locator(`tr:has-text("${testData.filterValue}")`).first();
    // await expect(filteredRow).toBeVisible({ timeout: 10000 });

    // Click Export and wait for download (using testData selector)
    const exportBtn = page.getByRole('button', { name: new RegExp(testData.exportButtonSelector, 'i') }).first();
    await expect(exportBtn).toBeVisible({ timeout: testData.downloadTimeout });

    const downloadsDir = path.join(process.cwd(), 'test-results', 'downloads');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      exportBtn.click(),
    ]);

    // Save downloaded file
    const filePath = await CommonUtils.saveDownloadedFile(download, downloadsDir, testData.defaultExportFilename);

    // Extract headers from exported file
    const headers = await CommonUtils.extractFileHeaders(filePath);

    // Convert testData header patterns to RegExp objects
    const headerPatterns: any = {};
    for (const [key, pattern] of Object.entries(testData.requiredHeaders)) {
      headerPatterns[key] = new RegExp(pattern as string, 'i');
    }

    // Validate required headers
    const validation = CommonUtils.validateExportHeaders(headers, headerPatterns);

    if (!validation.isValid) {
      throw new Error(`Exported file missing required columns: ${validation.missing.join(', ')}`);
    }
  });
});
