import { test, expect } from '@utils/pageFixture.js';
import registrationFormData from '@data/Staging/alznetapplication/smoke/site-registration-form-data.json' with { type: 'json' };
import testData from '@data/Staging/alznetapplication/smoke/ALZ-T136.json' with { type: 'json' };
import { ENV } from '@/config/env.js';
import { CommonUtils } from '@/utils/common-utils.js';

// Assumes Site Administrator login credentials are managed in environment or fixtures

test.describe('Dementia Site - Registration form Save Draft, Complete & Submit.', () => {
  test('Site Administrator can save the Site Feasibility & Registration Form and complete and submit', async ({
    loginPage,
    homePage,
    siteFeasibilityPage,
  }) => {
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD); // Assumes this method exists and uses env credentials 
    let registrationFormPage = await siteFeasibilityPage.navigateToSiteRegisterForm();
    await registrationFormPage.isFormDisplayed(registrationFormData.siteFormName);
    await registrationFormPage.verifySaveEmptyForm();
    await registrationFormPage.verifyStatus(registrationFormData.initialStatus);
    await registrationFormPage.verifySiteID(registrationFormData.siteID);
    await registrationFormPage.verifyDraftText(registrationFormData.draftText);
    const siteName = await registrationFormPage.fillSiteName();
    await registrationFormPage.selectNatureOfSite(registrationFormData.siteType, registrationFormData.hospitalType);
    await registrationFormPage.fillPrincipalInvsetigatorInfo(
      registrationFormData.additionalFields['principal-investigator'],
      registrationFormData.contactEmail,
    );
    await registrationFormPage.fillPrimaryContactDetails(
      registrationFormData.siteName,
      registrationFormData.contactEmail,
    );
    await registrationFormPage.saveForm();
    await registrationFormPage.verifyStatus(registrationFormData.SavedStatus);
    await registrationFormPage.verifySiteID(registrationFormData.siteID);
    await registrationFormPage.logout();
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
    await test.step('Access Saved Draft Registration Form', async () => {
      await homePage.clickAccessMySiteAndVerify(siteName);
      registrationFormPage = await homePage.accessSavedDraftRegistrationForm(siteName);
    });
    await registrationFormPage.fillPhysicalAddress(
      registrationFormData.physicalAddressStreet,
      registrationFormData.physicalAddressZip,
      registrationFormData.physicalAddressCity,
      registrationFormData.physicalAddressState,
      registrationFormData.physicalAddressTelephone,
      registrationFormData.physicalAddressFax,
    );
    await registrationFormPage.selectSiteMailAddressSameAsPhysicalAddress('Yes', 'Site Facility');
    await registrationFormPage.fillPatientPopulationEnrollmentDetails({
      AmericanIndian: registrationFormData.patientPopulation.AmericanIndian,
      AsianAmerican: registrationFormData.patientPopulation.AsianAmerican,
      AfricanAmerican: registrationFormData.patientPopulation.AfricanAmerican,
      Latin: registrationFormData.patientPopulation.Latin,
      NorthAfrican: registrationFormData.patientPopulation.NorthAfrican,
      Otherpacific: registrationFormData.patientPopulation.Otherpacific,
      European: registrationFormData.patientPopulation.European,
      InclusionExclusionCriteria: registrationFormData.patientPopulation.InclusionExclusionCriteria,
    });

    await registrationFormPage.fillCharacteristicsDetails({
      OnlyThroughClinical: true,
      MMSE: true,
      OnsiteWithClinical: true,
      siteutilizationPhysicianExtenders: false,
      shipAmbientSamples: true,
    });
    await registrationFormPage.fillImagingFacilityDetails(
      registrationFormData.imagingFacilityName,
      'Hospital-based facility',
    );
    // Submit the form
    await registrationFormPage.saveAndSubmitForm();
    // verify submission success message
    await registrationFormPage.getSubmissionSuccessMessage();
    await registrationFormPage.verifySuccessMessageAndClosePopup(testData.successionText);
    await registrationFormPage.verifySubmittedStatus(testData.submittedStatus);

    // Validate email using Gmail API
    await test.step('Validate confirmation email via Gmail API', async () => {
      const expectedContentItems = testData.emailValidation.expectedContent.map((item: string) => 
        item === 'siteName' ? siteName : item
      );
      
      await CommonUtils.validateConfirmationEmailViaGmail({
        contactEmail: registrationFormData.contactEmail,
        subjectRegex: new RegExp(testData.emailValidation.subjectPattern, 'i'),
        expectedContent: expectedContentItems,
        credentialsPath: process.env.GMAIL_CREDENTIALS || 'credentials.json',
        tokenPath: process.env.GMAIL_TOKEN || 'token.json',
      });
    });
  });
});