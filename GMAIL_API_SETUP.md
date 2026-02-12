Gmail API setup
================

1. Create OAuth2 credentials in Google Cloud Console
   - Go to https://console.cloud.google.com/apis/credentials
   - Create an OAuth 2.0 Client ID (Application type: Desktop)
   - Download the JSON and save it as `credentials.json` in the repository root

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the token generator (one-time)

   ```bash
   npx ts-node scripts/get-gmail-token.ts
   ```

   - The script will print an authorization URL. Open it, grant access to the Gmail account you will use for tests, then paste the returned code into the prompt.
   - The script saves `token.json` in the project root.

4. Environment and usage
   - By default the helper looks for `credentials.json` and `token.json` in the project root.
   - You can set `GMAIL_CREDENTIALS` and `GMAIL_TOKEN` env vars to provide alternate paths.

5. CI notes
   - For CI, prefer a service account or a pre-generated `token.json` securely stored in your secrets manager. Do not commit tokens or credentials into source control.
