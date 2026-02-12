import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://alznetapp-uat.acr.org/login');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('');
  await page.getByRole('textbox', { name: 'Password' }).click({
    modifiers: ['ControlOrMeta']
  });
  await page.getByRole('textbox', { name: 'Password' }).fill('Hyderabad123!');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.goto('https://alznetapp-uat.acr.org/landing');
  await page.getByRole('button', { name: 'ACCESS MY SITE' }).click();
  await page.getByRole('button', { name: '-Select-' }).click();
  await page.getByRole('button', { name: 'Test Site' }).click();
  await page.getByRole('button', { name: 'GO' }).click();
  await page.getByText('Staff List').click();
  await page.getByRole('button', { name: '+ Add Staff' }).click();
  await page.getByText('ALERT: The fields below').click();
  await expect(page.getByRole('paragraph')).toContainText('ALERT: The fields below marked with red asterisks are required to complete your submission. Please complete these fields before submitting. If you are not ready to submit your form, you can save the form and return to it later.');
  await page.getByText('clear').click();
  await page.locator('#txt_firstName').getByRole('textbox').click();

  await page.locator('#txt_firstName').getByRole('textbox').click();
  await page.locator('#txt_firstName').getByRole('textbox').fill('TestUser');
  await page.locator('#txt_lastName').getByRole('textbox').click();
  await page.locator('#txt_lastName').getByRole('textbox').fill('Site');
  await page.locator('#txt_email').getByRole('textbox').click();
  await page.locator('#txt_email').getByRole('textbox').fill('SU2025');
  await page.locator('#txt_email').getByRole('textbox').click();
  await page.locator('#txt_email').getByRole('textbox').fill('siteuseralznet@gmail.com');
  await page.getByRole('radio', { name: 'Site Administrator (' }).check();
  await page.getByRole('radio', { name: 'Site Investigator (' }).check();
  await page.locator('#mat-radio-41-input').check();
  await page.getByRole('textbox').nth(5).click();
  await page.locator('#mat-radio-42-input').check();
  await page.getByRole('checkbox', { name: 'American Board of Psychiatry' }).check();
  await page.locator('#mat-radio-47-input').check();
  await page.locator('#mat-radio-47-input').check();
  await page.locator('#mat-radio-48-input').check();
  await page.getByRole('textbox').nth(5).click();
  await page.getByRole('textbox').nth(5).fill('1234567890');
  await page.getByText('PhysicianNurse').click();
  await page.getByRole('radio', { name: 'Physician', exact: true }).check();
  await page.getByRole('radio', { name: 'Less than 3 years' }).check();
  await page.locator('#mat-radio-58-input').check();
  await page.locator('#mat-radio-35-input').check();
  await page.getByRole('button', { name: 'Drop files or browse to upload' }).click();
  await page.getByRole('button', { name: 'Drop files or browse to upload' }).setInputFiles('Blank PDF.pdf');
  await page.locator('#mat-radio-60-input').check();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('app-dialog-box')).toContainText('ALERT: Your staff registration form has been saved but was not submitted.');
  await page.getByText('clear').click();
 
});