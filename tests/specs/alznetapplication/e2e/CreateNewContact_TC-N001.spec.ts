import { test, expect } from "@utils/pageFixture.js";
import testData from "@data/Staging/alznetapplication/e2e/contact-create-data.json";
import { LoginPage } from "@/pages/login.page.js";
import { ContactsPage } from "@/pages/contacts.page.js";

// TC-N001: Create a new contact
test.describe("TC-N001: Create a new contact", () => {
  test("should create a new contact with valid inputs and display a success message", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const contactsPage = new ContactsPage(page);

    await test.step("Login to CRM system", async () => {
      await loginPage.goto(testData.baseUrl || "/login");
      await loginPage.login(testData.loginUsername, testData.loginPassword);
      // Optionally, verify landing page or dashboard is visible
      await expect(page).toHaveURL(/dashboard|home|contacts/, {
        message: "User should be redirected to dashboard/home/contacts after login"
      });
    });

    await test.step("Navigate to Contacts page", async () => {
      await contactsPage.openContacts();
      await expect(page.getByRole('heading', { name: /Contacts/i })).toBeVisible({
        timeout: 5000
      });
    });

    await test.step("Open create contact form", async () => {
      await contactsPage.clickCreateContact();
      await expect(page.getByRole('heading', { name: /Create Contact/i })).toBeVisible({
        timeout: 5000
      });
    });

    await test.step("Fill in new contact details", async () => {
      const { firstName, lastName, phone, company, email } = testData.contact;
      await contactsPage.fillContactForm({
        firstName,
        lastName,
        phone,
        company,
        email
      });
    });

    await test.step("Save the new contact", async () => {
      await contactsPage.saveContact();
      // Wait for either a success message or the contact to appear in the list
      const successMsg = page.getByText(/Contact created successfully|Contact saved|successfully created/i);
      await expect(successMsg).toBeVisible({
        timeout: 7000
      });
    });

    await test.step("Verify new contact appears in the contact list", async () => {
      // Optionally, search/filter for the contact and validate presence
      const { firstName, lastName } = testData.contact;
      await contactsPage.searchContactByName(`${firstName} ${lastName}`);
      const contactRow = page.getByRole('row', { name: new RegExp(`${firstName}.*${lastName}`, 'i') });
      await expect(contactRow).toBeVisible({
        timeout: 5000,
        message: `Newly created contact ${firstName} ${lastName} should appear in the contact list.`
      });
    });
  });
});
