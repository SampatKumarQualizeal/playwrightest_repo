// tests/specs/AccessSiteFeasibilityRegistrationForm_TCD_FT_01_FR-1.spec.ts
import { test, expect } from '@utils/pageFixture.js';
import { ENV } from '@/config/env.js';
import registrationFormData from '@data/Staging/alznetapplication/smoke/ALZ-T137.json' with { type: 'json' };
import { CommonUtils } from '@/utils/common-utils.js';

// Test Case: TCD_FT_01_FR-1 - Access Site Feasibility & Registration Form

test.describe('Verify that clicking Register Dementia Site opens the Site Registration & Feasibility Form. [TCD_FT_01_FR-1]', () => {
  test('Image facility Administrator can Save the Site Feasibility & Registration Form', async ({
    page,
    loginPage,
    homePage,
    siteFeasibilityPage,
  }) => {
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
    await expect(page).toHaveURL(/landing/);

    let registrationFormPage = await siteFeasibilityPage.navigateToImageRegisterForm();
    await registrationFormPage.isFormDisplayed(registrationFormData.ImageRegistrationFormTabText);
    await registrationFormPage.verifySaveEmptyForm();
    await registrationFormPage.verifyStatus(registrationFormData.initialStatus);
    await registrationFormPage.verifySiteID(registrationFormData.siteID);
    await registrationFormPage.verifyDraftText(registrationFormData.draftText);
    //Attempt to save an empty form (clear all fields if allowed, then click Save).

    const siteName = await registrationFormPage.fillSiteName();
    await registrationFormPage.selectTypeOfImagingFacility(registrationFormData.imagingFacilityType);
    await registrationFormPage.fillPrimaryContactDetailsInImagefacilityForm(registrationFormData.firstName, registrationFormData.lastName, registrationFormData.contactEmail);

    await registrationFormPage.fillMedicareProviderNumber(registrationFormData.MedicareProviderNumber);
    await registrationFormPage.fillImageFacilityDetails(registrationFormData.imagefacilityAccreditations, registrationFormData.modalityTypes, registrationFormData.imageFacilityEvaluationOption, registrationFormData.dicomImageOption);
    await registrationFormPage.saveForm();
    await registrationFormPage.verifyStatus(registrationFormData.SavedStatus);
    await registrationFormPage.verifySiteID(registrationFormData.siteID);
    await registrationFormPage.logout();
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
    await test.step('Access Saved Draft Registration Form', async () => {
      await homePage.clickAccessMyFacilityAndVerify(siteName);
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
    await registrationFormPage.selectSiteMailAddressSameAsPhysicalAddress('Yes', 'Imaging Facility');
    await registrationFormPage.saveAndSubmitForm();
    await registrationFormPage.verifySuccessMessageAndClosePopup(registrationFormData.successionText);
    await registrationFormPage.verifyStatus(registrationFormData.SubmittedStatus);
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