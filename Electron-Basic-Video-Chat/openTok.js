const OT = require('@opentok/client');

// Set Credentials
const API_KEY = '';
const SESSION_ID = '';
const TOKEN = '';
const SAMPLE_SERVER_BASE_URL = 'http://YOUR-SERVER-URL';


const initializeSession = (apiKey, sessionId, token) => {
  // Initialize Session
  const session = OT.initSession(apiKey, sessionId);

  // Set session event listeners
  session.on({
    streamCreated: (event) => {
      session.subscribe(event.stream, 'subscriber', (error) => {
        if (error) {
          console.log(`There was an issue subscribing to the stream: ${error}`);
        }
      });
    },
    streamDestroyed: (event) => {
      console.log(`Stream with name ${event.stream.name} ended because of reason: ${event.reason}`);
    }
  });

  // Connect to the session
  session.connect(token, (error) => {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      console.log(`There was an error connecting to session: ${error}`);
      return;
    }
    // Create a publisher
    const publisher = OT.initPublisher('publisher', (initError) => {
      if (initError) {
        console.log(`There was an error initializing the publisher: ${initError}`);
      }
    });
    session.publish(publisher, (pubError) => {
      if (pubError) {
        console.log(`There was an error when trying to publish: ${pubError}`);
      }
    });
  });
};

if (API_KEY && SESSION_ID && TOKEN) {
  initializeSession(API_KEY, SESSION_ID, TOKEN);
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    initializeSession(json.apiKey, json.sessionId, json.token);
  }).catch(function catchErr(error) {
    console.error(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the values in openTok.js');
  });
}
