import { Page, expect, Locator, test } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ChangeRequestListPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
    get changeRequestLink(): Locator {
        return this.page.getByText('Change Request List', { exact: true });
    }
    get caseIdFilterAltIcon(): Locator {
        return this.page.getByText('filter_alt').nth(1);
    }
    get filterAltIcon(): Locator {
        return this.page.getByText('filter_alt').first();
    }

    get filterTextbox(): Locator {
        return this.page.locator("//input[contains(@class,'filter-textbox')]");
    }

    get applyFilterButton(): Locator {
        return this.page.getByRole('button', { name: 'Apply' });
    }


    async verifyChangeRequest(caseId: string) {
        await this.changeRequestLink.click();
        await this.page.waitForLoadState('networkidle');
        await this.caseIdFilterAltIcon.click();
        await this.filterTextbox.click();
        await this.filterTextbox.type(caseId);
        await this.applyFilterButton.click();

        const caseRowLocator = this.page.locator(`tr:has-text("${caseId}")`).first();
        await expect(caseRowLocator).toBeVisible();

        const requestId = await caseRowLocator.locator('td').nth(0).innerText();
        const status = await caseRowLocator.locator('td').nth(4).innerText();
        expect(status).toBe('Submitted');
        console.log(`Change Request with ID: ${requestId} is in status: ${status}`);
    }


}