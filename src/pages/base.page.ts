import { expect, Page, test } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async waitForPageLoad(timeout = 30000): Promise<void> {
    await this.page.waitForFunction(() => document.readyState === 'complete', { timeout });
  }
  async verifyStatus(expectedStatus: string) {
    await test.step('Verify Status', async () => {
      await this.page.waitForLoadState('domcontentloaded');
      const statusLocator = this.page.getByText(`Status: ${expectedStatus}`);
      await statusLocator.scrollIntoViewIfNeeded();
      await statusLocator.waitFor({ state: 'visible', timeout: 5000 });
      const rawStatus = await statusLocator.textContent();
      const actualStatus = rawStatus?.replace("Status:", "").trim();
      if (actualStatus !== expectedStatus) {
        throw new Error(`Expected status to be ${expectedStatus}, but got ${actualStatus}`);
      }
    });

  }
  async verifySiteID(expectedSiteID: string) {
    await test.step(`Verify Site ID: ${expectedSiteID}`, async () => {
      // Case 1: Expected is "Not Applicable"
      if (expectedSiteID === 'Not Applicable') {
        const notApplicableLocator = this.page.getByText('Not Applicable', { exact: true });
        await expect(notApplicableLocator).toBeVisible({ timeout: 5000 });
        return;
      }

      // If not "Not Applicable", then we expect a dynamic numeric ID.
      // Locate the element that contains the dynamic ID.
      // Assuming the ID is displayed in an element that contains "ID: "
      const idTextLocator = this.page.locator('text=/.*ID: \\d+/'); // Finds text like "ID: 12345"

      await idTextLocator.waitFor({ state: 'visible', timeout: 5000 });
      const fullText = (await idTextLocator.textContent())?.trim() ?? '';

      // Extract the numeric part from the full text
      const match = fullText.match(/\d+/);
      const actualNumericID = match ? match[0] : '';

      // Now compare with the expected numeric ID
      if (actualNumericID === '') {
        throw new Error(`Could not extract numeric Site ID from text: "${fullText}"`);
      }

      // If expectedSiteID is provided and is numeric, compare it.
      // If expectedSiteID is not provided (or is a placeholder like "any_numeric"),
      // then just assert that actualNumericID is indeed numeric.
      if (expectedSiteID && expectedSiteID !== 'any_numeric') { // Added 'any_numeric' as a special case
        if (actualNumericID !== expectedSiteID) {
          throw new Error(
            `Expected Site ID to be ${expectedSiteID}, but got ${actualNumericID}`
          );
        }
      } else {
        // If expectedSiteID is 'any_numeric' or not provided, just verify it's numeric.
        if (!/^\d+$/.test(actualNumericID)) {
          throw new Error(`Expected a numeric Site ID, but got "${actualNumericID}"`);
        }
      }
    });
  }
  async isFormDisplayed(text: string): Promise<void> {
    await test.step('Verify Site Feasibility & Registration Form is displayed', async () => {
      await this.page.waitForLoadState('domcontentloaded');
      await this.waitForPageLoad(30000);
      const siteRegisterButton = this.page.getByText(text, { exact: true });
      await siteRegisterButton.waitFor({ state: 'visible', timeout: 30000 });
      expect(siteRegisterButton).toBeVisible();
    });


  }
  async verifyDraftText(expectedText: string) {
    await test.step('Verify Draft Text message', async () => {
      const draftTextLocator = this.page.locator("//div[contains(@class,'material-icons warning-yellow')]/parent::div");
      await draftTextLocator.waitFor({ state: 'visible', timeout: 5000 });
      const actualText = await draftTextLocator.textContent();
      if (!actualText?.includes(expectedText)) {
        throw new Error(`Expected text to be ${expectedText}, but got ${actualText}`);
      }
    });
  }

  async logout(): Promise<void> {
    await test.step('Logout from Application', async () => {
      const expandMore = this.page.locator("//*[contains(text(),'expand_more')]").nth(0);
      await expandMore.waitFor({ state: 'visible', timeout: 10000 });
      await expandMore.click();
      const logoutButton = this.page.locator("//button[contains(text(),'Log Out')]");
      await logoutButton.waitFor({ state: 'visible', timeout: 10000 });
      await logoutButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.close();
    });

  }
  async selectYesNoForQuestion(questionText: string, option: 'Yes' | 'No') {
    await this.page.locator(`:text("${questionText}")`).locator('xpath=..').getByRole('radio', { name: option, exact: true }).check();
  }

  async clearFormButton() {

    await this.page.getByText('clear').waitFor({ state: 'visible', timeout: 5000 });
    await this.page.getByText('clear').click();
    await this.page.waitForLoadState('domcontentloaded');
  }


}