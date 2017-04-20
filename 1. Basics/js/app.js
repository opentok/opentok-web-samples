var apiKey,
    sessionId,
    token;

$(document).ready(function() {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  $.get(SAMPLE_SERVER_BASE_URL + '/session', function(res) {
    apiKey = res.apiKey;
    sessionId = res.sessionId;
    token = res.token;

    initializeSession();
  });
});

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, function(error) {
      if (error) {
        console.log('There was an error publishing: ', error.name, error.message);
      }
    });
  });

  session.on('sessionDisconnected', function(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (!error) {
      var publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      };
      var publisher = OT.initPublisher('publisher', publisherOptions, function(error) {
        if (error) {
          console.log('There was an error initializing the publisher: ', error.name, error.message);
          return;
        }
        session.publish(publisher, function(error) {
          if (error) {
            console.log('There was an error publishing: ', error.name, error.message);
          }
        });
      });
    } else {
      console.log('There was an error connecting to the session: ', error.name, error.message);
    }
  });
}
