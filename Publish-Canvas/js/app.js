/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;

function handleError(error) {
  if (error) {
    console.error(error);
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

  const randomColour = () => {
    return Math.round(Math.random() * 255);
  };

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  // Draw a random colour in the Canvas every 3 seconds
  const interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${randomColour()}, ${randomColour()}, ${randomColour()})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, 3000);

  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    videoSource: canvas.captureStream(3).getVideoTracks()[0] // Use canvas.captureStream at 3 fps and pass the video track to the Publisher
  };

  const publisher = OT.initPublisher('publisher', publisherOptions, (error) => {
    if (error) {
      clearInterval(interval);
      handleError(error);
      alert(error.message);
    }
  });

  publisher.on('destroyed', () => {
    clearInterval(interval);
  });

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, handleError);
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