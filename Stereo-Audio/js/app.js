/* global OT Promise */

((exports) => {
  const credentials = {};
  let session;
  exports.hideControls();

  const initializeSession = () => {
    if (session && session.isConnected()) {
      session.disconnect();
    }
    session = OT.initSession(credentials.apiKey, credentials.sessionId);

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
      exports.hideControls();
      console.log('You were disconnected from the session.', event.reason);
    });

    // Connect to the session
    session.connect(credentials.token, (error) => {
      if (error) {
        handleError(error);
        return;
      }
      // If the connection is successful, show the publish button
      exports.showPublishButton(onClickPublish);
    });
  };

  const onClickPublish = () => {
    exports.hideControls();
    exports.publish()
      .then(result => new Promise((resolve, reject) => {
        session.publish(result.publisher, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      }))
      .then(
        ({ publisher, setPanValue }) => {
          exports.showSlider(setPanValue, () => {
            session.unpublish(publisher);
          });
          publisher.on('destroyed', () => {
            exports.showPublishButton(onClickPublish);
          });
        },
        (error) => {
          exports.showPublishButton(onClickPublish);
          handleError(error);
        }
      );
  };

  const handleError = (error) => {
    if (error) {
      console.error('Received an error', error);
      document.querySelector('#error').innerHTML = 'Error: ' + error.message;
    }
  };
  exports.handleError = handleError;

  // See the config.js file.
  if (exports.API_KEY && exports.SESSION_ID && exports.TOKEN) {
    const {
      API_KEY: apiKey,
      SESSION_ID: sessionId,
      TOKEN: token
    } = exports;
    Object.assign(credentials, { apiKey, sessionId, token });
    initializeSession();
  } else if (exports.SAMPLE_SERVER_BASE_URL) {
    // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
    fetch(`${exports.SAMPLE_SERVER_BASE_URL}/session`)
      .then(res => res.json())
      .then(({ apiKey, sessionId, token }) => {
        Object.assign(credentials, { apiKey, sessionId, token });
        initializeSession();
      })
      .catch((error) => {
        handleError(error);
        alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
      });
  }
})(exports);
