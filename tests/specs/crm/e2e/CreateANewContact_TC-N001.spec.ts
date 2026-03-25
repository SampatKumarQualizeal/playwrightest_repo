import { test, expect } from "@utils/pageFixture.js";
import { Logger } from "@/logger/logger.js";
import { ENV } from "@/config/env.js";
import testData from "@data/TC-N001.json";

/**
 * TC-N001: Create a new contact
 * Objective: Verify system accepts valid inputs and displays appropriate message.
 * Preconditions: User is logged into the CRM system and navigates to the contact creation screen.
 * Post-conditions: New contact is saved in the CRM system.
 * Priority: Medium
 */

test.describe("CRM - Create a New Contact [TC-N001]", () => {
  test("should create a new contact with valid data and display a success message", async ({ loginPage, contactsListPage }) => {
    const logger = Logger.child({ testCase: "TC-N001" });
    try {
      await test.step("Login to CRM application", async () => {
        logger.info("Starting login step", { step: "login", user: "<hidden>" });
        await loginPage.goto(ENV.crmUrl);
        await loginPage.login(testData.userName, testData.password);
        // Synchronization: Wait for navigation and dashboard element
        await loginPage.page.waitForLoadState('networkidle');
        await loginPage.verifyLoginSuccess();
        logger.info("Login successful", { step: "login" });
      });

      await test.step("Navigate to Contacts List", async () => {
        logger.info("Navigating to Contacts List", { step: "navigateContacts" });
        await contactsListPage.navigateToContacts();
        // Synchronization: Wait for contacts list to be visible
        await contactsListPage.waitForContactsList();
        logger.info("Contacts List loaded", { step: "navigateContacts" });
      });

      await test.step("Open Create Contact Form", async () => {
        logger.info("Opening Create Contact form", { step: "openCreateContact" });
        await contactsListPage.openCreateContactForm();
        // Synchronization: Wait for the form to be visible
        await contactsListPage.waitForCreateContactForm();
        logger.info("Create Contact form is visible", { step: "openCreateContact" });
      });

      await test.step("Fill in Contact Details and Save", async () => {
        logger.info("Filling contact details", { step: "fillContactDetails" });
        await contactsListPage.fillContactForm({
          firstName: testData.firstName,
          lastName: testData.lastName,
          phone: testData.phone,
          company: testData.company,
          email: testData.email
        });
        logger.info("Contact details filled", { step: "fillContactDetails" });
        logger.info("Saving new contact", { step: "saveContact" });
        const [saveResponse] = await Promise.all([
          contactsListPage.page.waitForResponse(resp => resp.url().includes('/contacts') && resp.status() === 200),
          contactsListPage.saveContact()
        ]);
        logger.info("Save contact API response received", { step: "saveContact", status: saveResponse.status() });
        // Synchronization: Wait for success message
        await contactsListPage.waitForSubmissionMessage();
        logger.info("Submission message appeared", { step: "saveContact" });
      });

      await test.step("Verify Success Message", async () => {
        logger.info("Verifying submission message", { step: "verifySuccessMessage" });
        const actualMessage = await contactsListPage.getSubmissionMessage();
        expect(actualMessage).toContain(testData.expectedSuccessMessage);
        logger.info("Success message verified", { step: "verifySuccessMessage", actualMessage });
      });
      logger.info("Test passed: Contact created successfully", { testCase: "TC-N001" });
    } catch (error) {
      logger.error("Test failed", {
        testCase: "TC-N001",
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  });
});
