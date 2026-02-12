import { test, expect } from '@utils/pageFixture.js';
import testData from '@data/Staging/alznetapplication/smoke/ALZ-T138.json' with { type: 'json' };
import { ENV } from '@/config/env.js';
import { faker } from '@faker-js/faker'; // Import faker
import { CommonUtils } from '@/utils/common-utils.js';

test.describe('Save & Submit Site Staff Registration', () => {
  test('Save & Submit Approved or Active Site Staff Registration Form', async ({
    loginPage,
    homePage, // Use the original homePage fixture

    staffListPage, // Use the original staffListPage fixture
    registrationFormPage: registrationFormPageFixture, // Rename fixture to avoid conflict with local variable
    page // Access the original page object
  }) => {
    const appUrl = ENV.APP_URL;
    const dynamicFirstName = faker.person.firstName();
    const dynamicLastName = faker.person.lastName();
    const dynamicEmail = faker.internet.email({ firstName: dynamicFirstName, lastName: dynamicLastName, provider: 'gmail.com' }); // Changed provider
    await loginPage.goto(appUrl);
    await loginPage.login(ENV.ACTIVE_APPUSERNAME, ENV.ACTIVE_APPPASSWORD);

    // The methods below navigate within the same page, they do not open new tabs.
    // Therefore, remove the new page handling logic.
    await homePage.clickAccessMySiteAndVerify(testData.siteName);
    await homePage.accessSavedDraftRegistrationForm(testData.siteName);

    await staffListPage.openStaffList();
    await staffListPage.openAddStaffForm();
    await staffListPage.verifyEmptyFormSubmitWarning();
    await staffListPage.clearForm();
    await staffListPage.fillStaffDetails(
      dynamicFirstName,
      dynamicLastName,
      dynamicEmail
    );
    await staffListPage.selectInterpretingPhysicianRadioOptions(testData.staffDetails.radioOption as 'Yes' | 'No');

    await staffListPage.saveForm();
    await staffListPage.verifySaveWarningDialog();

    await staffListPage.clearForm();
    await staffListPage.filterStaff(dynamicFirstName); // Filter by first name
    await staffListPage.openStaffActions();
    await staffListPage.editStaff();
    await staffListPage.selectPrimaryRole(testData.staffDetails.primaryRole);
    await staffListPage.uploadHumanProtectCertification();
    await staffListPage.submitForm();
    await staffListPage.verifySubmissionSuccess();
    await staffListPage.clearForm();
    //Verify the email validation part is not feasible as everytime we need to give the new valid mail id
    
  });
});
