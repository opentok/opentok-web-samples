/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;
var screenPublisher;
var session;
var cameraPublisher;
var screenSharingButton = document.getElementById('screen-sharing');
var options = {
  insertMode: 'append',
  width: '100%',
  height: '100%'
};

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function toggleScreen() {
  // If the screen publisher is connected to the session, destroy the screen sharing publisher
  if (screenPublisher && screenPublisher.session) {
    screenPublisher.destroy();
    screenSharingButton.innerHTML = 'Share Screen';
  // Else, check whether screen sharing is possible. If possible, initialize a new screen sharing publisher (allows the user to stream a different widow everytime)
  } else {
    screenSharingButton.disabled = true;
    screenPublisher = OT.initPublisher('screen-publisher', {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      videoSource: 'screen'
    }, function handleInitScreenPublisherError(error) {
      screenSharingButton.disabled = false;
      if (error) {
        handleError(error);
        screenSharingButton.innerHTML = 'Share Screen';
      } else {
        screenSharingButton.innerHTML = 'Stop Sharing Screen';
      }
    });
    if (session && session.connection) {
      session.publish(screenPublisher, handleError);
    }
  }
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    if (event.stream.videoType === 'camera') {
      session.subscribe(event.stream, 'camera-subscriber', options, handleError);
      document.getElementById('camera-subscriber').style.display = 'block';
    } else { // The videoType is either 'screen' or 'custom'
      session.subscribe(event.stream, 'screen-subscriber', options, handleError);
      document.getElementById('screen-subscriber').style.display = 'block';
    }
  });

  // Create a publisher
  cameraPublisher = OT.initPublisher('camera-publisher', options, handleError);

  // Connect to the session
  session.connect(token, function callback(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(cameraPublisher, handleError);

      screenSharingButton.disabled = false;

      // When the publish screen button is pressed, call toggleScreen
      screenSharingButton.addEventListener('click', toggleScreen);
    }
  });

  // Check whether screen sharing is possible. If possible, display the Share Screen button
  OT.checkScreenSharingCapability(function checkScreenSharingCapability(response) {
    if (!response.supported || response.extensionRegistered === false) {
      alert('screen sharing not supported');
    } else if (response.extensionInstalled === false) {
      alert('screen sharing extension required, please install one to share your screen');
    } else {
      screenSharingButton.style.display = 'block';
    }
  });
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
