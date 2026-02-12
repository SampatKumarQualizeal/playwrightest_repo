import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://alznetapp-uat.acr.org/login');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('rajendraaprasad1304@gmail.com');
  await page.getByRole('textbox', { name: 'Email Address' }).click({
    modifiers: ['ControlOrMeta']
  });
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Hyderabad123!');
  await page.getByRole('textbox', { name: 'Password' }).click({
    modifiers: ['ControlOrMeta']
  });
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.goto('https://alznetapp-uat.acr.org/landing');
  await page.getByRole('button', { name: 'ACCESS MY SITE' }).click();
  await page.getByRole('button', { name: '-Select-' }).click();
  await page.getByRole('button', { name: 'Test Site' }).click();
  await page.getByRole('button', { name: 'GO' }).click();
  await page.getByText('Case List').click();
  await page.getByText('filter_alt').nth(1).click();
  await page.getByRole('textbox', { name: 'Filter...' }).click();
  await page.getByRole('textbox', { name: 'Filter...' }).fill('Roberta');
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByText('more_horiz').click();
  await page.getByRole('menuitem', { name: 'Change Request' }).click();
  await page.getByRole('button').nth(2).click();
  await page.getByRole('button', { name: 'Case Registration - Patient Consent & Eligibility' }).click();
  await page.locator('textarea').click();
  await page.locator('textarea').fill('Requesting for change');
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'Data Entry Error' }).click();
  await page.getByRole('button', { name: 'Drop files or browse to upload' }).click();
  await page.getByRole('button', { name: 'Drop files or browse to upload' }).setInputFiles('Blank PDF.pdf');
  await page.locator('span').filter({ hasText: 'arrow_back Back to Change' }).locator('span').click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByText('Case List', { exact: true }).click();
  await page.getByText('filter_alt').nth(1).click();
  await page.getByRole('textbox', { name: 'Filter...' }).click();
  await page.getByRole('textbox', { name: 'Filter...' }).fill('Roberta');
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByText('more_horiz').click();
  await page.getByRole('menuitem', { name: 'Change Request' }).click();
  await page.getByText('expand_more').nth(2).click();
  await page.getByRole('button', { name: 'Case Registration - Patient Information' }).click();
  await page.locator('textarea').click();
  await page.locator('textarea').fill('Request for change');
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'New Information' }).click();
  await page.getByRole('button', { name: 'Drop files or browse to upload' }).click();
  await page.getByRole('button', { name: 'Drop files or browse to upload' }).setInputFiles('Blank PDF.pdf');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.goto('https://alznetapp-uat.acr.org/dementia-index?selectedTab=changeRequestList');
  await expect(page.getByRole('paragraph')).toContainText('Thank you for submitting your data change request. The ALZ-NET Operations team will now review your request. You will receive an email updating your request’s status when the review is complete.');
  await page.getByText('clear').click();
  await page.getByText('Case List').click();
  await page.getByText('Change Request List').click();
  await page.getByText('DCR-').click();
});