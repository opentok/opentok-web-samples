import {
  BlurRadius,
  createVonageMediaProcessor
} from '../node_modules/@vonage/ml-transformers/dist/ml-transformers.es.js';
/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */
/* global MediaProcessorConnector */

let apiKey;
let sessionId;
let token;

const config = {
  transformerType: 'BackgroundBlur',
  radius: BlurRadius.High,
  // These two following properties added below are an example about how to provide
  // the ML assets used by the library. If a copy of those is needed for any other
  // custom hosting, please contact Vonage.
  // For more information see https://vonage.github.io/ml-transformers-docs/docs/api/interfaces/MediaProcessorBaseConfig#modelasseturipath.
  modelAssetUriPath: 'https://static.opentok.com/ml-transformers/v6.0.0/float16/vonage_selfie_segmenter.tflite',
  // For more information see https://vonage.github.io/ml-transformers-docs/docs/api/interfaces/MediaProcessorBaseConfig#mediapipebaseassetsuri.
  mediapipeBaseAssetsUri: 'https://static.opentok.com/ml-transformers/v6.0.0/mediapipe/0.10.20'
};

const transformStream = async (publisher) => {
  const processor = await createVonageMediaProcessor(config);

  if (OT.hasMediaProcessorSupport()) {
    publisher
      .setVideoMediaProcessorConnector(processor.getConnector())
      .catch((e) => {
        console.error(e);
      });
  } else {
    console.log('Browser does not support media processors');
  }
};

const handleError = (error) => {
  if (error) {
    console.error(error);
  }
};

const initializeSession = () => {
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

  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };
  const publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      // and transform stream
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
