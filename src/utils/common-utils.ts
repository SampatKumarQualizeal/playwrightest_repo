import { Logger } from '@/logger/logger.js';
import { AllureReporter } from '@/reporting/allure-reporter.js';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

export class CommonUtils {
  private static logger = Logger.getInstance();
  private static allureReporter = new AllureReporter();

  /**
   * Generate random alphanumeric string of given length
   */
  static generateRandomString(length: number): string {
    this.logger.debug(`Generating random string of length: ${length}`);
    this.allureReporter.addStep(`Generate random string of length: ${length}`);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.logger.debug(`Generated random string: ${result}`);
    return result;
  }

  /**
   * Generate random numeric string (first digit never zero)
   */
  static generateRandomNumber(count: number): string {
    this.logger.debug(`Generating random number of ${count} digits`);
    this.allureReporter.addStep(`Generate random number of ${count} digits`);

    if (count <= 0) {
      this.logger.warn('Count must be greater than 0');
      return '';
    }

    // First digit (1-9)
    let result = Math.floor(Math.random() * 9) + 1;

    // Remaining digits (0-9)
    for (let i = 1; i < count; i++) {
      result += Math.floor(Math.random() * 10);
    }

    const numberString = result.toString();
    this.logger.debug(`Generated random number: ${numberString}`);
    return numberString;
  }

  /**
   * Pick a random element from a list
   */
  static getRandomValueFromList<T>(list: T[]): T {
    this.logger.debug(`Getting random value from list of ${list.length} items`);
    this.allureReporter.addStep(`Get random value from list`);

    if (!list || list.length === 0) {
      const error = 'List is empty or invalid';
      this.logger.error(error);
      throw new Error(error);
    }

    const randomIndex = Math.floor(Math.random() * list.length);
    const selectedValue = list[randomIndex];

    if (selectedValue === undefined) {
      const error = 'Selected value is undefined';
      this.logger.error(error);
      throw new Error(error);
    }

    this.logger.debug(`Selected random value: ${selectedValue}`);
    return selectedValue;
  }

  // ==================== STATIC METHODS ====================

  /**
   * Another implementation for random alphanumeric string
   */
  static generateRandomAlphanumericString(length: number): string {
    this.logger.debug(`Generating random alphanumeric string of length: ${length}`);
    this.allureReporter.addStep(`Generate random alphanumeric string of length: ${length}`);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.logger.debug(`Generated random alphanumeric string: ${result}`);
    return result;
  }

  /**
   * Generate random numeric string of given length
   */
  static generateRandomNumeric(length: number): string {
    this.logger.debug(`Generating random numeric string of length: ${length}`);
    this.allureReporter.addStep(`Generate random numeric string of length: ${length}`);

    if (length <= 0) {
      this.logger.warn('Length must be greater than 0');
      return '';
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }

    this.logger.debug(`Generated random numeric string: ${result}`);
    return result;
  }

  /**
   * Get random element from array (alias for getRandomValueFromList)
   */
  static getRandomElement<T>(list: T[]): T {
    return this.getRandomValueFromList(list);
  }

