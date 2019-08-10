/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;
var publisher;

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}


function toggleStyle(button) { // toggles button css class
  button.classList.toggle('toggle-button-on');
  button.classList.toggle('toggle-button-off');
}

function toggleMicrophone() {
  if (publisher.session) publisher.publishAudio(!publisher.stream.hasAudio);
  const microphoneToggle = document.getElementById('microphone-toggle');
  toggleStyle(microphoneToggle);
}

function toggleCamera() {
  if (publisher.session) publisher.publishVideo(!publisher.stream.hasVideo);
  const cameraToggle = document.getElementById('camera-toggle');
  toggleStyle(cameraToggle);
}

function setButtons(on) {
  const buttons = [document.getElementById('microphone-toggle'), document.getElementById('camera-toggle')];
  buttons.forEach(button => {
    if (on) {
      button.classList.remove('toggle-button-off');
      button.classList.add('toggle-button-on');
    } else {
      button.classList.remove('toggle-button-on');
      button.classList.add('toggle-button-off');
    }
  });
}

function initializeSession() {
  const session = OT.initSession(apiKey, sessionId);

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

  // If you disconnect from a call, overrride the default behaviour.
  publisher.on('streamDestroyed', function (event) {
    if (session.connection === null || event.stream.connection.connectionId === session.connection.connectionId) {
      event.preventDefault();
    }
  });

  // Connect to the session
  session.connect(token, function (error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });

  document.getElementById('camera-toggle').addEventListener('click', toggleCamera);
  document.getElementById('microphone-toggle').addEventListener('click', toggleMicrophone);

  function callOrHangup() {
    var calling = true;
    if (session.connection) {
      session.unpublish(publisher);
      session.disconnect();
      calling = false;
    } else {
      session.connect(token, function (error) {
        if (error) {
          handleError(error);
        } else {
          session.publish(publisher, handleError);
        }
      });
    }
    setButtons(calling);
    toggleStyle(document.getElementById('call'));
  }

  document.getElementById('call').addEventListener('click', callOrHangup);

  // OPTIONAL - Disconnect on hangup
  /*
  session.on('streamDestroyed', function() {
    if (session.connection) session.disconnect();
    setButtons(false)
    toggleCall();
  });
  */
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
