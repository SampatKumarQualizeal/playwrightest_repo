import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import loginTestData from "@data/Staging/alznetapplication/smoke/ALZ-T134.json";
import siteRegistrationData from "@data/Staging/alznetapplication/e2e/site-registration-form-data.json";

/**
 * TC_001: Verify user can login successfully and register a site
 * Steps:
 * 1. Launch login URL and verify login page is displayed
 * 2. Login with credentials from test data and verify navigation to Home
 * 3. Initiate site registration via HomePage
 * 4. Fill all mandatory fields in the registration form using data from test data
 * 5. Submit the form and verify confirmation message
 * 6. Assert user lands on the registration confirmation page
 */
test.describe("TC_001: Verify user can login and register a site", () => {
  test("User can login and register a site with confirmation", async ({ pageObjects }) => {
    const { LoginPage, HomePage, RegistrationFormPage } = pageObjects;
    const loginUrl = "https://alznetapp-uat.acr.org/login";
    const credentials = loginTestData.registration;
    const registrationData = siteRegistrationData;

    // Step 1: Launch login URL and verify login page is displayed
    await LoginPage.goto(loginUrl);
    await LoginPage.verifyLoginPageContent();

    // Step 2: Login with credentials and verify navigation to Home
    await LoginPage.login(credentials.email, credentials.password);
    await HomePage.verifylandingPageElements();
    await expect(pageObjects.page).toHaveURL(/home/);

    // Step 3: Initiate site registration via HomePage
    await test.step('Click "Register My Site" and verify registration form is displayed', async () => {
      await HomePage.clickAccessMySiteAndVerify(registrationData.siteName);
      await RegistrationFormPage.verifyRegisterSiteFormText(
        registrationData.registrationFormText.thankYouText,
        registrationData.registrationFormText.pleaseNoteText,
        registrationData.registrationFormText.instructionsText
      );
    });

    // Step 4: Fill all mandatory fields in the registration form
    await test.step('Fill all mandatory fields in the registration form', async () => {
      await RegistrationFormPage.fillSiteName(registrationData.siteName);
      await RegistrationFormPage.selectNatureOfSite(registrationData.siteType, registrationData.hospitalType);
      await RegistrationFormPage.fillPrincipalInvsetigatorInfo(
        registrationData.additionalFields["principal-investigator"],
        registrationData.contactEmail
      );
      await RegistrationFormPage.fillPrimaryContactDetails(
        registrationData.additionalFields["primary-contact-name"],
        registrationData.contactEmail
      );
      await RegistrationFormPage.fillPhysicalAddress(
        registrationData.physicalAddressStreet,
        registrationData.physicalAddressZip,
        registrationData.physicalAddressCity,
        registrationData.physicalAddressState,
        registrationData.physicalAddressTelephone,
        registrationData.physicalAddressFax
      );
      await RegistrationFormPage.selectSiteMailAddressSameAsPhysicalAddress(
        registrationData.additionalFields["site-mail-address-same-as-physical-address"],
        registrationData.siteType
      );
      await RegistrationFormPage.fillPatientPopulationEnrollmentDetails(registrationData.patientPopulation);
      await RegistrationFormPage.fillCharacteristicsDetails(registrationData.additionalFields);
      await RegistrationFormPage.fillImagingFacilityDetails(
        registrationData.imagingFacilityName,
        registrationData.additionalFields["type-of-imaging-facility"]
      );
    });

    // Step 5: Submit the form and verify confirmation message
    await test.step('Submit the registration form and verify confirmation message', async () => {
      await RegistrationFormPage.saveAndSubmitForm();
      const successMessage = await RegistrationFormPage.getSubmissionSuccessMessage();
      expect(successMessage).toContain("Thank you for registering your site");
    });

    // Step 6: Assert user lands on the registration confirmation page
    await test.step('Verify user lands on registration confirmation page', async () => {
      await RegistrationFormPage.verifySubmittedStatus(registrationData.SubmittedStatus);
      // Optionally, verify assigned site ID or confirmation text
      const assignedSiteId = await RegistrationFormPage.getAssignedSiteId();
      expect(assignedSiteId).not.toBeNull();
    });
  });
});
