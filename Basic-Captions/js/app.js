/* global $ OT SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;
let captionId;
let publisher;
let subscriber;

// clears after a set amount of time
let captionsRemovalTimer;

$(document).ready(function ready() {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  $.get(SAMPLE_SERVER_BASE_URL + '/session', function get(res) {
    apiKey = res.apiKey;
    sessionId = res.sessionId;
    token = res.token;

    initializeSession();
  });
});

function enableTranscription(session) {
  const { sessionId, token } = session;
  const url = `${SAMPLE_SERVER_BASE_URL}/captions/start`;

  let captionRes;
  try {
    captionRes = $.post(url, {
      sessionId,
      token,
    }).done(function response() {
      captionId = captionRes.responseText;
    });
  } catch (e) {
    console.warn(e);
  }
}

async function disableTranscription() {
  const url = `${SAMPLE_SERVER_BASE_URL}/captions/stop`;
  try {
    $.post(url, {
      captionId,
    });
  } catch (e) {
    console.warn(e);
  }
}


async function initializeSession() {
  let session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', async function streamCreated(event) {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      testNetwork: true,
    };
    subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, function callback(error) {
      if (error) {
        console.log('There was an error publishing: ', error.name, error.message);
      }
    });

    // add captions to the subscriber object
    try {
      await subscriber.subscribeToCaptions(true);
    } catch (err) {
      console.warn(err);
    }

    subscriber.on('captionReceived', function(event){
      const captionText = event.caption;
      const subscriberContainer = OT.subscribers.find().element;
      const [subscriberWidget] = subscriberContainer.getElementsByClassName('OT_widget-container');
    
      const oldCaptionBox = subscriberWidget.querySelector('.caption-box');
      if (oldCaptionBox) oldCaptionBox.remove();
    
      const captionBox = document.createElement('div');
      captionBox.classList.add('caption-box');
      captionBox.textContent = captionText;
    
      // remove the captions after 5 seconds
      const removalTimerDuration = 5 * 1000;
      clearTimeout(captionsRemovalTimer);
      captionsRemovalTimer = setTimeout(() => {
        captionBox.textContent = '';
      }, removalTimerDuration);
    
      subscriberWidget.appendChild(captionBox);
    });
    $('#stop').show();
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  // Connect to the session
  session.connect(token, async function connectCallback(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (!error) {
      const publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        publishCaptions: true,
      };
      publisher = OT.initPublisher('publisher', publisherOptions, function initCallback(err) {
        if (err) {
          console.log('There was an error initializing the publisher: ', err.name, err.message);
          return;
        }
        session.publish(publisher, function publishCallback(pubErr) {
          if (pubErr) {
            console.log('There was an error publishing: ', pubErr.name, pubErr.message);
          }
        });
      });

      enableTranscription(session);
    } else {
      console.log('There was an error connecting to the session: ', error.name, error.message);
    }
  });
}