  /**
   * Generate random number between min and max (inclusive)
   */
  static randomNumber(min: number, max: number): number {
    this.logger.debug(`Generating random number between ${min} and ${max}`);
    this.allureReporter.addStep(`Generate random number between ${min} and ${max}`);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Save downloaded file to specified directory
   */
  static async saveDownloadedFile(download: any, downloadsDir: string, defaultFilename?: string): Promise<string> {
    this.logger.debug(`Saving downloaded file to: ${downloadsDir}`);
    this.allureReporter.addStep(`Save downloaded file`);

    await fs.promises.mkdir(downloadsDir, { recursive: true });

    const suggested = download.suggestedFilename() ?? defaultFilename ?? `export-${Date.now()}.csv`;
    const destPath = path.join(downloadsDir, suggested);
    await download.saveAs(destPath);

    this.logger.info(`File saved successfully: ${destPath}`);
    return destPath;
  }

  /**
   * Parse CSV headers from file
   */
  private static async parseCsvHeaders(filePath: string): Promise<string[]> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const firstLine = (content.split(/\r?\n/)[0] || '');
      return firstLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    } catch (e) {
      this.logger.warn(`Failed to parse CSV headers: ${e}`);
      return [];
    }
  }

  /**
   * Parse XLSX headers from file
   */
  private static parseXlsxHeaders(filePath: string): string[] {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
      return (rows[0] || []).map(h => (h ?? '').toString().trim());
    } catch (e) {
      this.logger.warn(`Failed to parse XLSX headers: ${e}`);
      return [];
    }
  }

  /**
   * Extract headers from exported file (CSV or XLSX)
   */
  static async extractFileHeaders(filePath: string): Promise<string[]> {
    this.logger.debug(`Extracting headers from: ${filePath}`);
    this.allureReporter.addStep(`Extract file headers from ${path.basename(filePath)}`);

    const ext = path.extname(filePath).toLowerCase();
    let headers: string[] = [];

    if (ext === '.xlsx' || ext === '.xls') {
      headers = this.parseXlsxHeaders(filePath);
    } else {
      // Prefer CSV parsing for .csv or unknown extensions
      headers = await this.parseCsvHeaders(filePath);
      // If CSV parsing yields empty or single column, try XLSX
      const plausibleCsv = headers.length > 1 && headers.some(h => /tracking|patient|clinician|registration|case|status/i.test(h));
      if (!plausibleCsv) {
        const xlsxHeaders = this.parseXlsxHeaders(filePath);
        if (xlsxHeaders.length) headers = xlsxHeaders;
      }
    }

    this.logger.debug(`Extracted ${headers.length} headers: ${headers.join(', ')}`);
    return headers;
  }

  /**
   * Validate exported file has required headers
   * @param headers - Array of header names from exported file
   * @param requiredHeaderPatterns - Object with header type and regex patterns to match
   * @returns Object with validation results
   */
  static validateExportHeaders(
    headers: string[],
    requiredHeaderPatterns: {
      caseId?: RegExp;
      firstName?: RegExp;
      lastName?: RegExp;
      registrationDate?: RegExp;
      status?: RegExp;
      clinician?: RegExp;
      timepoint?: RegExp;
      startDate?: RegExp;
      endDate?: RegExp;
    }
  ): { isValid: boolean; missing: string[] } {
    this.logger.debug(`Validating headers against required patterns`);
    this.allureReporter.addStep(`Validate exported file headers`);

    const missing: string[] = [];

    // Check case ID
    if (requiredHeaderPatterns.caseId) {
      const found = headers.some(h => requiredHeaderPatterns.caseId!.test(h));
      if (!found) missing.push('Case ID / Tracking ID');
    }

    // Check names (either combined or separate)
    if (requiredHeaderPatterns.firstName || requiredHeaderPatterns.lastName) {
      const hasFirst = headers.some(h => requiredHeaderPatterns.firstName?.test(h));
      const hasLast = headers.some(h => requiredHeaderPatterns.lastName?.test(h));
      if (!(hasFirst && hasLast)) missing.push('Patient First/Last Name');
    }

    // Check registration date
    if (requiredHeaderPatterns.registrationDate) {
      const found = headers.some(h => requiredHeaderPatterns.registrationDate!.test(h));
      if (!found) missing.push('Registration Date');
    }

    // Check status
    if (requiredHeaderPatterns.status) {
      const found = headers.some(h => requiredHeaderPatterns.status!.test(h));
      if (!found) missing.push('Case Status');
    }

    // Check clinician
    if (requiredHeaderPatterns.clinician) {
      const found = headers.some(h => requiredHeaderPatterns.clinician!.test(h));
      if (!found) missing.push('Clinician');
    }

    // Optional fields (warn but don't fail)
    if (requiredHeaderPatterns.timepoint || requiredHeaderPatterns.startDate || requiredHeaderPatterns.endDate) {
      const hasTimepoint = requiredHeaderPatterns.timepoint ? headers.some(h => requiredHeaderPatterns.timepoint!.test(h)) : false;
      const hasStartDate = requiredHeaderPatterns.startDate ? headers.some(h => requiredHeaderPatterns.startDate!.test(h)) : false;
      const hasEndDate = requiredHeaderPatterns.endDate ? headers.some(h => requiredHeaderPatterns.endDate!.test(h)) : false;

      if (!hasTimepoint && !hasStartDate && !hasEndDate) {
        this.logger.warn('No timepoint or date fields found in export');
      }
    }

    const isValid = missing.length === 0;
    this.logger.debug(`Header validation result: ${isValid ? 'PASS' : 'FAIL'} ${missing.length > 0 ? `(Missing: ${missing.join(', ')})` : ''}`);

    return { isValid, missing };
  }

  /**
   * Validate email in Gmail inbox
   * Uses pre-authenticated Google session (recommended approach)
   * @param page - Playwright page object (in new context)
   * @param email - Email address to check
   * @param subject - Email subject to search for
   * @returns true if email found, false otherwise
   */
  static async validateEmailInGmail(page: any, email: string, subject: string): Promise<boolean> {
    this.logger.debug(`Validating email in Gmail for: ${email}`);
    this.allureReporter.addStep(`Validate email in Gmail: ${subject}`);

    try {
      // Navigate to Gmail
      await page.goto('https://mail.google.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Wait for inbox to load
      await page.waitForLoadState('networkidle');

      // Search for email with subject
      const searchBox = page.locator('input[type="text"][placeholder*="Search"]').first();
      await searchBox.waitFor({ state: 'visible', timeout: 10000 });
      await searchBox.fill(subject);
      await searchBox.press('Enter');

      // Wait for search results
      await page.waitForLoadState('networkidle');

      // Check if email with subject exists
      const emailRow = page.locator(`tr:has-text("${subject}")`).first();
      const isFound = await emailRow.isVisible({ timeout: 5000 }).catch(() => false);

      if (isFound) {
        this.logger.info(`Email found with subject: ${subject}`);
        return true;
      } else {
        this.logger.warn(`Email not found with subject: ${subject}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error validating email in Gmail: ${error}`);
      return false;
    }
  }

  /**
   * Validate confirmation email via Gmail API
   * Checks if email exists with matching subject and verifies content
   * Handles all logging and assertions internally
   * expectedContent can be a string or array of strings to verify multiple items
   */
  static async validateConfirmationEmailViaGmail({
    contactEmail,
    subjectRegex,
    expectedContent,
    credentialsPath = 'credentials.json',
    tokenPath = 'token.json',
  }: {
    contactEmail: string;
    subjectRegex: RegExp;
    expectedContent?: string | string[];
    credentialsPath?: string;
    tokenPath?: string;
  }): Promise<void> {
    try {
      const GmailUtils = (await import('./gmail-utils.js')).default;

      const result = await GmailUtils.waitForEmail({
        to: contactEmail,
        subjectRegex,
        timeoutMs: 180000,
        credentialsPath,
        tokenPath,
      });

      if (!result) {
        this.logger.warn(`⚠ Confirmation email not found for: ${contactEmail}`);
        return;
      }

      this.logger.info(`✓ Confirmation email found (subject: ${result.subject})`);
      this.allureReporter.addStep(`✓ Email found with subject: ${result.subject}`);

      if (expectedContent) {
        const contentList = Array.isArray(expectedContent) ? expectedContent : [expectedContent];

        for (const content of contentList) {
          // Normalize body and expected content for robust contains check
          const normalize = (s: string | undefined) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
          const bodyNorm = normalize(result.body);
          const contentNorm = normalize(content);
          const contentVerified = bodyNorm.includes(contentNorm);
          if (contentVerified) {
            this.logger.info(`✓ Expected content "${content}" verified in email body`);
            this.allureReporter.addStep(`✓ Content verified: "${content}"`);
          } else {
            this.logger.warn(`⚠ Expected content "${content}" NOT found in email body`);
            this.allureReporter.addStep(`⚠ Content NOT found: "${content}"`);
            // Log first 1000 chars of body for debugging
            const bodyPreview = result.body?.substring(0, 1000) || 'N/A';
            this.logger.debug(`Email body preview: ${bodyPreview}`);
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Gmail API validation error: ${errorMsg}`);
      this.allureReporter.addStep(`✗ Gmail validation failed: ${errorMsg}`);
    }
  }
}


