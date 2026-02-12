import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://alznetapp-uat.acr.org/login');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('siteuseralznet@gmail.com');
  await page.getByRole('textbox', { name: 'Email Address' }).click({
    modifiers: ['ControlOrMeta']
  });
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('SU2025@dashboard');
  await page.getByRole('textbox', { name: 'Password' }).click({
    modifiers: ['ControlOrMeta']
  });
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.goto('https://alznetapp-uat.acr.org/landing');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'REGISTER MY SITE' }).click();
  const page1 = await page1Promise;
  await page1.locator('div').filter({ hasText: 'Thank you for your interest' }).nth(4).click();
});