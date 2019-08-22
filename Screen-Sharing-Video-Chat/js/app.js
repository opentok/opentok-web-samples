/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;
var screenPublisher;
var screenSubscriber;
var session;
var cameraPublisher;
var cameraSubscriber;
var screenSharingButton = document.getElementById('screen-sharing');
var elements = {'screen-subscriber': document.getElementById('screen-subscriber'), 'camera-subscriber': document.getElementById('camera-subscriber'), 'screen-publisher': document.getElementById('screen-publisher')};

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function switchWithBig(pressed) {
  if (!pressed.classList.contains('big-subscriber')) {
    Object.keys(elements).forEach(element => {
      if (elements[element].classList.contains('big-subscriber')) {
        elements[element].classList.remove('big-subscriber');
        if (element.startsWith('screen')) {
          elements[element].classList.add('small-screen');
        } else {
          elements[element].classList.add('small-camera');
        }
      }
    });
    pressed.classList.forEach(cls => pressed.classList.remove(cls));
    pressed.classList.add('big-subscriber');
  }
}

function rearrangeElements() {
  Object.keys(elements).forEach(element => elements[element].classList.forEach(cls => elements[element].classList.remove(cls)));
  if (screenSubscriber && screenSubscriber.stream) {
    elements['screen-subscriber'].classList.add('big-subscriber');
  } else if (screenPublisher && screenPublisher.session) {
    elements['screen-publisher'].classList.add('big-subscriber');
  } else if (cameraSubscriber && cameraSubscriber.stream) {
    elements['camera-subscriber'].classList.add('big-subscriber');
  }

  if (screenPublisher && screenPublisher.session && !(elements['screen-publisher'].classList.contains('big-subscriber'))) {
    elements['screen-publisher'].classList.add('small-screen');
  }

  if (cameraSubscriber && cameraSubscriber.session && !(elements['camera-subscriber'].classList.contains('big-subscriber'))) {
    elements['camera-subscriber'].classList.add('small-camera');
  }
}

function toggleScreen() {
  // If the screen publisher is connected to the session, destroy the screen sharing publisher
  if (screenPublisher && screenPublisher.session) {
    screenPublisher.destroy();
    screenSharingButton.classList.remove('toggle-button-on');
    screenSharingButton.classList.add('toggle-button-off');
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
    screenSharingButton.classList.add('toggle-button-on');
    screenSharingButton.classList.remove('toggle-button-off');
  }
  rearrangeElements();
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    if (event.stream.videoType === 'camera') {
      cameraSubscriber = session.subscribe(event.stream, 'camera-subscriber', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      }, handleError);
      cameraSubscriber.on('destroyed', rearrangeElements);
    } else { // The videoType is either 'screen' or 'custom'
      screenSubscriber = session.subscribe(event.stream, 'screen-subscriber', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      }, handleError);
      screenSubscriber.on('destroyed', rearrangeElements);
    }
    rearrangeElements();
  });

  // Create a publisher
  cameraPublisher = OT.initPublisher('camera-publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

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

  ['screen-subscriber', 'screen-publisher'].forEach(element => document.getElementById(element).addEventListener('click', () => switchWithBig(document.getElementById(element))));
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
