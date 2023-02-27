/* global $ OT SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;
let captionsId;
let publisher;
let subscriber;

$(document).ready(function ready() {
  $('#stop').hide();
  captionsId = null;

  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  $.get(SAMPLE_SERVER_BASE_URL + '/session', function get(res) {
    apiKey = res.apiKey;
    sessionId = res.sessionId;
    token = res.token;

    initializeSession();
  });
});

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', async function streamCreated(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, function callback(error) {
      if (error) {
        console.log('There was an error publishing: ', error.name, error.message);
      }
    });

    // add captions to the subscriber object
    try {
      if (!subscriber.isSubscribedToCaptions()) 
        await subscriber.subscribeToCaptions(true);
    } catch (err) {
      console.warn(err);
    }
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  // Connect to the session
  session.connect(token, function connectCallback(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (!error) {
      var publisherOptions = {
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
    } else {
      console.log('There was an error connecting to the session: ', error.name, error.message);
    }
  });
}

async function startCaptions() {
  publisher.publishCaptions(true);

  try {
    subscriber = OT.subscribers.find();
    // only subscribe if not already doing so
    if (subscriber && !subscriber.isSubscribedToCaptions()) {
      await subscriber.subscribeToCaptions(true);
    }

    subscriber.on('captionReceived', function captionReceived(event) {
      const captionText = event.caption;
      const subscriberContainer = subscriberContainers[stream.streamId];
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

      $('#start').hide();
      $('#stop').show();
    });

  } catch (err) {
    alert('need a subscriber to start captions');
    console.warn(err);
  }
}

async function stopCaptions() {
  publisher.publishCaptions(false);

  try {
    subscriber = OT.subscribers.find();
    // only stop captions if already subscribed
    if (subscriber && subscriber.isSubscribedToCaptions())
      await subscriber.subscribeToCaptions(false);
  } catch (err) {
    console.warn(err);
  }

  $('#stop').hide();
  $('#start').show();
}

$('#start').show();
$('#stop').hide();



