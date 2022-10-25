import { MediaProcessorConnector, MediaProcessor } from '../node_modules/@vonage/media-processor/dist/media-processor.es.js';
import { WorkerMediaProcessor } from './media-processor-helper-worker.js';
import { GreyScaleTransformer } from './transformer.js';
/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;

function handleError(error) {
  if (error) {
    console.error(error);
  }
}
// const mediaProcessor = new WorkerMediaProcessor();
// const mediaProcessorConnector = new MediaProcessorConnector(mediaProcessor);

const mediaProcessor = new MediaProcessor();
mediaProcessor.setTransformers(
  [new GreyScaleTransformer()]
);
const mediaProcessorConnector = new MediaProcessorConnector(mediaProcessor);

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });


  // initialize the publisher
  var publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };
  var publisher = OT.initPublisher('publisher', publisherOptions, handleError);
  console.log('after initializing publisher');
  if (OT.hasMediaProcessorSupport()) {
    console.log('before setting mediaProcessorConnector');
    publisher.setVideoMediaProcessorConnector(mediaProcessorConnector);
    console.log('after setting mediaProcessorConnector');
  }

  // Connect to the session
  session.connect(token, function callback(error) {
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
    // alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
