import { MediaProcessorConnector } from '../node_modules/@vonage/media-processor/dist/media-processor.es.js';
import { WorkerMediaProcessor } from './media-processor-helper-worker.js';
/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */
/* global ResizeTransformer MediaProcessor MediaProcessorConnector */

let apiKey;
let sessionId;
let token;

const handleError = (error) => {
  if (error) {
    console.error(error);
  }
};

const transformStream = (publisher) => {
  if (OT.hasMediaProcessorSupport()) {
    const mediaProcessor = new WorkerMediaProcessor();
    const mediaProcessorConnector = new MediaProcessorConnector(mediaProcessor);

    publisher
    .setVideoMediaProcessorConnector(mediaProcessorConnector)
    .catch((error) => {
      handleError(error);
    });
  }
};

const initializeSession = () => {
  const session = OT.initSession(apiKey, sessionId);
  const publisherContainer = document.getElementById('publisher');
  const subscriberContainer = document.getElementById('subscriber');

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('streamPropertyChanged', (e) => {
    if (e.changedProperty !== 'videoDimensions') return;
    if (e.stream.connection.id === session.connection.id) {
      // change publisher container size
      const publisher = publisherContainer.getElementsByClassName('OT_publisher')[0];
      const width = (e.newValue.width / e.newValue.height) * 300; // fix height to 300px
      publisher.style.width = `${width}px`;
      publisher.style.height = '200px';
    } else {
      // change subscriber container size
      const subscriber = subscriberContainer.getElementsByClassName('OT_subscriber')[0];
      const width = (e.newValue.width / e.newValue.height) * screen.height * 0.7; // fix height to 0.7*screenHeight
      subscriber.style.width = `${width}px`;
      subscriber.style.height = `${screen.height * 0.7}px`;
    }
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });

  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append'
  };

  const publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, () => transformStream(publisher));
    }
  });
};

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
