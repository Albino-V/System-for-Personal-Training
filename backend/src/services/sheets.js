const { google } = require('googleapis');

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function appendCheckin(clientName, clientId, timestamp) {
  if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    console.log('[Sheets] Skipped — no credentials configured.');
    return;
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const date = new Date(timestamp);
  const row = [
    date.toLocaleDateString('en-US'),
    date.toLocaleTimeString('en-US'),
    clientName,
    clientId,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A:D',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

module.exports = { appendCheckin };
