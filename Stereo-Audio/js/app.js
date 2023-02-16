/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

const publishButton = document.getElementById('publishButton');
const unpublishButton = document.getElementById('unpublishButton');
const panControls = document.getElementById('panControls');
const panValueLabel = document.getElementById('panValueLabel');
const panValueSlider = document.getElementById('panValueSlider');
const errorEl = document.getElementById('error');

let apiKey;
let sessionId;
let token;
let session;
let publisher;
let panner;

function handleError(error) {
  if (error) {
    console.error(error);
    errorEl.innerText = 'Error: ' + error.message;
  }
}

function initializeSession() {
  if (session && session.isConnected()) {
    session.disconnect();
  }
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
    publishButton.style.display = "none";
    unpublishButton.style.display = "none";
    panControls.style.display = "none";
  });

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, show publish button
      publishButton.style.display = "block";
    }
  });
}

function getAudioBuffer(url, audioContext) {
    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(audioData => new Promise((resolve, reject) => {
          audioContext.decodeAudioData(audioData, resolve, reject);
        }))
}

function setPanValue(value) {
  panner.pan.value = Number(value).toFixed(1);
  panValueLabel.innerText = value;
}

function createAudioStream(audioBuffer, audioContext) {
  const startTime = audioContext.currentTime;

  const player = audioContext.createBufferSource();
  player.buffer = audioBuffer;
  player.start(startTime);
  player.loop = true;

  const destination = audioContext.createMediaStreamDestination();

  // createStereoPanner available in Chrome 42+, Firefox 37+, Edge
  panner = audioContext.createStereoPanner();
  panner.pan.value = 0;
  panner.connect(destination);
  player.connect(panner);

  setPanValue(0);

  return {
    audioStream: destination.stream,
    stop() {
      panner.disconnect();
      player.disconnect();
      player.stop();
    }
  };
}

function publish() {
  publishButton.style.display = "none";
  panValueSlider.value = 0;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create audio stream from mp3 file and video stream from webcam
  Promise.all([
    getAudioBuffer('./media/funkloop.mp3', audioContext),
    OT.getUserMedia({ audioSource: null })
  ]).then((results) => {
    const [audioBuffer, videoStream] = results;
    const {
      audioStream,
      stop
    } = createAudioStream(audioBuffer, audioContext);

    // initialize the publisher
    const publisherOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      // Pass in the video track from our underlying mediaStream as the videoSource
      videoSource: videoStream.getVideoTracks()[0],
      // Pass in the generated audio track as our custom audioSource
      audioSource: audioStream.getAudioTracks()[0],
      // Enable stereo audio
      enableStereo: true,
      // Increasing audio bitrate is recommended for stereo music
      audioBitrate: 128000
    };

    publisher = OT.initPublisher('publisher', publisherOptions, (error) => {
      if (error) {
        handleError(error);
      } else {
        // If the connection is successful, publish the publisher to the session
        session.publish(publisher, (error) => {
          if (error) {
            publishButton.style.display = "block";
            handleError(error);
          } else {
            unpublishButton.style.display = "block";
            panControls.style.display = "block";
          }
        });
      }
    });

    publisher.on('destroyed', () => {
      // When the publisher is destroyed we cleanup
      stop();
      audioContext.close();
      publishButton.style.display = "block";
      unpublishButton.style.display = "none";
      panControls.style.display = "none";
    });
  }).catch((error) => {
    audioContext.close();
    throw error;
  });
}

function unpublish() {
  publisher.destroy();
  publishButton.style.display = "block";
  unpublishButton.style.display = "none";
  panControls.style.display = "none";
}

function updateValue(event) {
  setPanValue(event.target.value);
}

publishButton.addEventListener('click', publish);
unpublishButton.addEventListener('click', unpublish);
panValueSlider.addEventListener('input', updateValue);
panValueSlider.addEventListener('change', updateValue);

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
  .then((response) => response.json())
  .then((json) => {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;
    // Initialize an OpenTok Session object
    initializeSession();
  }).catch((error) => {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
