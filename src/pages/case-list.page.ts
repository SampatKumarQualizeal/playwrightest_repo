import { Page, expect, Locator, test } from '@playwright/test';
import { BasePage } from './base.page.js';

export class CaseListPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Getter methods for locators
    private get caseListLink(): Locator {
        return this.page.getByText('Case List');
    }

    private get addCaseButton(): Locator {
        return this.page.getByRole('button', { name: '+ ADD CASE' });
    }

    private get patientRegistrationContainer(): Locator {
        return this.page.locator('app-patient-registration');
    }

    private get mmTextbox(): Locator {
        return this.page.getByRole('textbox', { name: 'MM' });
    }

    private get ddTextbox(): Locator {
        return this.page.getByRole('textbox', { name: 'DD' });
    }

    private get yyyyTextbox(): Locator {
        return this.page.getByRole('textbox', { name: 'YYYY' });
    }

    private get dobContainer(): Locator {
        return this.page.locator('div').filter({ hasText: "Patient's Date of Birth" });
    }

    private get protocolVersioningExpandMoreIcon(): Locator {
        return this.page.locator('span').filter({ hasText: 'expand_more' }).nth(3);
    }

    private get protocolVersioningList(): Locator {
        return this.page.getByRole('list').nth(0); // Still generic, needs context if multiple lists
    }

    private get submitEligibilityButton(): Locator {
        return this.page.getByRole('button', { name: 'Submit' });
    }

    private get patientMeetsEligibilityText(): Locator {
        return this.page.getByText('The patient meets eligibility');
    }

    private get part2LoadedContainer(): Locator {
        return this.page.locator('app-patient-information');
    }

    private get patientInfoFirstNameTextbox(): Locator {
        return this.page.getByRole('textbox').first();
    }

    private get patientInfoMiddleNameTextbox(): Locator {
        return this.page.getByRole('textbox').nth(1);
    }

    private get patientInfoLastNameTextbox(): Locator {
        return this.page.getByRole('textbox').nth(2);
    }

    private get patientInfoYearDropdownButton(): Locator {
        return this.page.locator('div').filter({ hasText: "5. Patient's Year of Birth:*" }).getByRole('button').nth(1);
    }

    private yearSelectionButton(year: string): Locator { // Made dynamic
        return this.page.getByRole('button', { name: year });
    }

    private patientInfoSexAssignedAtBirthRadio(option: string): Locator {
        return this.page.locator('div').filter({ hasText: "Patient's sex assigned at birth" }).getByRole('radio', { name: option }).first();
    }

    // private patientInfoGenderIdentityRadio(option: string): Locator {
    //     const questionContainer = this.page.locator('div').filter({ hasText: "7. Patient’s self-reported identification of their gender:*" });
    //     return questionContainer.locator(`mat-radio-button`, { hasText: option, exact: true });
    // }
    private patientInfoGenderIdentityRadio(option: string): Locator {
        const questionContainer = this.page.locator('div').filter({ hasText: "7. Patient’s self-reported identification of their gender:*" });
        return questionContainer.locator(`mat-radio-button`, { hasText: option }).first().locator('input[type="radio"]');

    }

    private patientInfoRaceCheckbox(option: string): Locator {
        return this.page.locator('div').filter({ hasText: "8. Patient’s self-reported identification of their race" }).getByRole('checkbox', { name: option }).first();
    }

    private patientInfoCountryOfResidenceRadio(option: string): Locator {
        return this.page.locator('div').filter({ hasText: "9. Patient country of residence:*" }).getByRole('radio', { name: option }).first();
    }

    private get patientInfoPrimaryAddressTextbox(): Locator {
        return this.page.getByRole('textbox', { name: 'Primary Address:*' }).first();
    }

    private get patientInfoPrimaryPhoneNumberTextbox(): Locator {
        return this.page.getByRole('textbox', { name: 'XXX-XXX-XXXX' });
    }

    private get patientInfoPrimaryEmailAddressTextbox(): Locator {
        return this.page.locator('div:nth-child(12) > app-custom-input > .input-wrapper > .input-area > span > .input');
    }

    private patientInfoPrimaryInsuranceRadio(option: string): Locator {
        return this.page.locator('div').filter({ hasText: "14. Specify Primary Insurance/beneficiary Status:*" }).getByRole('radio', { name: option }).first();
    }

    private get saveCaseButton(): Locator {
        return this.page.getByRole('button', { name: 'Save' });
    }

    private get saveCaseSuccessMessage(): Locator {
        return this.page.getByText('This message is to notify you');
    }

    private get clearButton(): Locator {
        return this.page.getByText('clear');
    }

    get backToCaseListLink(): Locator {
        return this.page.getByText('arrow_back Back to Case List');
    }

    get filterAltIcon(): Locator {
        return this.page.getByText('filter_alt').first();
    }

    get filterTextbox(): Locator {
        return this.page.getByRole('textbox', { name: 'Filter...' });
    }

    get applyFilterButton(): Locator {
        return this.page.getByRole('button', { name: 'Apply' });
    }

    private get moreHorizIcon(): Locator {
        return this.page.getByText('more_horiz');
    }

    private get viewCaseDetailsMenuItem(): Locator {
        return this.page.getByRole('menuitem', { name: 'View Case Details' });
    }

    private get previousButton(): Locator {
        return this.page.getByRole('button', { name: 'Previous' });
    }

    private get patientLegallyAuthorizedText(): Locator {
        return this.page.getByText('PatientLegally Authorized');
    }

    private get nextButton(): Locator {
        return this.page.getByRole('button', { name: 'Next' });
    }

    private get submitFinalCaseButton(): Locator {
        return this.page.getByRole('button', { name: 'Submit' });
    }

    get primaryAddressStreetFirstOption(): Locator {
        return this.page.locator("//input[contains(@id,'site-street-input')]/parent::div/ul/li[1]");
    }
    get firstNameFilterAltIcon(): Locator {
        return this.page.getByText('filter_alt').nth(1);
    }
    get formDropdownButton(): Locator {
        return this.page.getByRole('button').nth(2);
    }
    formDropdownOption(formType: string): Locator {
        return this.page.getByRole('button', { name: formType });
    }
    get requestChangeReasonTextbox(): Locator {
        return this.page.locator('textarea');
    }
    get backToChangeRequestLink(): Locator {
        return this.page.getByText('arrow_back Back to Change Request');
    }
    get navigateChangeRequestAlert(): Locator {
        return this.page.getByText('Are you sure you want to');
    }
    navigateChangeRequestButton(YesOrCancel: string): Locator {
        return this.page.getByRole('button', { name: YesOrCancel });
    }


