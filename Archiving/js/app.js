var apiKey,
    sessionId,
    token,
    status,
    archiveID;

$(document).ready(function() {
  $('#stop').hide();
  archiveID = null;

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

  session.on('archiveStarted', function(event) {
    archiveID = event.id;
    console.log('Archive started ' + archiveID);
    $('#stop').show();
    $('#start').hide();
  });

  session.on('archiveStopped', function(event) {
    archiveID = event.id;
    console.log('Archive stopped ' + archiveID);
    $('#start').hide();
    $('#stop').hide();
    $('#view').show();
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

// Start recording
function startArchive() {
  $.ajax({
    url: SAMPLE_SERVER_BASE_URL + '/archive/start',
    type: "POST",
    contentType: "application/json", // send as JSON
    data: JSON.stringify({"sessionId": sessionId}),

    complete: function() {
      //called when complete
      console.log('complete');
    },

    success: function() {
      //called when successful
      console.log('success');
    },

    error: function() {
      //called when there is an error
      console.log('error');
    },
  });

  $('#start').hide();
  $('#stop').show();
}

// Stop recording
function stopArchive() {
  $.post(SAMPLE_SERVER_BASE_URL + '/archive/' + archiveID + '/stop');
  $('#stop').hide();
  $('#view').prop('disabled', false);
  $('#stop').show();
}

// Get the archive status. If it is  "available", download it. Otherwise, keep checking
// every 5 secs until it is "available"
function viewArchive() {
  $('#view').prop('disabled', true);
  window.location = SAMPLE_SERVER_BASE_URL + /archive/ + archiveID + '/view';
}

$('#start').show();
$('#view').hide();
