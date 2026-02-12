// tests/specs/AccessSiteFeasibilityRegistrationForm_TCD_FT_01_FR-1.spec.ts
import { test, expect } from '@utils/pageFixture.js';
import { ENV } from '@/config/env.js';
import registrationFormData from '@data/Staging/alznetapplication/e2e/ALZ-T123.json' with { type: 'json' };
import { CommonUtils } from '@/utils/common-utils.js';
// Test Case: TCD_FT_01_FR-1 - Access Site Feasibility & Registration Form

test.describe('Verify that clicking Register Dementia Site opens the Site Registration & Feasibility Form. [TCD_FT_01_FR-1]', () => {
  test('Image Facility Administrator can complete and submit the Site Feasibility & Registration Form', async ({
    page,
    loginPage,
    homePage,
    siteFeasibilityPage,
  }) => {
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
    await homePage.verifylandingPageElements();
    const registrationFormPage = await siteFeasibilityPage.navigateToImageRegisterForm();
    await registrationFormPage.isFormDisplayed(registrationFormData.ImageRegistrationFormTabText);
    await registrationFormPage.verifyImageFacilityRegistrationFormTabs();
    await registrationFormPage.verifyRegisterSiteFormText(registrationFormData.registrationFormText.thankYouText, registrationFormData.registrationFormText.pleaseNoteText, registrationFormData.registrationFormText.instructionsText);
    await registrationFormPage.verifyStatus(registrationFormData.initialStatus);
    await registrationFormPage.verifySiteID(registrationFormData.siteID);
    await registrationFormPage.verifyLogo();
    await registrationFormPage.verifyLoggedInUser(registrationFormData.loggedInUser);
    await registrationFormPage.verifyDraftText(registrationFormData.draftText);
    await registrationFormPage.verifyDraftText(registrationFormData.draftText);
    const siteName = await registrationFormPage.fillSiteName();
    await registrationFormPage.selectTypeOfImagingFacility(registrationFormData.imagingFacilityType);
    await registrationFormPage.fillPrimaryContactDetailsInImagefacilityForm(registrationFormData.firstName, registrationFormData.lastName, registrationFormData.contactEmail);
    await registrationFormPage.fillPhysicalAddress(
      registrationFormData.physicalAddressStreet,
      registrationFormData.physicalAddressZip,
      registrationFormData.physicalAddressCity,
      registrationFormData.physicalAddressState,
      registrationFormData.physicalAddressTelephone,
      registrationFormData.physicalAddressFax,
    );
    await registrationFormPage.selectSiteMailAddressSameAsPhysicalAddress('Yes', 'Imaging Facility');
    await registrationFormPage.fillMedicareProviderNumber(registrationFormData.MedicareProviderNumber);
    await registrationFormPage.fillImageFacilityDetails(registrationFormData.imagefacilityAccreditations, registrationFormData.modalityTypes, registrationFormData.imageFacilityEvaluationOption, registrationFormData.dicomImageOption);
    await registrationFormPage.saveAndSubmitForm();
    await registrationFormPage.getSubmissionSuccessMessage();
    await registrationFormPage.verifySuccessMessageAndClosePopup(registrationFormData.successionText);
    await registrationFormPage.verifyStatus(registrationFormData.submittedStatus);

    //Verify the Email validation steps once email setup is done
    // Validate email using Gmail API
    await test.step('Validate confirmation email via Gmail API', async () => {
      const expectedContentItems = registrationFormData.emailValidation.expectedContent.map((item: string) =>
        item === 'siteName' ? siteName : item
      );

      await CommonUtils.validateConfirmationEmailViaGmail({
        contactEmail: registrationFormData.contactEmail,
        subjectRegex: new RegExp(registrationFormData.emailValidation.subjectPattern, 'i'),
        expectedContent: expectedContentItems,
        credentialsPath: process.env.GMAIL_CREDENTIALS || 'credentials.json',
        tokenPath: process.env.GMAIL_TOKEN || 'token.json',
      });
    });
  });
});