//Methods
    async openCaseList() {
        await this.caseListLink.click();
    }

    async startNewCase() {
        await this.addCaseButton.click();
        await expect(this.patientRegistrationContainer)
            .toContainText('Case Registration - Part 1');
    }

    // -----------------------------
    // Case Registration - Part 1
    // -----------------------------
    async selectStaffMember(name: string) {
        await this.page.getByRole('button').nth(3).click();
        await this.page.locator('button.dropdown-item').first().click();

    }

    async selectDateForConsentLAR(monthLabel: string, day: string, year: string) {
        await this.mmTextbox.click();
        await this.mmTextbox.fill(monthLabel);
        await this.mmTextbox.press('Tab');
        await this.ddTextbox.click();
        await this.ddTextbox.fill(day);
        await this.ddTextbox.press('Tab');
        await this.yyyyTextbox.click();
        await this.yyyyTextbox.fill(year);
    }

    async fillDOB(mm: string, dd: string, yyyy: string) {
        await this.dobContainer.getByPlaceholder('MM').click();
        await this.dobContainer.getByPlaceholder('MM').type(mm, { delay: 50 });
        await this.dobContainer.getByPlaceholder('MM').press('Tab');
        await this.dobContainer.getByPlaceholder('DD').click();
        await this.dobContainer.getByPlaceholder('DD').type(dd, { delay: 50 });
        await this.dobContainer.getByPlaceholder('DD').press('Tab');
        await this.dobContainer.getByPlaceholder('YYYY').click();
        await this.dobContainer.getByPlaceholder('YYYY').type(yyyy, { delay: 50 });
    }

    async selectDateOfProtocolVersioningTo() {
        await this.protocolVersioningExpandMoreIcon.click();
        await this.protocolVersioningList.click();
    }
    async selectInformedConsentProvidedByRadioOption(option: string) {
        const questionContainer = this.page.locator('div').filter({ hasText: 'Informed Consent Provided By' });
        await questionContainer.getByRole('radio', { name: option, exact: true }).check();
    }
    async selectLanguageConsentRadioOption(option: string) {
        const questionContainer = this.page.locator('div').filter({ hasText: 'Language was the consent' });
        await questionContainer.getByRole('radio', { name: option, exact: true }).check();
    }
    async selectHasConsentProvided(option: 'Yes' | 'No') {
        const questionContainer = this.page.locator('div').filter({ hasText: 'Has consent been provided for the patient' });
        await questionContainer.getByRole('radio', { name: option, exact: true }).click();
    }
    async selectPrimaryInsurance(option: string) {
        const questionContainer = this.page.locator('div').filter({ hasText: 'Specify Primary Insurance' });
        await questionContainer.getByRole('radio', { name: option, exact: true }).check();
    }
    async submitEligibility() {
        await this.submitEligibilityButton.click();
        await expect(this.patientMeetsEligibilityText).toBeVisible();
        const fullText = (await this.patientMeetsEligibilityText.textContent())?.trim() ?? '';

        const match = fullText.match(/P-\d+/);

        if (!match) {
            throw new Error(`Temporary Case ID not found in message: ${fullText}`);
        }

        return match[0];
    }

    // -----------------------------
    // Case Registration - Part 2
    // -----------------------------
    async verifyPart2Loaded() {
        await this.page.waitForLoadState('networkidle');
        await this.part2LoadedContainer.scrollIntoViewIfNeeded();
        await expect(this.part2LoadedContainer)
            .toContainText('Case Registration - Part 2');

    }
    async verifyTemporaryID(temporaryID: string) {
        const expectedText = `Temporary ID : ${temporaryID}`;
        const locator = this.page.getByText(expectedText, { exact: false });

        await locator.waitFor({ state: 'visible', timeout: 5000 });
    }
    async fillPatientInformation(firstName: string, middleName: string, lastName: string, month: string, day: string, year: string, Address: string, telephone: string, email: string, sexAssignedAtBirth: string, genderIdentity: string, race: string, countryOfResidence: string, primaryInsurance: string) {
        await this.patientInfoFirstNameTextbox.click();
        await this.patientInfoFirstNameTextbox.type(firstName, { delay: 100 });
        await this.patientInfoMiddleNameTextbox.click();
        await this.patientInfoMiddleNameTextbox.type(middleName, { delay: 100 });
        await this.patientInfoLastNameTextbox.click();
        await this.patientInfoLastNameTextbox.type(lastName, { delay: 100 });

        await this.fillDOB(month, day, year);

        await this.patientInfoYearDropdownButton.click();
        await this.yearSelectionButton(year).click();

        await this.patientInfoSexAssignedAtBirthRadio(sexAssignedAtBirth).check();
        //await this.patientInfoGenderIdentityRadio(genderIdentity).check();
        //await this.page.locator('#mat-radio-6 > .mdc-form-field > .mdc-radio > .mdc-radio__background > .mdc-radio__outer-circle').click();
        await this.page.locator('#mat-radio-6-input').check();
        await this.patientInfoRaceCheckbox(race).check();
        await this.patientInfoCountryOfResidenceRadio(countryOfResidence).check();

        await this.patientInfoPrimaryAddressTextbox.click();
        await this.patientInfoPrimaryAddressTextbox.type(Address, { delay: 50 });
        await this.patientInfoPrimaryAddressTextbox.press('Backspace');
        await this.primaryAddressStreetFirstOption.waitFor({ state: 'visible', timeout: 10000 }); // Ensure the option is visible
        await this.primaryAddressStreetFirstOption.dblclick();
        await this.page.waitForLoadState('networkidle'); // Wait for network to settle
        await this.page.waitForTimeout(2000); // Added a short fixed wait to allow UI to settle

        await this.patientInfoPrimaryPhoneNumberTextbox.waitFor({ state: 'visible', timeout: 20000 }); // Increased timeout
        await this.patientInfoPrimaryPhoneNumberTextbox.click();
        await this.patientInfoPrimaryPhoneNumberTextbox.type(telephone, { delay: 100 });
        await this.patientInfoPrimaryEmailAddressTextbox.click();
        await this.patientInfoPrimaryEmailAddressTextbox.type(email, { delay: 100 });

        await this.patientInfoPrimaryInsuranceRadio(primaryInsurance).check();
    }

    async saveCase() {
        await this.saveCaseButton.click();
        await expect(this.saveCaseSuccessMessage).toBeVisible();
        await this.clearButton.click();
    }

    // -----------------------------
    // Reopen Case
    // -----------------------------
    async reopenCase(caseId: string) {
        await this.backToCaseListLink.click();
        await this.filterAltIcon.click();
        await this.filterTextbox.fill(caseId);
        await this.applyFilterButton.click();

        const caseRowLocator = this.page.locator(`tr:has-text("${caseId}")`);
        await caseRowLocator.getByText('more_horiz').click();

        await this.viewCaseDetailsMenuItem.waitFor({ state: 'visible' });
        await this.viewCaseDetailsMenuItem.click();
    }

    // -----------------------------
    // Final Submission
    // -----------------------------
    async submitFinalCase() {
        await test.step('Submit Final Case', async () => {
            await this.submitFinalCaseButton.waitFor({ state: 'visible' })
            await this.submitFinalCaseButton.click();
            await this.page.getByText('Thank you for your submission').waitFor({ state: 'visible', timeout: 20000 });   

        });
    }

    async clearForm(): Promise<void> {
        await test.step('Clear Form', async () => {
            await this.clearButton.waitFor({ state: 'visible', timeout: 10000 });
            await this.clearButton.click();
        });
    }
    async applyFiletrsOnFirstNameAndClickChangeRequest(firstName: string): Promise<void> {
        await test.step('Apply Filters on First Name and Click Change Request', async () => {
            await this.firstNameFilterAltIcon.click();
            await this.filterTextbox.fill(firstName);
            await this.applyFilterButton.click();
            const caseRowLocator = this.page.locator(`tr:has-text("${firstName}")`);
            await caseRowLocator.getByText('more_horiz').click();
            await this.page.getByRole('menuitem', { name: 'Change Request' }).click();
            await this.page.waitForLoadState('networkidle');
        });
    }

    async fillChangeRequestDetails(formType: string, changeReason: string, selectReasonForChange: string): Promise<void> {
        await test.step('Fill Change Request Details', async () => {
            await this.page.waitForLoadState('domcontentloaded')
            await this.selectForm(formType);
            await this.enterRequestedChange(changeReason);
            await this.selectReasonForChange(selectReasonForChange);
            await this.uploadSupportingDocuments();
        }
        );
    }
    async selectForm(formType: string): Promise<void> {
        await test.step('Select Form', async () => {
            const formDropdown = this.page.locator("//div[contains(text(),'6. Form')]/following::app-custom-select/descendant::input").first();
            await formDropdown.scrollIntoViewIfNeeded();
            // await this.formDropdownButton.waitFor({ state: 'visible', timeout: 10000 });
            await formDropdown.click();
            await this.formDropdownOption(formType).click();
        });
    }
    async enterRequestedChange(reason: string): Promise<void> {
        await test.step('Enter Requested Change', async () => {
            const requestedChangeTextBox = this.page.locator('div', { hasText: 'Requested Change' }).locator('textarea');
            await requestedChangeTextBox.click();
            await requestedChangeTextBox.type(reason, { delay: 50 });
        });

    }

    async selectReasonForChange(option: string): Promise<void> {
        await test.step('Select Reason for Change', async () => {
            // await this.page.getByRole('button').nth(2).click();
            // await this.page.getByRole('button', { name: 'Data Entry Error' }).click();
            const reasonDropdown = this.page.locator('div.label', { hasText: 'Reason for Change' }).locator('xpath=following::input[@type="button"][1]');
            await reasonDropdown.click();
            const dataEntryErrorOption = this.page.getByRole('button', { name: option });
            await dataEntryErrorOption.click();
        });
    }
    async uploadSupportingDocuments() {
        await test.step('Upload Supporting Documents', async () => {
            const uploadButton = this.page.getByRole('button', { name: 'Drop files or browse to upload' });
            await uploadButton.setInputFiles('test-data/documentstoUpload/Blank PDF.pdf');
        });
    }
    async verifyFilledCaseDeatilsInChangeRequestForm(expectedEmail: string): Promise<string> {
        let actualCaseId: string = '';
        await test.step('Verify Filled Case Details in Change Request Form', async () => {
            const emailTextbox = this.page
                .locator("//label[contains(text(),'Email of Submitter')]/following::app-custom-input/descendant::input").first();

            const actualEmail = await emailTextbox.inputValue();
            expect(actualEmail).toBe(expectedEmail);

            const requestedDate = this.page
                .locator("//div[contains(text(),'Request Date')]/following::app-custom-input/descendant::input").first();
            const actualDate = await requestedDate.inputValue();
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const yyyy = today.getFullYear();
            const expectedDate = `${mm}/${dd}/${yyyy}`;
            expect(actualDate).toBe(expectedDate);

            const caseId = this.page
                .getByText('Case #')
                .locator('xpath=following::input[@type="text"][1]');
            actualCaseId = await caseId.inputValue();

        });
        return actualCaseId;
    }

    async validatebackToCaseListNavigation(expectedText: string, proceedBtn: string): Promise<void> {
        await test.step('Validate Back to Case List Navigation', async () => {
            await this.backToChangeRequestLink.click();
            const rawText = await this.navigateChangeRequestAlert.textContent();
            if (!rawText) {
                throw new Error('Alert text not found');
            }
            const actualText = rawText.replace(/\s+/g, ' ').trim();
            const expectedText = 'Are you sure you want to navigate from this form? Any changes made will be lost.';
            expect(actualText?.trim()).toBe(expectedText);
            await this.navigateChangeRequestButton(proceedBtn).click();
        });

    }
    async submitChangeRequestForm(): Promise<void> {
        await test.step('Submit Change Request Form', async () => {
            const submitButton = this.page.getByRole('button', { name: 'Submit' });
            await submitButton.click();
            //await this.page.locator('.lds-ring > div:nth-child(4)').waitFor({ state: 'detached', timeout: 10000 });
        });
    }
    async verifyChangeRequestSubmissionSuccessAndClose(): Promise<void> {
        await test.step('Verify Change Request Submission Success And Close popup', async () => {
            const successMessage = this.page.getByText('Thank you for submitting your data change request. The ALZ-NET Operations team will now review your request. You will receive an email updating your request’s status when the review is complete.');
            await expect(successMessage).toContainText('Thank you for submitting your data change request. The ALZ-NET Operations team will now review your request. You will receive an email updating your request’s status when the review is complete.');
            await this.clearForm();

        });
    }
}