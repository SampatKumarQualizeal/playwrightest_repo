import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

async function loadJson(filePath: string) {
  const raw = await fs.readFile(filePath, { encoding: 'utf-8' });
  return JSON.parse(raw);
}

async function main() {
  const credentialsPath = path.join(process.cwd(), 'credentials.json');
  const tokenPath = path.join(process.cwd(), 'token.json');

  let creds;
  try {
    creds = await loadJson(credentialsPath);
  } catch (err) {
    console.error(`Missing credentials.json in project root. Create OAuth client credentials and save as ${credentialsPath}`);
    process.exit(1);
  }

  const { client_secret, client_id, redirect_uris } = creds.installed || creds.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });

  console.log('Authorize this app by visiting this url:', authUrl);

  // Allow passing the code as a CLI argument to support copy/paste
  const cliCode = process.argv[2];
  let code: string;
  if (cliCode && cliCode.length > 0) {
    code = cliCode.trim();
  } else {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = (q: string) => new Promise<string>((res) => rl.question(q, res));
    code = await question('Enter the code from that page here: ');
    rl.close();
  }

  const { tokens } = await oAuth2Client.getToken(code.trim());
  await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2), { encoding: 'utf-8' });
  console.log(`Token stored to ${tokenPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
