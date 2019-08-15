/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;
let screenPublisher;
let session;
let publisher;
let canPublish = false;
// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}


function toggleScreen() {
  // If the screen publisher is connected to the session, unpublish screen and re-publish camera footage
  if (screenPublisher.session) {
    session.unpublish(screenPublisher);
    session.publish(publisher, handleError);
    document.getElementById('publishScreen').classList.remove('toggle-button-on');
    document.getElementById('publishScreen').classList.add('toggle-button-off');
  // Else, if the camera publisher is connected to the session, unpublish camera footage and re-publish screen
  } else if (publisher.session) {
    session.unpublish(publisher);
    if (canPublish) {
      session.publish(screenPublisher, handleError);
    }
    document.getElementById('publishScreen').classList.add('toggle-button-on');
    document.getElementById('publishScreen').classList.remove('toggle-button-off');
  }
}

function preventDefaults() {
  // If a stream is destroyed BY THIS CLIENT's publishers override default behaviour.
  publisher.on('streamDestroyed', function (event) {
    if (event.stream.connection.connectionId === session.connection.connectionId) {
      event.preventDefault();
    }
  });

  screenPublisher.on('streamDestroyed', function (event) {
    if (event.stream.connection.connectionId === session.connection.connectionId) {
      event.preventDefault();
    }
  });
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function (event) {
    session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  });
  // Create a publisher
  publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Check whether screen sharing is possible. If possible, initialize screen sharing publisher
  OT.checkScreenSharingCapability(function (response) {
    if (!response.supported || response.extensionRegistered === false) {
      alert('screen sharing not supported');
    } else if (response.extensionInstalled === false) {
      alert('screen sharing extension required, please install one to share your screen');
    } else {
      canPublish = true;
      screenPublisher = OT.initPublisher('screen', {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        videoSource: 'screen'
      }, handleError);
    }
  });

  preventDefaults();

  // Connect to the session
  session.connect(token, function (error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });

  // When the publish screen button is pressed, call toggleScreen
  document.getElementById('publishScreen').addEventListener('click', toggleScreen);
}

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;

    initializeSession();
  }).catch(function catchErr(error) {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
