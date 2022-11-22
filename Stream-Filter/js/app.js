/* global OT */

(function closure(exports) {
  var apiKey;
  var sessionId;
  var token;

  function handleError(error) {
    if (error) {
      console.error('Received an error', error);
    }
  }
  exports.handleError = handleError;

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

    var publishPromise = exports.publish();

    // Connect to the session
    session.connect(token, function callback(error) {
      if (error) {
        handleError(error);
      } else {
        // If the connection is successful, initialize a publisher and publish to the session
        publishPromise.then(function publishThen(publisher) {
          session.publish(publisher, handleError);
        }).catch(handleError);
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
    fetch(exports.SAMPLE_SERVER_BASE_URL + '/session').then(function fetchThen(res) {
      return res.json();
    }).then(function jsonThen(json) {
      apiKey = json.apiKey;
      sessionId = json.sessionId;
      token = json.token;

      initializeSession();
    }).catch(function catchErr(error) {
      handleError(error);
      alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
    });
  }
})(exports);
