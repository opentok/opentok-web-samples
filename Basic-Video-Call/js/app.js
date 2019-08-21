/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;
let publisher;
let subscriber;
let subscribedToAudio;
let subscribedToVideo;

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function setVolume() {
  if (subscriber && subscriber.session) {
    subscriber.setAudioVolume(Number(document.getElementById('volume').value));
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

function toggleAudio() {
  subscribedToAudio = !subscribedToAudio;
  if (subscriber && subscriber.session) subscriber.subscribeToAudio(subscribedToAudio);
  const audioToggle = document.getElementById('audio-toggle');
  toggleStyle(audioToggle);
}

function toggleVideo() {
  subscribedToVideo = !subscribedToVideo;
  if (subscriber && subscriber.session) subscriber.subscribeToVideo(subscribedToVideo);
  const videoToggle = document.getElementById('video-toggle');
  toggleStyle(videoToggle);
}

function setButtons(on, buttons) {
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
  session.on('streamCreated', function subscribe(event) {
    subscriber = session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
    if (subscriber && subscriber.session) {
      subscribedToAudio = subscriber.stream.hasAudio;
      subscribedToVideo = subscriber.stream.hasVideo;
      console.log('set');
      setButtons(subscribedToAudio, [document.getElementById('audio-toggle')]);
      setButtons(subscribedToVideo, [document.getElementById('video-toggle')]);
    }
  });

  // Create a publisher
  publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // If you disconnect from a call, overrride the default behaviour.
  publisher.on('streamDestroyed', function preventSessionDefault(event) {
    if (session.connection === null || event.stream.connection.connectionId === session.connection.connectionId) {
      event.preventDefault();
    }
  });


  function callback(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  }

  // Connect to the session
  session.connect(token, callback);

  function callOrHangup() {
    if (session.connection) {
      session.unpublish(publisher);
      session.disconnect();
    } else {
      session.connect(token, callback);
    }
    setButtons(publisher.stream.hasVideo, [document.getElementById('camera-toggle')]);
    setButtons(publisher.stream.hasAudio, [document.getElementById('microphone-toggle')]);
    toggleStyle(document.getElementById('call'));
  }

  document.getElementById('camera-toggle').addEventListener('click', toggleCamera);
  document.getElementById('microphone-toggle').addEventListener('click', toggleMicrophone);

  document.getElementById('video-toggle').addEventListener('click', toggleVideo);
  document.getElementById('audio-toggle').addEventListener('click', toggleAudio);

  document.getElementById('call').addEventListener('click', callOrHangup);
  document.getElementById('cycle').addEventListener('click', () => publisher.cycleVideo());

  // 'input' and 'change' event so that the volume will change even WHILE dragging on all browsers.
  document.getElementById('volume').addEventListener('input', setVolume);
  document.getElementById('volume').addEventListener('change', setVolume);


  session.on('streamDestroyed', function disableSubscriberButtons() {
    setButtons(false, [document.getElementById('audio-toggle'), document.getElementById('video-toggle')]);
  });

  // OPTIONAL - Disconnect on hangup
  /*
  session.on('streamDestroyed', function dicsonnect() {
    if (session.connection) session.disconnect();
    setButtons(false, [document.getElementById('microphone-toggle'), document.getElementById('camera-toggle')]);
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
