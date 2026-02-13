import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/login.page';
import { HomePage } from '../../../src/pages/home';
import { RegistrationFormPage } from '../../../src/pages/registration-form.page';
import { TestDataUtils } from '../../../src/utils/test-data-utils';

// Test data file for login scenarios (positive, negative, edge cases)
const loginTestDataPath = 'test-data/Staging/alznetapplication/e2e/verify-user-can-login-successfully-data.json';
const registrationFormDataPath = 'test-data/Staging/alznetapplication/e2e/site-registration-form-data.json';

// Helper to load test data
async function getLoginTestData() {
  return await TestDataUtils.loadJSONData(loginTestDataPath);
}

async function getRegistrationFormData() {
  return await TestDataUtils.loadJSONData(registrationFormDataPath);
}

// Main test suite for TC_001: Verify user can login successfully
// This covers positive, negative, and edge login scenarios
// and the full workflow for a successful login and registration

test.describe('TC_001: Verify user can login successfully', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let registrationFormPage: RegistrationFormPage;
  let loginTestData: any;
  let registrationFormData: any;
  const loginUrl = 'https://alznetapp-uat.acr.org/login';

  test.beforeAll(async ({ browser }) => {
    // Load test data once for all tests
    loginTestData = (await getLoginTestData()).testData;
    registrationFormData = (await getRegistrationFormData());
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    registrationFormPage = new RegistrationFormPage(page);
    // Always start from login page
    await loginPage.goto(loginUrl);
  });

  test('should login successfully with valid credentials and complete site registration', async ({ page }) => {
    // Find a positive/valid login scenario
    const validLogin = loginTestData.find((d: any) => d.expected.success === true);
    expect(validLogin, 'Valid login test data should exist').toBeTruthy();
    // Perform login using page object
    await loginPage.login(validLogin.username.trim(), validLogin.password.trim());
    // Home page should be displayed (implicit in loginPage.login)
    // Click on "Register My Site" button
    await homePage.clickRegisterMySiteAndVerifyFormDisplayed();
    // Fill all mandatory fields and submit registration form
    // Use the first set of registration form data
    const regData = Array.isArray(registrationFormData) ? registrationFormData[0] : registrationFormData;
    // Fill registration form using page object methods
    await registrationFormPage.fillSiteName();
    await registrationFormPage.selectNatureOfSite(regData.siteType, regData.hospitalType);
    await registrationFormPage.fillPrincipalInvsetigatorInfo(regData.principalInvestigator.name, regData.principalInvestigator.email);
    await registrationFormPage.fillPrimaryContactDetails(regData.primaryContact.name, regData.primaryContact.email);
    await registrationFormPage.fillPhysicalAddress(
      regData.physicalAddress.street,
      regData.physicalAddress.zip,
      regData.physicalAddress.city,
      regData.physicalAddress.state,
      regData.physicalAddress.telephone,
      regData.physicalAddress.fax
    );
    await registrationFormPage.selectSiteMailAddressSameAsPhysicalAddress(regData.mailAddressSameAsPhysical, regData.siteType);
    await registrationFormPage.fillPatientPopulationEnrollmentDetails(regData.patientPopulationEnrollment);
    await registrationFormPage.fillCharacteristicsDetails(regData.characteristics);
    if (regData.imagingFacility) {
      await registrationFormPage.fillImagingFacilityDetails(regData.imagingFacility.name, regData.imagingFacility.type);
    }
    await registrationFormPage.saveAndSubmitForm();
    // Validate confirmation message
    await registrationFormPage.verifySuccessMessageAndClosePopup('Thank you for your interest in ALZ-NET! We will review your submission and');
  });

  test.describe('Negative and edge login scenarios', () => {
    for (const scenario of [
      ...loginTestData.filter((d: any) => d.expected.success === false)
    ]) {
      test(`should not login for scenario: ${scenario.id} - ${scenario.description}`, async ({ page }) => {
        // Attempt login
        await loginPage.login(scenario.username, scenario.password);
        // Expect error message or failed login
        // Optionally, add assertion for error message if exposed via page object
        // Example: await loginPage.verifyErrorMessage(scenario.expected.errorMessage);
        // For now, just check that home page is not reached
        await expect(page).not.toHaveURL(/home/);
      });
    }
  });

  test.describe('Edge/case sensitivity login scenarios', () => {
    for (const scenario of loginTestData.filter((d: any) => d.id.startsWith('EDG-') || d.id.startsWith('CS-'))) {
      test(`should handle edge/case scenario: ${scenario.id} - ${scenario.description}`, async ({ page }) => {
        await loginPage.login(scenario.username, scenario.password);
        if (scenario.expected.success) {
          await expect(page).toHaveURL(/home/);
        } else {
          await expect(page).not.toHaveURL(/home/);
        }
      });
    }
  });
});
