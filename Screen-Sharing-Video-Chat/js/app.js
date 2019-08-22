/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;
var screenPublisher;
var screenSubscriber;
var session;
var cameraPublisher;
var cameraSubscriber;
var elements = {'screen-subscriber' : document.getElementById('screen-subscriber'), 'camera-subscriber' : document.getElementById('camera-subscriber'), 'screen-publisher' : document.getElementById('screen-publisher')}

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
  //alert('aaaaa');
  console.log("classlist for screen-subscriber")
  if (screenSubscriber && screenSubscriber.stream) {
    elements['screen-subscriber'].classList.add('big-subscriber')
    //alert('bbbbb');
  } else if (screenPublisher && screenPublisher.session) {
    elements['screen-publisher'].classList.add('big-subscriber')
    //alert('ccccc');
  } else if (cameraSubscriber && cameraSubscriber.stream) {
    elements['camera-subscriber'].classList.add('big-subscriber')
    //alert('ddddd');
  }

  if (screenPublisher && screenPublisher.session && !(elements['screen-publisher'].classList.contains('big-subscriber'))) {
    elements['screen-publisher'].classList.add('small-screen')
  }

  if (cameraSubscriber && cameraSubscriber.session && !(elements['camera-subscriber'].classList.contains('big-subscriber'))) {
    elements['camera-subscriber'].classList.add('small-camera')
  }
}

function toggleScreen() {
  var screenSharing = document.getElementById('screen-sharing');
  // If the screen publisher is connected to the session, unpublish screen
  if (screenPublisher && screenPublisher.session) {
    screenPublisher.destroy();
    screenSharing.classList.remove('toggle-button-on');
    screenSharing.classList.add('toggle-button-off');

  // Else, check whether screen sharing is possible. If possible, initialize screen sharing publisher
  } else if (cameraPublisher.session) {
    OT.checkScreenSharingCapability(function checkScreenSharingCapability(response) {
    if (!response.supported || response.extensionRegistered === false) {
      alert('screen sharing not supported');
    } else if (response.extensionInstalled === false) {
      alert('screen sharing extension required, please install one to share your screen');
    } else {
      screenPublisher = OT.initPublisher('screen-publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        videoSource: 'screen'
      }, handleError);
      if (session && session.connection) {
        session.publish(screenPublisher,handleError)
      }
    }
  });
    screenSharing.classList.add('toggle-button-on');
    screenSharing.classList.remove('toggle-button-off');
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
    }
  });

  // When the publish screen button is pressed, call toggleScreen
  document.getElementById('screen-sharing').addEventListener('click', toggleScreen);
  
  ['screen-subscriber','screen-publisher'].forEach(element => document.getElementById(element).addEventListener('click', () => switchWithBig(document.getElementById(element))));

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
