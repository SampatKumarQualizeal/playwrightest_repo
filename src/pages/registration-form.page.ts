import { Page, test, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';
import { faker } from '@faker-js/faker';
import { ActionUtils } from '@/utils/action-utils.js';
import { Logger } from '@/logger/logger.js';

export class RegistrationFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  get siteName(): Locator {
    return this.page.getByRole('textbox').first();
  }
  natureOfSite(siteType: string): Locator {
    return this.page.getByText(`${siteType}`);
  }
  hospitalOfType(hospitalType: string): Locator {
    return this.page.getByText(`${hospitalType}`);
  }
  get principalInvestigatorName(): Locator {
    return this.page.getByRole('textbox').nth(1);
  }
  get principalInvestigatorEmail(): Locator {
    return this.page.getByRole('textbox').nth(2);
  }
  get primaryContactName(): Locator {
    return this.page.getByRole('textbox').nth(3);
  }
  get primaryContactEmail(): Locator {
    return this.page.getByRole('textbox').nth(4);
  }
  get physicalAddressStreet(): Locator {
    return this.page.getByRole('textbox', { name: 'Street:*' });
  }
  get mailingAddressStreet(): Locator {
    return this.page.locator('#site-ma-street-input');
  }
  get physicalAddressStreetFirstOption(): Locator {
    return this.page.locator("//input[contains(@id,'site-street-input')]/parent::div/ul/li[1]");
  }
  get mailingAddressStreetFirstOption(): Locator {
    return this.page.locator("//input[contains(@id,'site-ma-street-input')]/parent::div/ul/li[1]");
  }
  get physicalAddressZip(): Locator {
    return this.page.getByRole('textbox', { name: 'XXXXX' });
  }
  get physicalAddressTelephone(): Locator {
    return this.page.getByRole('textbox', { name: 'XXX-XXX-XXXX' }).first();
  }
  get mailingAddressTelephone(): Locator {
    return this.page.getByRole('textbox', { name: 'XXX-XXX-XXXX' }).nth(2);
  }
  get physicalAddressCity(): Locator {
    return this.page.locator('div:nth-child(4) > .ng-untouched.ng-pristine.ng-invalid > .input-wrapper > .input-area > span > .input').first();
  }
  get physicalAddressStateDropdown(): Locator {
    return this.page.locator('form').getByRole('button', { name: '-Select-' });
  }
  physicalAddressStateOption(state: string): Locator {
    return this.page.locator('form').getByRole('option', { name: state });
  }
  get physicalAddressFax(): Locator {
    return this.page.getByRole('textbox', { name: 'XXX-XXX-XXXX' }).nth(1);
  }
  siteMailAddressSameAsPhysicalAddress_YesBtn(siteType: string) {
    if (siteType === 'Site Facility') {
      return this.page.locator('#mat-radio-3-input');
    }
    else if (siteType === 'Imaging Facility') {
      return this.page.locator('#mat-radio-2-input');
    }
    throw new Error(`Invalid siteType: ${siteType}`);

  }
  siteMailAddressSameAsPhysicalAddress_NoBtn(siteType: string) {
    if (siteType === 'Site Facility') {
      return this.page.locator('#mat-radio-4-input');
    }
    else if (siteType === 'Imaging Facility') {
      return this.page.locator('#mat-radio-10-input');
    } else {
      throw new Error(`Invalid siteType: ${siteType}`);
    }
  }
  get patientPopulationEnrollment_AmericanIndian(): Locator {
    return this.page.getByRole('textbox', { name: '00' }).first();
  }
  get patientPopulationEnrollment_AsianAmerican(): Locator {
    return this.page.getByRole('textbox', { name: '00' }).nth(1);
  }
  get patientPopulationEnrollment_AfricanAmerican(): Locator {
    return this.page.getByRole('textbox', { name: '00' }).nth(2);
  }
  get patientPopulationEnrollment_Latin(): Locator {
    return this.page.getByRole('textbox', { name: '00' }).nth(3);
  }
  get patientPopulationEnrollment_NorthAfrican(): Locator {
    return this.page.getByRole('textbox', { name: '00' }).nth(4);
  }
  get patientPopulationEnrollment_Otherpacific(): Locator {
    return this.page.getByRole('textbox', { name: '00' }).nth(5);
  }
  get patientPopulationEnrollment_European(): Locator {
    return this.page.locator('div:nth-child(8) > .ng-untouched.ng-pristine.ng-invalid > .input-wrapper > .input-area > span > .input');
  }
  get inclusionExclusionCriteria(): Locator {
    return this.page.locator('.question-container > div:nth-child(2) > .ng-untouched.ng-pristine.ng-invalid > .input-wrapper > .input-area > span > .input');
  }
  get barriersToEnrollment_YesBtn(): Locator {
    return this.page.locator('#mat-radio-5-input');
  }
  get describeBarriersToEnrollment(): Locator {
    return this.page.getByRole('textbox', { name: 'If yes, please describe' });
  }
  get characteristics_OnlyThroughClinical(): Locator {
    return this.page.getByRole('radio', { name: 'Yes, only through clinical' });
  }
  get characteristics_MMSE(): Locator {
    return this.page.getByRole('checkbox', { name: 'MMSE (Mini-Mental State' });
  }
  get characteristics_OnsiteWithClinical(): Locator {
    return this.page.getByRole('radio', { name: 'Yes, on-site within clinic' });
  }
  get characteristics_siteutilizationPhysicianExtenders_yesBtn(): Locator {
    return this.page.locator('#mat-radio-14-input');
  }
  get characteristics_siteutilizationPhysicianExtenders_NoBtn(): Locator {
    return this.page.locator('#mat-radio-15-input');
  }
  get characteristics_shipAmbientSamples_yesBtn(): Locator {
    return this.page.locator('#mat-radio-16-input');
  }
  get imageFacilityName(): Locator {
    return this.page.locator('div:nth-child(7) > .question-container > div > .ng-untouched.ng-pristine.ng-invalid > .input-wrapper > .input-area > span > .input');
  }
  typeOfimageFacility(type: string): Locator {
    return this.page.getByRole('radio', { name: type }).nth(0);
  }
  imageFacilityInternalAffiliation(): Locator {
    return this.page.locator('#mat-radio-21 > .mdc-form-field > .mdc-radio');
  }
  imageFacilityUtilizeNoAccessToEither(): Locator {
    return this.page.getByRole('radio', { name: 'No access to either' });
  }
  get dicomImage_yesBtn(): Locator {
    return this.page.locator('#mat-radio-28-input');
  }
  get radiologyReports_yesBtn(): Locator {
    return this.page.locator('#mat-radio-30-input');
  }
  get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }
  get saveMessageClose(): Locator {
    return this.page.getByText('clear', { exact: true });
  }
  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit' });
  }
  get submitMessageClose(): Locator {
    return this.page.getByText('clear', { exact: true });
  }
  get successful(): Locator {
    return this.page.getByText('successfully submitted');
  }
  get firstName(): Locator {
    return this.page.getByRole('textbox').nth(1);
  }
  get lastName(): Locator {
    return this.page.getByRole('textbox').nth(2);
  }
  get emailAddress(): Locator {
    return this.page.getByRole('textbox').nth(3);
  }
  get medicareProviderNumber(): Locator {
    return this.page.locator('div:nth-child(6) > .ng-untouched > .input-wrapper > .input-area > span > .input');
  }
  imagefacilityAccreditionOption(accreditation: string): Locator {
    return this.page.getByRole('checkbox', { name: accreditation });
  }
  modality(modalityType: string): Locator {
    return this.page.getByRole('checkbox', { name: modalityType });
  }
  imagefacilityEvaluationOption(evaluationOption: string): Locator {
    return this.page.getByRole('radio', { name: evaluationOption });
  }
  dicomImageOption(dicomOption: string): Locator {
    return this.page.getByRole('radio', { name: dicomOption });
  }
  get emptyFormSavePopupMsg(): Locator {
    return this.page.getByText('Site name is required to save');
  }
  get staffListTab(): Locator {
    return this.page.getByText('Staff List', { exact: true });
  }
  get caseListTab(): Locator {
    return this.page.getByText('Case List', { exact: true });
  }
  get changeRequestListTab(): Locator {
    return this.page.getByText('Change Request List', { exact: true });
  }
  get siteAndFeasibilityTab(): Locator {
    return this.page.getByText('Site Feasibility & Registration Form', { exact: true });
  }
  get imageRegistrationFormTab(): Locator {
    return this.page.getByText('Registration Form', { exact: true });
  }
  get imagingLogTab(): Locator {
    return this.page.getByText('Imaging Log', { exact: true });
  }
  async fillSiteName() {
    const siteName = "TestAutomation" + faker.number.int({ min: 100, max: 999 });
    await test.step(`Fill siteName for ${siteName}`, async () => {
      if (await this.siteName.isVisible({ timeout: 7000 })) {
        await this.siteName.click();
        await this.siteName.type(siteName, { delay: 100 }); // 100ms between keystrokes
      }
    });
    return siteName;
  }
  async selectNatureOfSite(siteType: string, hospitalType: string) {
    await test.step(`Select Nature of Site as ${siteType} ${hospitalType}`, async () => {
      await this.page.waitForLoadState('domcontentloaded');
      await this.natureOfSite(siteType).scrollIntoViewIfNeeded();
      await this.natureOfSite(siteType).check();
      await this.hospitalOfType(hospitalType).isVisible();
      await this.hospitalOfType(hospitalType).check();
    });
  }
  async fillPrincipalInvsetigatorInfo(name: string, email: string) {
    await test.step('Fill Principal Investigator Details', async () => {
      await this.principalInvestigatorName.click
      await this.principalInvestigatorName.type(name);
      await this.principalInvestigatorEmail.click();
      await this.principalInvestigatorEmail.type(email);
    });
  }
  async fillPrimaryContactDetails(name: string, email: string) {
    await test.step('Fill Primary Contact Details', async () => {
      await this.primaryContactName.click();
      await this.primaryContactName.type(name);
      await this.primaryContactEmail.click();
      await this.primaryContactEmail.type(email);
    });
  }
  async fillPhysicalAddress(street: string, zip: string, city: string, state: string, telephone: string, fax: string) {
    await test.step('Fill Physical Address Details', async () => {
      await this.physicalAddressStreet.scrollIntoViewIfNeeded();
      await this.physicalAddressStreet.click();
      await this.physicalAddressStreet.type(street);
      await this.physicalAddressStreet.press('Backspace');
      await this.physicalAddressStreetFirstOption.click();
      await this.physicalAddressTelephone.click();
      await this.physicalAddressTelephone.type(telephone);
      await this.physicalAddressFax.click();
      await this.physicalAddressFax.type(fax);
    });
  }
  async selectSiteMailAddressSameAsPhysicalAddress(option: 'Yes' | 'No', siteType: string) {
    await test.step(`Select Site Mail Address Same As Physical Address as ${option}`, async () => {
      if (option === 'Yes') {
        await this.siteMailAddressSameAsPhysicalAddress_YesBtn(siteType).check();
      }
      else if (option === 'No') {
        await this.siteMailAddressSameAsPhysicalAddress_NoBtn(siteType).check();
        await this.page.waitForLoadState('networkidle');
        await this.mailingAddressStreet.click();
        await this.mailingAddressStreet.type('Street');
        await this.mailingAddressStreet.press('Backspace');
        await this.mailingAddressStreetFirstOption.click();
        await this.mailingAddressTelephone.click();
        await this.mailingAddressTelephone.type('123-456-7890');
      }
    });
  }
  async fillPatientPopulationEnrollmentDetails(enrollments: Record<string, number | string>) {
    await test.step('Fill Patient Population Enrollment Details', async () => {
      // Helper function to click and type
      const fillEnrollment = async (locator: Locator, value: string | number) => {
        await locator.click();
        await locator.type(String(value), { delay: 100 });
      };

      // American Indian
      await fillEnrollment(this.patientPopulationEnrollment_AmericanIndian, enrollments.AmericanIndian);

      // Asian American
      await fillEnrollment(this.patientPopulationEnrollment_AsianAmerican, enrollments.AsianAmerican);

      // African American
      await fillEnrollment(this.patientPopulationEnrollment_AfricanAmerican, enrollments.AfricanAmerican);

      // Latin
      await fillEnrollment(this.patientPopulationEnrollment_Latin, enrollments.Latin);

      // North African
      await fillEnrollment(this.patientPopulationEnrollment_NorthAfrican, enrollments.NorthAfrican);

      // Other Pacific
      await fillEnrollment(this.patientPopulationEnrollment_Otherpacific, enrollments.Otherpacific);

      // European
      await fillEnrollment(this.patientPopulationEnrollment_European, enrollments.European);

      // Inclusion / Exclusion Criteria
      await fillEnrollment(this.inclusionExclusionCriteria, enrollments.InclusionExclusionCriteria);

      // Barriers to Enrollment
      await this.barriersToEnrollment_YesBtn.check();

      // Describe Barriers
      await this.describeBarriersToEnrollment.click();
      await this.describeBarriersToEnrollment.type('N/A', { delay: 100 });
    });
  }
  async fillCharacteristicsDetails(characteristics: Record<string, boolean>) {
    await test.step('Fill Characteristics Details', async () => {
      if (characteristics.OnlyThroughClinical) {
        await this.characteristics_OnlyThroughClinical.check();
      }
      if (characteristics.MMSE) {
        await this.characteristics_MMSE.check();
      }
      if (characteristics.OnsiteWithClinical) {
        await this.characteristics_OnsiteWithClinical.check();
      }
      if (characteristics.siteutilizationPhysicianExtenders) {
        await this.characteristics_siteutilizationPhysicianExtenders_yesBtn.check();
      }
      else {
        await this.characteristics_siteutilizationPhysicianExtenders_NoBtn.check();
      }
      if (characteristics.shipAmbientSamples) {
        await this.characteristics_shipAmbientSamples_yesBtn.check();
      }
    });
  }
  async fillImagingFacilityDetails(name: string, type: string) {
    await test.step('Fill Imaging Facility Details', async () => {
      await this.imageFacilityName.click()
        .then(() => this.imageFacilityName.type(name, { delay: 100 }));
      await this.typeOfimageFacility(type).check();
      await this.imageFacilityInternalAffiliation().click();
      await this.imageFacilityUtilizeNoAccessToEither().click();
      await this.dicomImage_yesBtn.check();
      await this.radiologyReports_yesBtn.check();
    });
  }

  async saveAndSubmitForm() {
    await test.step('Save and Submit the Registration Form', async () => {
      await this.saveButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.saveMessageClose.click();
      await this.page.waitForLoadState('networkidle');
      await this.submitButton.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async getSubmissionSuccessMessage() {
    return this.page.getByText('Thank you for your interest in ALZ-NET! We will review your submission and').textContent();
  }

  async getAssignedSiteId() {
    return this.page.textContent('[data-testid="assigned-site-id"]');
  }
  async verifySubmittedStatus(expectedStatus: string) {
    await test.step('Verify Submitted Status', async () => {
      const statusLocator = this.page.getByText(`${expectedStatus}`);
      await statusLocator.waitFor({ state: 'visible', timeout: 5000 });
      const actualStatus = await statusLocator.textContent();
      if (actualStatus !== expectedStatus) {
        throw new Error(`Expected status to be ${expectedStatus}, but got ${actualStatus}`);
      }
    });
  }
  async fillPrimaryContactDetailsInImagefacilityForm(firstname: string, lastname: string, email: string) {
    await test.step('Fill Primary Contact Details', async () => {
      await this.firstName.click();
      await this.firstName.type(firstname);
      await this.lastName.click();
      await this.lastName.type(lastname);
      await this.emailAddress.click();
      await this.emailAddress.type(email);
    });
  }
  async selectTypeOfImagingFacility(type: string) {
    await test.step(`Select Type of Imaging Facility as ${type}`, async () => {
      await this.typeOfimageFacility(type).check();
    });
  }
  async fillMedicareProviderNumber(medicareNumber: string) {
    await test.step('Fill Medicare Provider Number', async () => {
      await this.medicareProviderNumber.click();
      await this.medicareProviderNumber.type(medicareNumber);
    });
  }
  async fillImageFacilityDetails(imagefacilityAccreditionOption: string, modalityType: string, imagefacilityEvaluationOption: string, dicomImageOption: string) {
    await test.step('Fill Imaging Facility Details', async () => {
      const facilityName = "ImagingFacility" + faker.number.int({ min: 100, max: 999 });
      await this.imagefacilityAccreditionOption(imagefacilityAccreditionOption).check();
      await this.modality(modalityType).check();
      await this.imagefacilityEvaluationOption(imagefacilityEvaluationOption).check();
      await this.imageFacilityUtilizeNoAccessToEither().click();
      await this.dicomImageOption(dicomImageOption).check();
    });
  }
  async saveForm() {
    await test.step('Save and Submit the Registration Form', async () => {
      await this.saveButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.saveMessageClose.click();
      await this.page.waitForLoadState('networkidle');
    });
  }
  async verifySuccessMessageAndClosePopup(expectedMessage: string) {
    await test.step('Verify Success Message and Close the Popup', async () => {
      const successMessage = await this.getSubmissionSuccessMessage();
      expect(successMessage).toContain(expectedMessage);
      await this.submitMessageClose.click();
    });

  }
  async verifySaveEmptyForm() {
    await test.step('Save and Submit the Registration Form', async () => {
      await this.saveButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.emptyFormSavePopupMsg.isVisible();
      await this.saveMessageClose.click();
      await this.page.waitForLoadState('networkidle');
    });
  }
  async verifySiteFacilityFormTabs() {
    await test.step('Verify the Site Staff List, Case List and Change Request List tabs on the Page.', async () => {
      expect(await this.siteAndFeasibilityTab.isVisible());
      expect(await this.staffListTab.isVisible());
      expect(await this.caseListTab.isVisible());
      expect(await this.changeRequestListTab.isVisible());
    });
  }
  async verifyImageFacilityRegistrationFormTabs() {
    await test.step('Verify the Site Staff List, Case List and Change Request List tabs on the Page.', async () => {
      expect(await this.imageRegistrationFormTab.isVisible());
      expect(await this.staffListTab.isVisible());
      expect(await this.imagingLogTab.isVisible());

    });
  }
  private get thankYouInterestText(): Locator {
    return this.page.getByText('Thank you for your interest');
  }

  private get pleaseNoteText(): Locator {
    return this.page.getByText('Please note: Do not complete');
  }

  private get instructionsText(): Locator {
    return this.page.getByText('Instructions: After reviewing');
  }
  async verifyRegisterSiteFormText(expectedThankYouText: string, expectedPleaseNoteText: string, expectedInstructionsText: string) {
    await expect(this.thankYouInterestText).toHaveText(expectedThankYouText);
    await expect(this.pleaseNoteText).toHaveText(expectedPleaseNoteText);
    await expect(this.instructionsText).toHaveText(expectedInstructionsText);
  }
  async verifyLogo() {
    await test.step('Verify Registration page Logo.', async () => {
      await this.page.getByRole('img', { name: 'Alzheimer\'s Network logo' }).isVisible();
    });
  }
  async verifyLoggedInUser(user: string) {
    await test.step('Verify Logged In User.', async () => {
      await this.page.getByRole('button', { name: user }).isVisible();
    });
  }

  /**
   * Fills all mandatory fields on the Site Registration Form using values from the provided test data object.
   * Handles top-level fields and nested sections (additionalFields, patientPopulation, registrationFormText).
   * Uses ActionUtils for interactions, element readiness checks, and Playwright test.step wrappers.
   * Implements multiple locator strategies for each field (primary + 1–2 fallbacks as comments).
   * Logs before each major step and on error.
   * @param data The test data object (e.g., loaded from TC-001.json)
   */
  async fillRegistrationFormFromTestData(data: any): Promise<void> {
    await test.step('Fill Registration Form from Test Data', async () => {
      try {
        Logger.info('Starting to fill registration form from test data', { section: 'fillRegistrationFormFromTestData' });
        // --- Site Name ---
        Logger.info('Filling Site Name', { value: data.siteName });
        const siteNameLocator = this.siteName; // PRIMARY
        // SECONDARY LOCATORS (fallback)
        // this.page.locator('input[formcontrolname="siteName"]')
        // this.page.locator('//input[contains(@placeholder, "Site Name")]')
        await siteNameLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(siteNameLocator, data.siteName);
        
        // --- Nature of Site ---
        Logger.info('Selecting Nature of Site', { value: data.siteType });
        const natureOfSiteLocator = this.natureOfSite(data.siteType); // PRIMARY
        // SECONDARY: this.page.locator(`//label[normalize-space()='${data.siteType}']`)
        await natureOfSiteLocator.waitFor({ state: 'visible' });
        await ActionUtils.click(natureOfSiteLocator);
        
        // --- Hospital Type ---
        Logger.info('Selecting Hospital Type', { value: data.hospitalType });
        const hospitalTypeLocator = this.hospitalOfType(data.hospitalType); // PRIMARY
        // SECONDARY: this.page.locator(`//label[normalize-space()='${data.hospitalType}']`)
        await hospitalTypeLocator.waitFor({ state: 'visible' });
        await ActionUtils.click(hospitalTypeLocator);

        // --- Principal Investigator ---
        Logger.info('Filling Principal Investigator', { value: data.additionalFields?.['principal-investigator'] });
        const piNameLocator = this.principalInvestigatorName; // PRIMARY
        // SECONDARY: this.page.locator('input[formcontrolname="principalInvestigatorName"]')
        await piNameLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(piNameLocator, data.additionalFields?.['principal-investigator'] || '');
        const piEmailLocator = this.principalInvestigatorEmail; // PRIMARY
        // SECONDARY: this.page.locator('input[formcontrolname="principalInvestigatorEmail"]')
        await piEmailLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(piEmailLocator, data.additionalFields?.['principal-investigator-email'] || data.contactEmail || '');

        // --- Primary Contact ---
        Logger.info('Filling Primary Contact', { value: data.additionalFields?.['primary-contact'] });
        const pcNameLocator = this.primaryContactName; // PRIMARY
        // SECONDARY: this.page.locator('input[formcontrolname="primaryContactName"]')
        await pcNameLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(pcNameLocator, data.additionalFields?.['primary-contact'] || '');
        const pcEmailLocator = this.primaryContactEmail; // PRIMARY
        // SECONDARY: this.page.locator('input[formcontrolname="primaryContactEmail"]')
        await pcEmailLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(pcEmailLocator, data.additionalFields?.['primary-contact-email'] || data.contactEmail || '');

        // --- Physical Address ---
        Logger.info('Filling Physical Address', { street: data.physicalAddressStreet, zip: data.physicalAddressZip, city: data.physicalAddressCity, state: data.physicalAddressState });
        const streetLocator = this.physicalAddressStreet; // PRIMARY
        // SECONDARY: this.page.locator('input[formcontrolname="physicalAddressStreet"]')
        await streetLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(streetLocator, data.physicalAddressStreet);
        // Select from dropdown if needed
        if (await this.physicalAddressStreetFirstOption.isVisible()) {
          await ActionUtils.click(this.physicalAddressStreetFirstOption);
        }
        const zipLocator = this.physicalAddressZip; // PRIMARY
        // SECONDARY: this.page.locator('input[formcontrolname="physicalAddressZip"]')
        await zipLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(zipLocator, data.physicalAddressZip);
        const cityLocator = this.physicalAddressCity; // PRIMARY
        // SECONDARY: this.page.locator('input[formcontrolname="physicalAddressCity"]')
        await cityLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(cityLocator, data.physicalAddressCity);
        const stateDropdown = this.physicalAddressStateDropdown; // PRIMARY
        // SECONDARY: this.page.locator('select[formcontrolname="physicalAddressState"]')
        await stateDropdown.waitFor({ state: 'visible' });
        await ActionUtils.click(stateDropdown);
        const stateOption = this.physicalAddressStateOption(data.physicalAddressState);
        await stateOption.waitFor({ state: 'visible' });
        await ActionUtils.click(stateOption);
        const telephoneLocator = this.physicalAddressTelephone; // PRIMARY
        // SECONDARY: this.page.locator('input[formcontrolname="physicalAddressTelephone"]')
        await telephoneLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(telephoneLocator, data.physicalAddressTelephone);
        const faxLocator = this.physicalAddressFax; // PRIMARY
        // SECONDARY: this.page.locator('input[formcontrolname="physicalAddressFax"]')
        await faxLocator.waitFor({ state: 'visible' });
        await ActionUtils.clearAndType(faxLocator, data.physicalAddressFax);

        // --- Site Mail Address Same As Physical Address ---
        Logger.info('Selecting Site Mail Address Same As Physical Address', { value: data.additionalFields?.['mail-same-as-physical'] });
        const mailSameAsPhysical = data.additionalFields?.['mail-same-as-physical'] || 'Yes';
        if (mailSameAsPhysical === 'Yes') {
          await this.siteMailAddressSameAsPhysicalAddress_YesBtn('Site Facility').waitFor({ state: 'visible' });
          await ActionUtils.click(this.siteMailAddressSameAsPhysicalAddress_YesBtn('Site Facility'));
        } else {
          await this.siteMailAddressSameAsPhysicalAddress_NoBtn('Site Facility').waitFor({ state: 'visible' });
          await ActionUtils.click(this.siteMailAddressSameAsPhysicalAddress_NoBtn('Site Facility'));
          await this.page.waitForLoadState('networkidle');
          await this.mailingAddressStreet.waitFor({ state: 'visible' });
          await ActionUtils.clearAndType(this.mailingAddressStreet, data.additionalFields?.['mailing-address-street'] || '');
          if (await this.mailingAddressStreetFirstOption.isVisible()) {
            await ActionUtils.click(this.mailingAddressStreetFirstOption);
          }
          await this.mailingAddressTelephone.waitFor({ state: 'visible' });
          await ActionUtils.clearAndType(this.mailingAddressTelephone, data.additionalFields?.['mailing-address-telephone'] || '');
        }

        // --- Patient Population ---
        if (data.patientPopulation) {
          Logger.info('Filling Patient Population', { values: data.patientPopulation });
          await this.fillPatientPopulationEnrollmentDetails(data.patientPopulation);
        }

        // --- Characteristics (if present) ---
        if (data.additionalFields?.characteristics) {
          Logger.info('Filling Characteristics', { values: data.additionalFields.characteristics });
          await this.fillCharacteristicsDetails(data.additionalFields.characteristics);
        }

        // --- Imaging Facility Details (if present) ---
        if (data.imagingFacilityName) {
          Logger.info('Filling Imaging Facility Details', { name: data.imagingFacilityName, type: data.additionalFields?.['imaging-facility-type'] });
          await this.fillImagingFacilityDetails(data.imagingFacilityName, data.additionalFields?.['imaging-facility-type'] || '');
        }

        // --- Registration Form Text (if present) ---
        if (data.registrationFormText) {
          Logger.info('Verifying Registration Form Text', { text: data.registrationFormText });
          await this.verifyRegisterSiteFormText(
            data.registrationFormText.thankYouText,
            data.registrationFormText.pleaseNoteText,
            data.registrationFormText.instructionsText
          );
        }

        // --- Final Validation Before Submission ---
        Logger.info('Validating all mandatory fields before submission');
        // Optionally, add more field checks/assertions here
        Logger.info('Completed filling registration form from test data', { section: 'fillRegistrationFormFromTestData' });
      } catch (error: any) {
        Logger.error('Error filling registration form from test data', { message: error.message, stack: error.stack, step: 'fillRegistrationFormFromTestData' });
        throw error;
      }
    });
  }
}
