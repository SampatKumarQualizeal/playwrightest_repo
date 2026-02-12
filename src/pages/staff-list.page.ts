import { Page, test, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';

export class StaffListPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Getter methods for locators
    private get staffListLink(): Locator {
        return this.page.getByText('Staff List');
    }

    private get addStaffButton(): Locator {
        return this.page.getByRole('button', { name: '+ Add Staff' });
    }

    private get backToStaffListLink(): Locator {
        return this.page.getByRole('link', { name: 'arrow_back Back to Staff List' });
    }

    private get submitButton(): Locator {
        return this.page.getByRole('button', { name: 'Submit' });
    }

    private get alertParagraph(): Locator {
        return this.page.getByRole('paragraph');
    }
    get npiTextbox(): Locator {
        return this.page.getByRole('textbox').nth(5);
    }

    private get saveWarningDialog(): Locator {
        return this.page.locator('app-dialog-box');
    }

    private get firstNameTextbox(): Locator {
        return this.page.getByRole('textbox').nth(2);
    }

    private get lastNameTextbox(): Locator {
        return this.page.getByRole('textbox').nth(3);
    }

    private get emailTextbox(): Locator {
        return this.page.getByRole('textbox').nth(4);
    }

    private get firstRadioOption(): Locator {
        return this.page.locator('.mdc-radio').first();
    }

    private get radioYes(): Locator {
        return this.page.getByRole('radio', { name: 'Yes' });
    }

    private get radioNo(): Locator {
        return this.page.getByRole('radio', { name: 'No' });
    }

    private get saveButton(): Locator {
        return this.page.getByRole('button', { name: 'Save' });
    }

    private get filterAltIcon(): Locator {
        return this.page.getByText('filter_alt').first();
    }

    private get filterTextbox(): Locator {
        return this.page.getByRole('textbox', { name: 'Filter...' });
    }

    private get applyFilterButton(): Locator {
        return this.page.getByRole('button', { name: 'Apply' });
    }

    private get moreHorizIcon(): Locator {
        return this.page.getByText('more_horiz');
    }

    private get editViewMenuItem(): Locator {
        return this.page.getByRole('menuitem', { name: 'Edit/View' });
    }




    async openStaffList() {
        await test.step('Open Staff List', async () => {
            await this.staffListLink.click();
        });
    }

    async openAddStaffForm() {
        await test.step('Open Add Staff Form', async () => {
            await this.addStaffButton.click();
        });
    }

    async goBackToStaffList() {
        await test.step('Go Back to Staff List', async () => {
            await this.backToStaffListLink.click();
        });
    }

    async verifyRequiredFieldsAlert() {
        await test.step('Verify Required Fields Alert', async () => {
            await this.submitButton.click();
            await expect(this.alertParagraph).toContainText(
                'ALERT: The fields below marked with red asterisks are required'
            );
        });
    }

    async verifySaveWarningDialog() {
        await test.step('Verify Save Warning Dialog', async () => {
            await expect(this.saveWarningDialog).toContainText(
                'Your staff registration form has been saved but was not submitted.'
            );
        });
    }

    async verifySubmissionSuccess() {
        await test.step('Verify Submission Success', async () => {
            await expect(this.alertParagraph).toContainText(
                'Thank you for your submission. The individual you registered will receive an email notification shortly'
            );
        });
    }
    async clearForm() {
        await test.step('Clear Form', async () => {
            await this.clearFormButton();
        });
    }

    async fillStaffDetails(firstName: string, lastName: string, email: string) {
        await test.step(`Fill Staff Details: ${firstName} ${lastName}, ${email}`, async () => {
            await this.firstNameTextbox.click();
            await this.firstNameTextbox.type(firstName, { delay: 100 });
            await this.lastNameTextbox.click();
            await this.lastNameTextbox.type(lastName, { delay: 100 });
            await this.emailTextbox.click();
            await this.emailTextbox.type(email, { delay: 100 });
            await this.page.locator('.mdc-radio').first().click();
        });
    }

    async selectInterpretingPhysicianRadioOptions(option: 'Yes' | 'No') {
        await test.step(`Select Radio Option: ${option}`, async () => {
            if (option === 'Yes') {
                await this.radioYes.check();
                // TODO: Add logic to fill remaining fields if 'Yes' is selected
            } else if (option === 'No') {
                await this.radioNo.check();
            } else {
                throw new Error(`Invalid option for radio buttons: ${option}. Expected 'Yes' or 'No'.`);
            }
        });
    }

    async saveForm() {
        await test.step('Save Form', async () => {
            await this.saveButton.scrollIntoViewIfNeeded();
            await this.saveButton.click();
        });
    }

    async submitForm() {
        await test.step('Submit Form', async () => {
            await this.submitButton.click();
        });
    }
    async filterStaff(name: string) {
        await test.step(`Filter Staff by name: ${name}`, async () => {
            await this.filterAltIcon.scrollIntoViewIfNeeded();
            await this.filterAltIcon.click();
            await this.filterTextbox.fill(name);
            await this.applyFilterButton.click();
        });
    }

    async openStaffActions() {
        await test.step('Open Staff Actions', async () => {
            await this.moreHorizIcon.click();
        });
    }

    async editStaff() {
        await test.step('Edit Staff', async () => {
            await this.editViewMenuItem.click();
        });
    }
    async submitSiteListFormWithOutRequiredFileds() {
        await this.submitButton.click();
        await expect(this.alertParagraph).toContainText('ALERT: The fields below marked with red asterisks are required to complete your submission. Please complete these fields before submitting. If you are not ready to submit your form, you can save the form and return to it later.');
        this.clearForm();
    }
    async verifyEmptyFormSubmitWarning() {
        await test.step('Verify Empty Form Submit Warning', async () => {
            await this.submitButton.waitFor({ state: 'visible', timeout: 5000 });
            await this.submitButton.click();
            await expect(this.alertParagraph).toContainText('ALERT: The fields below marked with red asterisks are required to complete your submission. Please complete these fields before submitting. If you are not ready to submit your form, you can save the form and return to it later.');
        });
    }
    async selectPrimaryRole(role: string) {
        await test.step(`Select Primary Role: ${role}`, async () => {
            if (role === 'Site Investigator') {
                const roleRadioButton = this.page.getByRole('radio', { name: role, exact: true });
                await roleRadioButton.check();
                await this.selectYesNoForQuestion('Is this Site Investigator the Principal Investigator', 'No');
                await this.npiTextbox.fill('1234567890'); // Fill NPI number if Site Investigator is selected
                await this.page.getByText('Type of Provider:*').scrollIntoViewIfNeeded();
                await this.page.getByRole('radio', { name: 'Physician', exact: true }).check(); // Select 'Physician' for Type of Provider  
                await this.page.getByRole('checkbox', { name: 'American Board of Psychiatry' }).check(); // Check 'American Board of Psychiatry' checkbox;
                await this.page.getByText('Specialty Board Certifications:').scrollIntoViewIfNeeded();
                await this.selectYesNoForQuestion('Do you have fellowship training in dementia/behavioral neurology/cognitive neurology/geriatric neurology', 'No');
                await this.selectPortionOfYourTime('<25%');
                await this.selectClinicalExperienceDementiaCare('Less than 3 years');
                await this.selectYesNoForQuestion('Does the prescribing clinician have experience with treating and monitoring patients with novel FDA approved therapies for AD via clinical trials and/or clinical practice', 'No');
                await this.selectYesNoForQuestion('Is the prescribing clinician enrolled in the Medicare Patient Enrollment Chain and Ownership System (PECOS)?', 'No');

            }
            else {
                const roleRadioButton = this.page.getByRole('radio', { name: role, exact: true });
                await roleRadioButton.check();
            }
        });
    }
    async selectPortionOfYourTime(option: string) {
        await test.step(`Select Portion of Your Time: ${option}`, async () => {
            const questionContainer = this.page.locator('div').filter({ hasText: 'What proportion of your time' });
            await questionContainer.getByRole('radio', { name: option, exact: true }).check();
        });
    }


    async selectClinicalExperienceDementiaCare(option: string) {
        await test.step(`Select Clinical Experience in Dementia Care: ${option}`, async () => {
            const questionContainer = this.page.locator('div').filter({ hasText: 'Clinical experience in' });
            await questionContainer.getByRole('radio', { name: option, exact: true }).check();
        });
    }
    async uploadHumanProtectCertification() {
        await test.step('Upload Human Protection Certification', async () => {
            const uploadButton = this.page.getByRole('button', { name: 'Drop files or browse to upload' });
            await uploadButton.setInputFiles('test-data/documentstoUpload/Blank PDF.pdf');
        });
    }

    async selectUserRole(userRole: string) {
        await test.step(`Select User Role: ${userRole}`, async () => {
            const roleRadioButton = this.page.getByRole('radio', { name: userRole, exact: true });
            await roleRadioButton.check();
        });
    }
}