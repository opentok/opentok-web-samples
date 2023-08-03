require('dotenv').config();
const express = require('express');
const OpenTok = require('opentok');

const app = express();
const port = 3010;
const path = require('path');

app.use(express.static('static'));

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// Verify that the API Key and API Secret are defined
if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

const opentok = new OpenTok(apiKey, apiSecret);

// Create a session and store session ID in the express app
const sessionOptions = {
  mediaMode: 'routed',
  e2ee: 'true', // enable end-to-end media encryption
};

opentok.createSession(sessionOptions, (err, session) => {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  // We will wait on starting the app until this is done
  init();
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});

app.get('/session', async (req, res) => {
  console.log('/session');
  const sessionId = app.get('sessionId');
  const token = opentok.generateToken(sessionId);
  res.setHeader('Content-Type', 'application/json');
  res.send({
    apiKey,
    sessionId,
    token,
  });
});

function init() {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}
