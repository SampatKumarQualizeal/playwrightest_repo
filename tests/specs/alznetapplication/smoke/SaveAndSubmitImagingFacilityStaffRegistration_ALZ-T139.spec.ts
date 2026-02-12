import { test, expect } from '@utils/pageFixture.js'; // Ensure Page is imported
import testData from '@data/Staging/alznetapplication/smoke/ALZ-T139.json' with { type: 'json' };
import { ENV } from '@/config/env.js';
import { faker } from '@faker-js/faker'; // Import faker
import { CommonUtils } from '@/utils/common-utils.js';

// Assumes Site Administrator login credentials are managed in environment or fixtures

test.describe('Save & Submit Imaging Facility staff Registration', () => {
  test('Save & Submit Approved or Active Imaging Facility staff Registration Form', async ({
    loginPage,
    homePage, // Use the original homePage fixture
    siteFeasibilityPage, // Use the original siteFeasibilityPage fixture
    staffListPage, // Use the original staffListPage fixture
    registrationFormPage: registrationFormPageFixture, // Rename fixture to avoid conflict with local variable
    page // Access the original page object
  }) => {
    const appUrl = ENV.APP_URL;
    await loginPage.goto(appUrl);
    await loginPage.login(ENV.ACTIVE_APPUSERNAME, ENV.ACTIVE_APPPASSWORD);

    // Generate dynamic staff details
    const dynamicFirstName = faker.person.firstName();
    const dynamicLastName = faker.person.lastName();
    const dynamicEmail = faker.internet.email({ firstName: dynamicFirstName, lastName: dynamicLastName, provider: 'gmail.com' }); // Changed provider

    // The methods below navigate within the same page, they do not open new tabs.
    // Therefore, remove the new page handling logic.
    await homePage.clickAccessMyFacilityAndVerify(testData.siteName);
    let registrationFormPage = await homePage.accessSavedDraftRegistrationForm(testData.siteName);

    await staffListPage.openStaffList();
    await staffListPage.openAddStaffForm();
    await staffListPage.fillStaffDetails(
      dynamicFirstName,
      dynamicLastName,
      dynamicEmail
    );

    await staffListPage.selectInterpretingPhysicianRadioOptions(testData.staffDetails.radioOption as 'Yes' | 'No');

    await staffListPage.saveForm();
    await staffListPage.verifySaveWarningDialog();

    await staffListPage.clearForm();
    await staffListPage.filterStaff(dynamicFirstName); // Filter by dynamic first name
    await staffListPage.openStaffActions();
    await staffListPage.editStaff();
    await staffListPage.selectUserRole(testData.staffDetails.userRole);
    await staffListPage.submitForm();
    await staffListPage.verifySubmissionSuccess();
    await staffListPage.clearForm();
    //Verify the email validation part is not feasible as everytime we need to give the new valid mail id 

  });
});
