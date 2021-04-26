/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;
var publisher;
var subscriber;
var subscribedToAudio;
var subscribedToVideo;

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
  if (publisher && publisher.session) publisher.publishAudio(!publisher.stream.hasAudio);
  var microphoneToggle = document.getElementById('microphone-toggle');
  toggleStyle(microphoneToggle);
}

function toggleCamera() {
  if (publisher && publisher.session) publisher.publishVideo(!publisher.stream.hasVideo);
  var cameraToggle = document.getElementById('camera-toggle');
  toggleStyle(cameraToggle);
}

function toggleAudio() {
  subscribedToAudio = !subscribedToAudio;
  if (subscriber && subscriber.session) subscriber.subscribeToAudio(subscribedToAudio);
  var audioToggle = document.getElementById('audio-toggle');
  toggleStyle(audioToggle);
}

function toggleVideo() {
  subscribedToVideo = !subscribedToVideo;
  if (subscriber && subscriber.session) subscriber.subscribeToVideo(subscribedToVideo);
  var videoToggle = document.getElementById('video-toggle');
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
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function subscribe(event) {
    subscriber = session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);

    subscriber.on('connected', function enableSubscriberButtons() {
      subscribedToAudio = subscriber.stream.hasAudio;
      subscribedToVideo = subscriber.stream.hasVideo;
      setButtons(subscribedToAudio, [document.getElementById('audio-toggle')]);
      setButtons(subscribedToVideo, [document.getElementById('video-toggle')]);

      document.getElementById('audio-toggle').style.display = 'block';
      document.getElementById('video-toggle').style.display = 'block';
      document.getElementById('volume-range').style.display = 'block';
    });

    subscriber.on('disconnected destroyed', function hideSubscriberButtons() {
      setButtons(false, [document.getElementById('audio-toggle'), document.getElementById('video-toggle')]);
      document.getElementById('audio-toggle').style.display = 'none';
      document.getElementById('video-toggle').style.display = 'none';
      document.getElementById('volume-range').style.display = 'none';
    });
  });

  // Create a publisher
  publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);


  publisher.on('destroyed', function hidePublisherButtons() {
    setButtons(false, [document.getElementById('microphone-toggle'), document.getElementById('camera-toggle')]);
    document.getElementById('camera-toggle').style.display = 'none';
    document.getElementById('microphone-toggle').style.display = 'none';
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

  document.getElementById('camera-toggle').addEventListener('click', toggleCamera);
  document.getElementById('microphone-toggle').addEventListener('click', toggleMicrophone);

  document.getElementById('video-toggle').addEventListener('click', toggleVideo);
  document.getElementById('audio-toggle').addEventListener('click', toggleAudio);

  document.getElementById('cycle').addEventListener('click', () => publisher.cycleVideo());

  // 'input' and 'change' event so that the volume will change even WHILE dragging on all browsers.
  document.getElementById('volume').addEventListener('input', setVolume);
  document.getElementById('volume').addEventListener('change', setVolume);


  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
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
