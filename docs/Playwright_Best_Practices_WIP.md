# Playwright + TypeScript Best Practices

## 1. Use Locator Assertions Instead of Generic Assertions

**What:** Use Playwright's built-in locator assertions instead of manual checks with generic assertions.

**Why:** Built-in auto-waiting, better error messages, more reliable tests.

**❌ Don't:**
```typescript
const isVisible = await page.locator('#button').isVisible();
expect(isVisible).toBe(true);
```

**✅ Do:**
```typescript
await expect(page.locator('#button')).toBeVisible();
await expect(page.locator('#button')).toHaveText('Submit');
await expect(page.locator('#button')).toBeEnabled();
```

**Common Assertions:**
- `toBeVisible()` / `toBeHidden()`
- `toHaveText()` / `toContainText()`
- `toBeEnabled()` / `toBeDisabled()`
- `toHaveAttribute()` / `toHaveClass()`
- `toHaveCount()`

---

## 2. Handle Hydrated Frontends with toPass()

**What:** Use `toPass()` for assertions that need to wait for frontend hydration or async state changes.

**Why:** Prevents flaky tests when dealing with React/Vue/Angular apps that hydrate after initial render.

**❌ Don't:**
```typescript
// May fail during hydration
await expect(page.locator('[data-testid="user-name"]')).toHaveText('John Doe');
```

**✅ Do:**
```typescript
// Basic usage
await expect(async () => {
  await expect(page.locator('[data-testid="user-name"]')).toHaveText('John Doe');
}).toPass();

// With custom timeout and intervals
await expect(async () => {
  await expect(page.locator('[data-testid="user-name"]')).toHaveText('John Doe');
}).toPass({
  timeout: 10000,  // Wait up to 10 seconds
  intervals: [500, 1000, 2000]  // Check at 500ms, then 1s, then 2s intervals
});
```

**Notes:** Default timeout is 5s. Use custom intervals for slow-loading content or API responses.

---

## 3. Test Script Stability with Repeat Runs

**What:** Use `--repeat-each` flag to verify test stability and catch flaky tests early.

**Why:** Identifies timing issues, race conditions, and intermittent failures before they reach CI/CD.

**❌ Don't:**
```bash
# Single run - may miss flaky behavior
npx playwright test
```

**✅ Do:**
```bash
# Run each test 5 times to catch flaky tests
npx playwright test --repeat-each=5

# For specific test file
npx playwright test login.spec.ts --repeat-each=5
```

**Notes:** Use during development and before merging. Start with 3-5 repeats, increase for critical tests.

---

## 4. Manage Test Timeouts with test.setTimeout()

**What:** Use `test.setTimeout()` to extend timeout for specific slow tests instead of global config changes.

**Why:** Prevents test failures for legitimate slow operations while keeping fast feedback for other tests.

**❌ Don't:**
```typescript
// Changing global timeout affects all tests
// playwright.config.ts: timeout: 60000
```

**✅ Do:**
```typescript
test('file upload with processing', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds for this test only
  
  await page.goto('/upload');
  await page.setInputFiles('input[type="file"]', 'large-file.pdf');
  await expect(page.locator('.upload-success')).toBeVisible();
});
```

**Notes:** Use for file uploads, data processing, or complex workflows. Keep most tests under 30s.

---

## 5. Mark Slow Tests with test.slow()

**What:** Use `test.slow()` to triple the timeout for inherently slow tests without hard-coding values.

**Why:** Automatically adjusts timeout based on current config, better than fixed setTimeout values.

**❌ Don't:**
```typescript
test('data export', async ({ page }) => {
  test.setTimeout(180000); // Fixed 3 minutes
});
```

**✅ Do:**
```typescript
test('data export', async ({ page }) => {
  test.slow(); // Triples current timeout automatically
  
  await page.click('[data-testid="export-button"]');
  await expect(page.locator('.download-ready')).toBeVisible();
});
```

**Notes:** Better than setTimeout for tests that are slow by nature (exports, reports, bulk operations).

---

## 6. NullPointer Exception handle

## Safe String Splitting with Optional Chaining

**What:** Safely extract a value from a string using .split() without risking runtime errors when the source value is null or undefined.


**Why:** Avoids TypeError caused by calling methods on null or undefined, improves code robustness, and ensures fallback behavior is clearly defined.

❌ Don't:
```typescript
const LastPage = paginationValue.split(" ")[2];
```


This will throw an error if paginationValue is null or undefined.

✅ Do:
```typescript
const LastPage = paginationValue?.split(" ")[2] ?? "";
```

