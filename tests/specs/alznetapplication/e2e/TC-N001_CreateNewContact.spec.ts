import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import testData from "@data/Staging/alznetapplication/e2e/TC-N001.json";
import { Logger } from "@/logger/logger.js";

const logger = Logger.getInstance();

/**
 * TC-N001: Create a new contact
 * Objective: Verify system accepts valid inputs and displays appropriate message.
 * Preconditions: User is logged into the CRM system and navigates to the contact creation screen.
 * Steps:
 *   1. Enter valid data for userName and Password to do login.
 *   2. Enter valid data in firstName, lastName, Phone Number, Company, and valid email format.
 *   3. Click the 'Save' button.
 * Expected Result: System displays appropriate message. New contact is saved in the CRM system.
 */
test.describe("TC-N001: Create a new contact", () => {
  test("should create a new contact and display success message", async ({ page, loginPage, contactsPage }) => {
    logger.info("Starting TC-N001: Create a new contact", { testCaseId: "TC-N001" });
    try {
      // Step 1: Launch the CRM application
      await test.step("Navigate to CRM login page", async () => {
        logger.info("Navigating to CRM login page", { url: ENV.BASE_URL });
        await loginPage.goto(ENV.BASE_URL);
      });

      // Step 2: Login with valid credentials
      await test.step("Login with valid credentials", async () => {
        logger.info("Logging in", { username: testData.userName });
        await loginPage.login(testData.userName, testData.password);
        logger.info("Login successful", { username: testData.userName });
      });

      // Step 3: Navigate to Contacts module
      await test.step("Navigate to Contacts module", async () => {
        logger.info("Navigating to Contacts module");
        await contactsPage.gotoContacts();
        logger.info("Contacts module loaded");
      });

      // Step 4: Initiate new contact creation
      await test.step("Initiate new contact creation", async () => {
        logger.info("Clicking Create New Contact");
        await contactsPage.clickCreateContact();
        logger.info("Contact creation form displayed");
      });

      // Step 5: Fill in contact details
      await test.step("Fill in contact details", async () => {
        logger.info("Filling contact details", {
          firstName: testData.firstName,
          lastName: testData.lastName,
          phone: testData.phoneNumber,
          company: testData.company,
          email: testData.email
        });
        await contactsPage.fillContactForm({
          firstName: testData.firstName,
          lastName: testData.lastName,
          phoneNumber: testData.phoneNumber,
          company: testData.company,
          email: testData.email
        });
        logger.info("Contact details filled");
      });

      // Step 6: Save the new contact
      await test.step("Save the new contact", async () => {
        logger.info("Clicking Save button");
        await contactsPage.saveContact();
        logger.info("Save button clicked");
      });

      // Step 7: Assert success message
      await test.step("Assert success message is displayed", async () => {
        logger.info("Verifying success message");
        const successMessage = await contactsPage.getSuccessMessage();
        logger.info("Success message received", { message: successMessage });
        expect(successMessage).toContain(testData.expectedSuccessMessage);
      });

      logger.info("TC-N001 completed successfully", { testCaseId: "TC-N001" });
    } catch (error) {
      logger.error("Test execution failed for TC-N001", { error });
      throw error;
    }
  });
});
