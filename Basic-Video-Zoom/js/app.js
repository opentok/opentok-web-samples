import {
  MediaProcessorConnector,
} from "../node_modules/@vonage/media-processor/dist/media-processor.es.js";
import { WorkerMediaProcessor } from "./media-processor-helper-worker.js";
/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */
/* global ResizeTransformer MediaProcessor MediaProcessorConnector */


let apiKey;
let sessionId;
let token;

const transformStream = async (publisher) => {
  if (OT.hasMediaProcessorSupport()) {
    const mediaProcessor = new WorkerMediaProcessor();
    const mediaProcessorConnector = new MediaProcessorConnector(
      mediaProcessor
    );

    publisher
      .setVideoMediaProcessorConnector(mediaProcessorConnector)
      .catch((e) => {
        throw e;
      });
  }
}

const handleError = async (error) => {
  if (error) {
    console.error(error);
  }
};

const initializeSession = async () => {
  const session = OT.initSession(apiKey, sessionId);
  const publisherContainer = document.getElementById('publisher');
  const subcriberContainer = document.getElementById('subscriber');

  // Subscribe to a newly created stream
  session.on("streamCreated", function streamCreated(event) {
    const subscriberOptions = {
      insertMode: "append"
    };
    session.subscribe(
      event.stream,
      "subscriber",
      subscriberOptions,
      handleError
    );
  });

  session.on('streamPropertyChanged', (e) => {
    if (!e.changedProperty === "videoDimensions") return;
    if (e.stream.connection.id === session.connection.id) {
      // change publisher container size
      const publisher = publisherContainer.getElementsByClassName('OT_publisher')[0];
      const width = (e.newValue.width/e.newValue.height)* 300; // fix height to 300px
      publisher.style.width = `${width}px`;
      publisher.style.height = `200px`;
    }
    else {
      // change subscriber container size
      const subscriber = subcriberContainer.getElementsByClassName('OT_subscriber')[0];
      const width = (e.newValue.width/e.newValue.height)* screen.height*0.7; // fix height to 0.7*screenHeight
      subscriber.style.width = `${width}px`;
      subscriber.style.height = `${screen.height*0.7}px`;
    }
  })
  session.on("sessionDisconnected", function sessionDisconnected(event) {
    console.log("You were disconnected from the session.", event.reason);
  });

  // initialize the publisher
  const publisherOptions = {
    insertMode: "append"
  };
  const publisher = await OT.initPublisher(
    "publisher",
    publisherOptions,
    (error) => {
      if (error) {
        console.warn(error);
      }
    }
  );

  // Connect to the session
  session.connect(token, async (error) => {
    if (error) {
      await handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, () => transformStream(publisher));
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
  fetch(SAMPLE_SERVER_BASE_URL + "/session")
    .then(function fetch(res) {
      return res.json();
    })
    .then(function fetchJson(json) {
      apiKey = json.apiKey;
      sessionId = json.sessionId;
      token = json.token;
    })
    .then(() => {
      initializeSession();
    })
    .catch(function catchErr(error) {
      handleError(error);
    });
}