Notes:
This safely checks if paginationValue exists before splitting, and provides a fallback if the result is undefined.
- Use ?? instead of || to avoid false positives with empty strings or zero.
- For stricter validation, check array length:
const parts = paginationValue?.split(" ") ?? [];
const LastPage = parts.length >= 3 ? parts[2] : "PageNotFound";
- This pattern is especially useful in Playwright when extracting text from locators that may not always be present.

---

## 7. Use Methods for Dynamic Locators Instead of Hardcoding or Inline Locators

**What:** When you need a locator that depends on a parameter (e.g., a username or label), define a method that returns a Locator instead of hardcoding or using inline locators in your test or page object methods.

**Why:**
- Improves code readability and maintainability.
- Encourages reuse and reduces duplication.
- Makes it easier to update locator logic in one place.

**❌ Don't:**
```typescript
// Directly in your test or page object method
await this.page.locator(`//*[contains(text(), "${name}")]`).click();
```

**✅ Do:**
```typescript
// In your page object (CustomerLogin_Public.ts)
getSignOutSpan(name: string): Locator {
  return this.page.locator(`//span[contains(text(), "${name}")]`);
}

// Usage in your method (e.g., signOutMember)
async signOutMember(name: string) {
  await test.step('Sign Out', async () => {
    await this.getSignOutSpan(name).click();
    await this.signOutButton.click();
    await expect(this.signInButton).toBeVisible();
  });
}
```

**Example Reference:**
- **Test Script:** `ASTMlogoRedirectToHomePage_INT-4615.spec.ts`
- **Page Object:** `CustomerLogin_Public.ts`
- **Method:** `signOutMember` (also see `verifyBallotsPageNavigation` for similar usage)

**Notes:**
- Use a method (not a getter) for any locator that requires a parameter.
- This pattern keeps your page objects clean and your tests easy to read and maintain.

### Best Practice: Screenshots

- Do not call `page.screenshot()` directly.
- Always use `BasePage.takeScreenshot()` for consistency.
- Ensure screenshots are:
  - Named with the JIRA ID when available
  - Stored under `test-results/Screenshots`
  - Attached to the test report

**Bad:**
```ts
await page.screenshot({ path: 'random.png' });
```
**Good**
```ts
await this.takeScreenshot();
```

---

## 8. DIRL-DirLFlowPage Integration & Synchronization Patterns

**What:** When integrating DIRL end-to-end flows (e.g., with DirLFlowPage), always use explicit synchronization patterns that distinguish between navigation and UI actions. Structure all major workflow steps using `test.step` for clarity and traceability.

**Best Practices:**
- **Navigation Actions:**
  - Always wait for `networkidle` after navigation (e.g., after `page.goto` or menu navigation).
  - Additionally, wait for a key UI element unique to the destination page to ensure readiness.
  - **Example:**
    ```typescript
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    await page.locator('text=Dashboard').waitFor({ state: 'visible' });
    ```
- **UI Interactions:**
  - Use locator-based waits before interacting (e.g., `locator.waitFor({ state: 'visible' })`).
  - Avoid page-level waits for UI element readiness.
  - **Example:**
    ```typescript
    await page.locator('button:has-text("Log In")').waitFor({ state: 'visible' });
    await page.locator('button:has-text("Log In")').click();
    ```
- **API-driven Actions:**
  - For actions that trigger backend/API processing (e.g., submit, save), use `waitForResponse` for the relevant API call, then confirm via UI state.
  - **Example:**
    ```typescript
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/submit') && resp.status() === 200),
      page.locator('button:has-text("Submit")').click()
    ]);
    await page.locator('text=Submission Successful').waitFor({ state: 'visible' });
    ```
- **Dynamic/Lazy UI:**
  - For dynamic content, use `locator.waitFor()` and `scrollIntoViewIfNeeded()` as needed.

**Step Labelling:**
- Use `test.step('Descriptive Step Name', async () => { ... })` for each major workflow action in end-to-end DIRL flows.
- This improves test logs, reporting, and debugging.
- **Example:**
  ```typescript
  await test.step('Authorize Corporate ID', async () => {
    await page.locator('input[name="corporateId"]').fill('123456');
    await page.locator('button:has-text("Authorize")').click();
    await page.locator('text=DIR Link is activated').waitFor({ state: 'visible' });
  });
  ```

**Summary:**
- Always distinguish navigation waits (networkidle + UI element) from UI waits (locator-based).
- Never use `waitForLoadState('domcontentloaded')` or `waitForTimeout()`.
- Label all major steps with `test.step` for maintainability and diagnostics in DIRL end-to-end automation.
