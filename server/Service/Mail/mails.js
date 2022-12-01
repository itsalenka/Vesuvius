// const { google } = require('googleapis');
// const credentials = require('./credentials2.json');
//
// const { client_secret, client_id, redirect_uris } = credentials.installed;
// const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
//
// const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
//
// const url = oAuth2Client.generateAuthUrl({
//   access_type: 'offline',
//   prompt: 'consent',
//   scope: GMAIL_SCOPES,
// });
// console.log( url)
//
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const credentials = require('./credentials.json');

// Replace with the code you received from Google
const code = '4/0AfgeXvt7_QjXbqSbLtaN9AOn4Iw3J9_Ar2PK-GwV90Q1yWeJ4MkwyIskDTwme8M_3GdR4g';
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

oAuth2Client.getToken(code).then(({ tokens }) => {
    const tokenPath = path.join(__dirname, 'token.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));
    console.log('Access token and refresh token stored to token.json');
});