import { test, expect } from '@utils/pageFixture.js';
import registrationFormData from '@data/Staging/alznetapplication/e2e/site-registration-form-data.json' with { type: 'json' };
import testData from '@data/Staging/alznetapplication/e2e/ALZ-T121.json' with { type: 'json' };
import { ENV } from '@/config/env.js';
import { CommonUtils } from '@/utils/common-utils.js';

// Assumes Site Administrator login credentials are managed in environment or fixtures

test.describe('ALZ-T121 Complete and Submit the Registration Form', () => {
  test('Site Administrator can complete and submit the Site Feasibility & Registration Form', async ({
    loginPage,
    siteFeasibilityPage,
  }) => {
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD); // Assumes this method exists and uses env credentials 
    const registrationFormPage = await siteFeasibilityPage.navigateToSiteRegisterForm();
    await registrationFormPage.isFormDisplayed(registrationFormData.siteFormName);
    await registrationFormPage.verifySiteFacilityFormTabs();
    await registrationFormPage.verifyRegisterSiteFormText(registrationFormData.registrationFormText.thankYouText,registrationFormData.registrationFormText.pleaseNoteText,registrationFormData.registrationFormText.instructionsText);
    await registrationFormPage.verifySiteID(registrationFormData.siteID);
    await registrationFormPage.verifyStatus(registrationFormData.initialStatus);
    await registrationFormPage.verifyLogo();
    await registrationFormPage.verifyLoggedInUser(registrationFormData.loggedInUser);
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
    //Verify the Email validation steps once email setup is done
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
