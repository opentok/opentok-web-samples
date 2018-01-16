(function(exports) {
  var apiKey,
      sessionId,
      token;

  function handleError(error) {
    if (error) {
      console.error(error);
    }
  }
  exports.handleError = handleError;

  function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
      var subscriberOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      };
      session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
    });

    session.on('sessionDisconnected', function(event) {
      console.log('You were disconnected from the session.', event.reason);
    });

    var publishPromise = exports.publish();

    // Connect to the session
    session.connect(token, function(error) {
      if (error) {
        handleError(error);
      } else {
        // If the connection is successful, initialize a publisher and publish to the session
        publishPromise.then(function(publisher) {
          session.publish(publisher, handleError);
        });
      }
    });
  }

  // See the config.js file.
  if (exports.API_KEY && exports.TOKEN && exports.SESSION_ID) {
    apiKey = exports.API_KEY;
    sessionId = exports.SESSION_ID;
    token = exports.TOKEN;
    initializeSession();
  } else if (exports.SAMPLE_SERVER_BASE_URL) {
    // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
    fetch(exports.SAMPLE_SERVER_BASE_URL + '/session').then(function(res) {
      return res.json();
    }).then(function(json) {
      apiKey = json.apiKey;
      sessionId = json.sessionId;
      token = json.token;

      initializeSession();
    }).catch(function(error) {
      handleError(error);
      alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
    });
  }
})(exports);
