var apiKey,
    session,
    sessionId,
    token,
    response;

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
  session = OT.initSession(apiKey, sessionId);

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

  // Receive a message and append it to the history
  var msgHistory = document.querySelector('#history');
  session.on('signal:msg', function(event) {
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
  });
}

// Text chat
var form = document.querySelector('form');
var msgTxt = document.querySelector('#msgTxt');

// Send a signal once the user enters data in the form
form.addEventListener('submit', function(event) {
  event.preventDefault();

  session.signal({
      type: 'msg',
      data: msgTxt.value
    }, function(error) {
      if (error) {
        console.log('Error sending signal:', error.name, error.message);
      } else {
        msgTxt.value = '';
      }
    });
});
