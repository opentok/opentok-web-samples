/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;

function getFilteredCanvas(mediaStream) {
  const WIDTH = 640;
  const HEIGHT = 480;
  const videoEl = document.createElement('video');
  videoEl.srcObject = mediaStream;
  videoEl.setAttribute('playsinline', '');
  videoEl.muted = true;
  setTimeout(function timeout() {
    videoEl.play();
  });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const tmpCanvas = document.createElement('canvas');
  const tmpCtx = tmpCanvas.getContext('2d');
  tmpCanvas.width = WIDTH;
  tmpCanvas.height = HEIGHT;

  videoEl.addEventListener('resize', () => {
    canvas.width = tmpCanvas.width = videoEl.videoWidth;
    canvas.height = tmpCanvas.height = videoEl.videoHeight;
  });

  let reqId;

  // Draw each frame of the video
  function drawFrame() {
    // Draw the video element onto the temporary canvas and pull out the image data
    tmpCtx.drawImage(videoEl, 0, 0, tmpCanvas.width, tmpCanvas.height);
    let imgData = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
    // Apply the currently selected filter and get the new image data
    // imgData = exports.Filters.selectedFilter(imgData);
    imgData = Filters.selectedFilter(imgData);
    // Draw the filtered image data onto the main canvas
    ctx.putImageData(imgData, 0, 0);

    reqId = requestAnimationFrame(drawFrame);
  }

  reqId = requestAnimationFrame(drawFrame);

  return {
    canvas: canvas,
    stop: function stop() {
      // Stop the video element, the media stream and the animation frame loop
      videoEl.pause();
      if (mediaStream.stop) {
        mediaStream.stop();
      }
      if (MediaStreamTrack && MediaStreamTrack.prototype.stop) {
        // Newer spec
        mediaStream.getTracks().forEach(function each(track) { track.stop(); });
      }
      cancelAnimationFrame(reqId);
    }
  };
}

function handleError(error) {
  if (error) {
    console.error('Received an error', error);
  }
}

function initializeSession() {
  const session = OT.initSession(apiKey, sessionId);

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
  });

  // Request access to the microphone and camera
  OT.getUserMedia().then((mediaStream) => {
    const filteredCanvas = getFilteredCanvas(mediaStream);

    const publisherOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      // Pass in the canvas stream video track as our custom videoSource
      videoSource: filteredCanvas.canvas.captureStream(30).getVideoTracks()[0],
      // Pass in the audio track from our underlying mediaStream as the audioSource
      audioSource: mediaStream.getAudioTracks()[0]
    };

    const publisher = OT.initPublisher('publisher', publisherOptions, (err) => {
      if (err) {
        filteredCanvas.stop();
        handleError(err);
      } else {
        // Connect to the session
        session.connect(token, (error) => {
          if (error) {
            handleError(error);
          } else {
            // If the connection is successful, initialize a publisher and publish to the session
            session.publish(publisher, handleError);
          }
        });
      }
    })

    publisher.on('destroyed', function destroyed() {
      // When the publisher is destroyed we cleanup
      filteredCanvas.stop();
    });

    publisher.on('streamCreated', function created() {
      // We use this for testing so we know when we are publishing successfully
      publisher.element.dataset.streamCreated = true;
    });

    // We insert the canvas into the publisher element on iOS because the video element
    // just stays black otherwise because of a bug https://bugs.webkit.org/show_bug.cgi?id=181663
    if (navigator.userAgent.indexOf('iPhone OS') > -1) {
      publisher.on('videoElementCreated', function videoElementCreated(event) {
        event.element.parentNode.insertBefore(filteredCanvas.canvas, event.element);
        filteredCanvas.canvas.style.width = '100%';
        filteredCanvas.canvas.style.height = '100%';
        filteredCanvas.canvas.style.position = 'absolute';
        filteredCanvas.canvas.style.zIndex = 1;
        filteredCanvas.canvas.style.objectFit = window.getComputedStyle(event.element).objectFit;
      });
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