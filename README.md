# ALZ-NET E2E Test Automation

This repository contains the end-to-end test automation suite for the ALZ-NET application. It is built using [Playwright](https://playwright.dev/) and TypeScript to ensure the application's quality and reliability.

## Features

- **Framework**: [Playwright](https://playwright.dev/) with TypeScript for modern, reliable, and fast end-to-end testing.
- **Design Pattern**: Utilizes the **Page Object Model (POM)** for maintainable and scalable test code.
- **Test Data**: Manages test data using a combination of static JSON files and dynamically generated data from [@faker-js/faker](https://fakerjs.dev/).
- **Reporting**: Generates comprehensive HTML reports for easy analysis of test results.
- **Configuration**: Manages environment-specific settings using `dotenv`.

## Project Structure

The project follows a standard structure for Playwright test automation:

```
acr-qmentis-alznet/
├── src/                      # Core framework files
│   ├── config/               # Environment configuration (e.g., env.ts)
│   ├── logger/               # Logging utilities
│   ├── pages/                # Page Object Models (POMs) for application pages
│   ├── reporting/            # Reporting configurations (e.g., Allure)
│   └── utils/                # Reusable utility functions
├── tests/                    # Test specifications (the actual test scripts)
│   └── specs/                # Spec files organized by application area
├── test-data/                # Static JSON data for tests, organized by environment
├── playwright-report/        # Stores generated HTML test reports after runs
├── test-results/             # Raw results and artifacts from test runs
├── .gitignore                # Specifies files to be ignored by Git
├── package.json              # Project dependencies and scripts
├── playwright.config.ts      # Playwright main configuration file
└── tsconfig.json             # TypeScript compiler options
```

## Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later is recommended)
- npm (comes bundled with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ACREnterprise/acr-qmentis-alznet.git
    cd acr-qmentis-alznet
    ```

2.  **Install project dependencies:**
    This command installs all the dependencies listed in `package.json`.
    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    This command downloads the browser binaries required by Playwright (Chromium, Firefox, WebKit).
    ```bash
    npx playwright install
    ```

## Running Tests

You can run the tests using the following commands.

### Run all tests

To execute the entire test suite in headless mode:
```bash
npx playwright test
```

### Run a specific test file

To run a single test file, provide the path to the spec file:
```bash
npx playwright test tests/specs/alznetapplication/CompleteAndSubmitRegistrationForm_ALZ-3_TCD_FT_02_FR-2.spec.ts
```

### Run tests in Headed Mode

To watch the tests execute in a live browser window, use the `--headed` flag:
```bash
npx playwright test --headed
```

### Run tests on a specific browser

To run tests against a specific browser (e.g., `chromium`, `firefox`, `webkit`):
```bash
npx playwright test --project=chromium
```

## Viewing Test Reports

After a test run is complete, an HTML report is automatically generated. To open the latest report, run:
```bash
npx playwright show-report
```
This will open a web page in your browser with a detailed summary of the test results.
