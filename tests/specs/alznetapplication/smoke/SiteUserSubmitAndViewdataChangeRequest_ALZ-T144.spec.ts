import { test, expect } from '@utils/pageFixture.js'; // Ensure Page is imported
import testData from '@data/Staging/alznetapplication/smoke/ALZ-T140.json' with { type: 'json' };
import { ENV } from '@/config/env.js';
import { faker } from '@faker-js/faker'; // Import faker

// Assumes Site Administrator login credentials are managed in environment or fixtures

test.describe('Save & Submit Case Registration', () => {
  test('Save & Submit Case Registration', async ({
    loginPage,
    homePage, // Use the original homePage fixture
    caseListPage, // Use the original siteFeasibilityPage fixture
    registrationFormPage: registrationFormPageFixture,
    changeRequestListPage: changeRequestListPageFixture, // Rename fixture to avoid conflict with local variable
  }) => {
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);
    await loginPage.login(ENV.ACTIVE_APPUSERNAME, ENV.ACTIVE_APPPASSWORD);

    // Generate dynamic patient details
    const dynamicFirstName = faker.person.firstName();
    const dynamicMiddleName = faker.person.middleName();
    const dynamicLastName = faker.person.lastName();
    const dynamicEmail = faker.internet.email({ firstName: dynamicFirstName, lastName: dynamicLastName, provider: 'gmail.com' });


    // The methods below navigate within the same page, they do not open new tabs.
    // Therefore, remove the new page handling logic.
    await homePage.clickAccessMySiteAndVerify(testData.siteName);
    let registrationFormPage = await homePage.accessSavedDraftRegistrationForm(testData.siteName);

    await registrationFormPage.verifyStatus(testData.activeStatus);
    await registrationFormPage.verifySiteID('any_numeric');

    // Step 2 & 3
    await caseListPage.openCaseList();
    // await caseListPage.startNewCase();
    // await caseListPage.selectStaffMember(testData.caseRegistrationPart1.staffMember);
    // await caseListPage.selectDateForConsentLAR(
    //   testData.caseRegistrationPart1.consentLARMonth,
    //   testData.caseRegistrationPart1.consentLARDay,
    //   testData.caseRegistrationPart1.consentLARYear
    // );
    // await caseListPage.selectDateOfProtocolVersioningTo();
    // await caseListPage.selectInformedConsentProvidedByRadioOption(testData.caseRegistrationPart1.informedConsentProvidedBy);
    // await caseListPage.selectLanguageConsentRadioOption(testData.caseRegistrationPart1.languageConsent);
    // await caseListPage.selectYesNoForQuestion('Has consent been provided for the patient', testData.caseRegistrationPart1.hasConsentProvided as 'Yes' | 'No');
    // await caseListPage.selectYesNoForQuestion('patient’s legally authorized representative', testData.caseRegistrationPart1.legallyAuthorizedRepresentative as 'Yes' | 'No');
    // await caseListPage.selectYesNoForQuestion('Patient is at least 18 years of age at the time of informed consent', testData.caseRegistrationPart1.patientIsAtLeast18 as 'Yes' | 'No');
    // await caseListPage.selectYesNoForQuestion('Patient has a diagnosis of MCI or dementia', testData.caseRegistrationPart1.patientHasDiagnosis as 'Yes' | 'No');
    // await caseListPage.selectYesNoForQuestion('FDA-approved AD therapy/therapies', testData.caseRegistrationPart1.fdaApprovedAdTherapy as 'Yes' | 'No');
    // await caseListPage.selectYesNoForQuestion('Patient’s treating clinician has made the decision to provide clinical care or treatment', testData.caseRegistrationPart1.treatingClinicianDecision as 'Yes' | 'No');
    // const temporaryID = await caseListPage.submitEligibility();
    // await caseListPage.clearFormButton();

    // // Step 4 & 5
    // await caseListPage.verifyPart2Loaded();
    // await caseListPage.verifyTemporaryID(temporaryID);
    // await caseListPage.fillPatientInformation(
    //   dynamicFirstName,
    //   dynamicMiddleName,
    //   dynamicLastName,
    //   testData.month,
    //   testData.day,
    //   testData.year,
    //   testData.primaryAddressStreet,
    //   testData.primaryAddressTelephone,
    //   dynamicEmail,
    //   testData.caseRegistrationPart2.sexAssignedAtBirth,
    //   testData.caseRegistrationPart2.genderIdentity,
    //   testData.caseRegistrationPart2.race,
    //   testData.caseRegistrationPart2.countryOfResidence,
    //   testData.caseRegistrationPart2.primaryInsurance
    // );
    // await caseListPage.selectPrimaryInsurance(testData.caseRegistrationPart2.primaryInsurance);
    // // await caseListPage.selectYesNoForQuestion('Does the patient have secondary insurance', testData.caseRegistrationPart2.secondaryInsurance as 'Yes' | 'No');
    // await caseListPage.saveCase();

    // // Step 6
    // await caseListPage.reopenCase(temporaryID);

    // // Step 7
    // await caseListPage.submitFinalCase();

    // await caseListPage.clearForm();

    await caseListPage.applyFiletrsOnFirstNameAndClickChangeRequest("Roberta"); // Filter by first name and click change request
    //Verify Data Change Request Form opens with fields already filled with case details.
    const caseId = await caseListPage.verifyFilledCaseDeatilsInChangeRequestForm(ENV.ACTIVE_APPUSERNAME);
    await caseListPage.fillChangeRequestDetails(testData.chnagecase.FormType, testData.chnagecase.changeReason, testData.chnagecase.selectReasonForChange);
    await caseListPage.validatebackToCaseListNavigation(testData.backNvaigationPopupText, testData.proceedBtn);

    await caseListPage.openCaseList();
    await caseListPage.applyFiletrsOnFirstNameAndClickChangeRequest("Roberta");
    await caseListPage.fillChangeRequestDetails(testData.chnagecase.FormType, testData.chnagecase.changeReason, testData.chnagecase.selectReasonForChange);
    await caseListPage.submitChangeRequestForm();
    await caseListPage.verifyChangeRequestSubmissionSuccessAndClose();
    await changeRequestListPageFixture.verifyChangeRequest(caseId);


  });
});