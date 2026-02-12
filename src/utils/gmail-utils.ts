import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

async function loadJson(filePath: string) {
  const raw = await fs.readFile(filePath, { encoding: 'utf-8' });
  return JSON.parse(raw);
}

async function authorize(credentialsPath: string, tokenPath: string) {
  const creds = await loadJson(credentialsPath);
  const { client_secret, client_id, redirect_uris } = creds.installed || creds.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const token = await loadJson(tokenPath);
    oAuth2Client.setCredentials(token);
  } catch (err) {
    throw new Error(`Gmail token not found at ${tokenPath}. Run the setup script to create it.`);
  }

  return oAuth2Client;
}

function headersToMap(headers: Array<{ name: string; value: string }>) {
  const map: Record<string, string> = {};
  headers.forEach((h) => (map[h.name.toLowerCase()] = h.value));
  return map;
}

async function getMessage(gmail: any, userId: string, id: string) {
  const res = await gmail.users.messages.get({ userId, id, format: 'full' });
  return res.data;
}

function extractEmailBody(msg: any): string {
  try {
    // Helper: decode base64/url-safe base64
    const decode = (input: string) => {
      if (!input) return '';
      // Google may return URL-safe base64
      let s = input.replace(/-/g, '+').replace(/_/g, '/');
      // Pad with '='
      while (s.length % 4) s += '=';
      return Buffer.from(s, 'base64').toString('utf-8');
    };

    // Prefer text/plain parts
    const parts = msg.payload.parts || [];
    for (const part of parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decode(part.body.data);
      }
    }

    // If only HTML part exists, decode and strip tags
    for (const part of parts) {
      if ((part.mimeType === 'text/html' || part.mimeType === 'text/html; charset=utf-8') && part.body?.data) {
        const html = decode(part.body.data);
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    // Check for body in main payload (simple emails)
    if (msg.payload.body?.data) {
      return decode(msg.payload.body.data);
    }

    // Fallback to snippet
    return msg.snippet || '';
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Error extracting email body:', err);
    return msg.snippet || '';
  }
}

export const GmailUtils = {
  /**
   * Poll Gmail for an email sent to `to` whose subject matches `subjectRegex`.
   * Returns the message object if found within timeout, otherwise null.
   */
  waitForEmail: async ({
    to,
    subjectRegex,
    timeoutMs = 180000,
    pollInterval = 5000,
    credentialsPath = 'credentials.json',
    tokenPath = 'token.json',
  }: {
    to: string;
    subjectRegex: RegExp;
    timeoutMs?: number;
    pollInterval?: number;
    credentialsPath?: string;
    tokenPath?: string;
  }) => {
    const absCredPath = path.isAbsolute(credentialsPath) ? credentialsPath : path.join(process.cwd(), credentialsPath);
    const absTokenPath = path.isAbsolute(tokenPath) ? tokenPath : path.join(process.cwd(), tokenPath);

    const auth = await authorize(absCredPath, absTokenPath);
    const gmail = google.gmail({ version: 'v1', auth });
    const userId = 'me';

    const start = Date.now();
    let pollCount = 0;
    while (Date.now() - start < timeoutMs) {
      pollCount++;
      try {
        // Query by recipient to narrow results, then log all found
        const q = `to:${to}`;
        const listRes = await gmail.users.messages.list({ userId, q, maxResults: 10 });
        const messages = listRes.data.messages || [];

        // eslint-disable-next-line no-console
        console.log(`[Gmail Poll #${pollCount}] Found ${messages.length} message(s) for to:${to}`);

        for (const m of messages) {
          const msg = await getMessage(gmail, userId, m.id!);
          const headers = headersToMap(msg.payload.headers || []);
          const subject = headers['subject'] || '';
          const from = headers['from'] || '';
          // eslint-disable-next-line no-console
          console.log(`  [msg ${m.id}] subject: "${subject}" | from: "${from}"`);
          if (subjectRegex.test(subject)) {
            // eslint-disable-next-line no-console
            console.log(`  ✓ Subject matches regex: ${subjectRegex.source}`);
            const body = extractEmailBody(msg);
            return { id: m.id, subject, from, snippet: msg.snippet, body, raw: msg };
          }
        }
      } catch (err) {
        // Continue polling; transient errors are acceptable
        // eslint-disable-next-line no-console
        console.warn('GmailUtils polling error:', err);
      }

      await new Promise((r) => setTimeout(r, pollInterval));
    }

    // eslint-disable-next-line no-console
    console.warn(`[Gmail timeout] No email matching ${subjectRegex.source} found for ${to} after ${pollCount} polls`);
    return null;
  },
};

export default GmailUtils;
