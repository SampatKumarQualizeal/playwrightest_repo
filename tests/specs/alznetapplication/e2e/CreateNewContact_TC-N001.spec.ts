import { test, expect } from "@utils/pageFixture.js";
import { ENV } from "@/config/env.js";
import LoginPage from "@pages/login.page.js";
import ContactsPage from "@pages/contacts.page.js";
import testData from "@data/Staging/alznetapplication/e2e/TC-N001.json";

// TC-N001: Create a new contact
// Objective: Verify system accepts valid inputs and displays appropriate message.

test.describe("TC-N001: Create a new contact", () => {
  test("Should allow user to create a new contact with valid data and show success message", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const contactsPage = new ContactsPage(page);

    await test.step("Navigate to application and login", async () => {
      await loginPage.goto(ENV.BASE_URL);
      await loginPage.login(testData.userName, testData.password);
      // Optionally, verify login success (e.g., dashboard/home visible)
      // await expect(page).toHaveURL(/dashboard|home/);
    });

    await test.step("Navigate to Contacts and open Create Contact screen", async () => {
      await contactsPage.gotoContacts();
      await contactsPage.openCreateContact();
      // Optionally, verify Create Contact form is visible
      await expect(contactsPage.createContactForm).toBeVisible();
    });

    await test.step("Fill in contact details from test data", async () => {
      await contactsPage.fillContactForm({
        firstName: testData.firstName,
        lastName: testData.lastName,
        phone: testData.phone,
        company: testData.company,
        email: testData.email
      });
    });

    await test.step("Save the contact", async () => {
      await contactsPage.saveContact();
    });

    await test.step("Verify success message is displayed", async () => {
      await expect(contactsPage.successToast).toBeVisible();
      await expect(contactsPage.successToast).toContainText(
        testData.expectedSuccessMessage || "Contact created successfully"
      );
    });
  });
});
