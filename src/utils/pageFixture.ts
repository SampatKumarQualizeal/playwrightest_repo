import { test as base, expect as baseExpect } from '@playwright/test';

// --- Page Object Imports ---- //
import { ExploreDataPage } from '@/pages/explore-data.page.js';
import { HomePage } from '@/pages/home.js';
import { LoginPage } from '@/pages/login.page.js';
import { RegistrationFormPage } from '@/pages/registration-form.page.js';
import { SiteFeasibilityRegistrationFormPage } from '@/pages/site-feasibility-registration-form.page.js';
import { SiteFeasibilityRegistrationPage } from '@/pages/site-feasibility-registration.page.js';
import { StaffListPage } from '@/pages/staff-list.page.js';
import { CaseListPage } from '@/pages/case-list.page.js';
import { ChangeRequestListPage } from '@/pages/change-request-list.page.js';
import { ContactsListPage } from '@/pages/contacts-list.page.js';

type pageObjects = {
  exploreDataPage: ExploreDataPage;
  homePage: HomePage;
  loginPage: LoginPage;
  registrationFormPage: RegistrationFormPage;
  siteFeasibilityFormPage: SiteFeasibilityRegistrationFormPage;
  siteFeasibilityPage: SiteFeasibilityRegistrationPage;
  staffListPage: StaffListPage;
  caseListPage: CaseListPage;
  changeRequestListPage: ChangeRequestListPage;
  contactsListPage: ContactsListPage;
};

// Test object export
export const test = base.extend<pageObjects>({
  exploreDataPage: async ({ page }, use) => {
    await use(new ExploreDataPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registrationFormPage: async ({ page }, use) => {
    await use(new RegistrationFormPage(page));
  },
  siteFeasibilityFormPage: async ({ page }, use) => {
    await use(new SiteFeasibilityRegistrationFormPage(page));
  },
  siteFeasibilityPage: async ({ page }, use) => {
    await use(new SiteFeasibilityRegistrationPage(page));
  },
  staffListPage: async ({ page }, use) => { // Add this block
    await use(new StaffListPage(page));
  },
  caseListPage: async ({ page }, use) => { // Add this block
    await use(new CaseListPage(page));
  },
  changeRequestListPage: async ({ page }, use) => { // Add this block
    await use(new ChangeRequestListPage(page));
  },
  contactsListPage: async ({ page }, use) => {
    await use(new ContactsListPage(page));
  },
});

// Expect function export
export const expect = baseExpect;
