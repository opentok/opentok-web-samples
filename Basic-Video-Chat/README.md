OpenTok.js Basic Sample
=======================

This sample application shows how to connect to an OpenTok session, publish a stream,
subscribe to a stream, and mute audio.

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Basic%20Video%20Chat/](https://opentok.github.io/opentok-web-samples/Basic%20Video%20Chat/)

> **Note** The demo is setup so that a new room is generated based on your public IP address. So will only work if you are connecting from 2 browsers on the same network.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Getting an OpenTok session ID, token, and API key

An OpenTok session connects different clients letting them share audio-video streams and send
messages. Clients in the same session can include iOS, Android, and web browsers.

**Session ID** -- Each client that connects to the session needs the session ID, which identifies
the session. Think of a session as a room, in which clients meet. Depending on the requirements of
your application, you will either reuse the same session (and session ID) repeatedly or generate
new session IDs for new groups of clients.

*Important*: This demo application assumes that only two clients -- the local Web client and
another client -- will connect in the same OpenTok session. For test purposes, you can reuse the
same session ID each time two clients connect. However, in a production application, your
server-side code must create a unique session ID for each pair of clients. In other applications,
you may want to connect many clients in one OpenTok session (for instance, a meeting room) and
connect others in another session (another meeting room). For examples of apps that connect users
in different ways, see the OpenTok ScheduleKit, Presence Kit, and Link Kit [Starter Kit
apps](https://tokbox.com/opentok/starter-kits/).

Since this app uses the OpenTok archiving feature to record the session, the session must be set to
use the routed media mode, indicating that it will use the OpenTok Media Router. The OpenTok Media
Router provides other advanced features (see [The OpenTok Media Router and media
modes](https://tokbox.com/opentok/tutorials/create-session/#media-mode)). If your application does
not require the features provided by the OpenTok Media Router, you can set the media mode to
relayed.

**Token** -- The client also needs a token, which grants them access to the session. Each client is
issued a unique token when they connect to the session. Since the user publishes an audio-video
stream to the session, the token generated must include the publish role (the default). For more
information about tokens, see the OpenTok [Token creation
overview](https://tokbox.com/opentok/tutorials/create-token/).

**API key** -- The API key identifies your OpenTok developer account.

Upon starting up, the application executes the following code in the app.js file:

```javascript
// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session').then(function(res) {
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
```

This method checks to see if you've set hardcoded values for the OpenTok API key, session ID, and
token. If not, it makes an XHR (or Ajax request) to the "/session" endpoint of the web service.
The web service returns an HTTP response that includes the session ID, the token, and API key
formatted as JSON data:

    {
         "sessionId": "2_MX40NDQ0MzEyMn5-fn4",
         "apiKey": "12345",
         "token": "T1==cGFydG5lcl9pZD00jg="
    }

For more information, see the main README file of this repository.

## Connecting to the session

Upon obtaining the session ID, token, and API, the app calls the `initializeSession()` method.
First, this method initializes a Session object:

```javascript
    // Initialize Session Object
    var session = OT.initSession(apiKey, sessionId);
```

The `OT.initSession()` method takes two parameters -- the OpenTok API key and the session ID. It
initializes and returns an OpenTok Session object.

The `connect()` method of the Session object connects the client application to the OpenTok
session. You must connect before sending or receiving audio-video streams in the session (or before
interacting with the session in any way). The `connect()` method takes two parameters -- a token
and a completion handler function:

```javascript
    // Connect to the Session
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
            console.log('There was an error initilizing the publisher: ', error.name, error.message);
            return;
          }
          session.publish(publisher, function(error) {
            if (error) {
              console.log('There was an error publishing: ', error.name, error.message);
            }
          });
        });
      } else {
        console.log('There was an error connecting to the session:', error.name, error.message);
      }
    });
```

An error object is passed into the completion handler of the `Session.connect()` method if the
client fails to connect to the OpenTok session. Otherwise, no error object is passed in, indicating
that the client connected successfully to the session.

The Session object dispatches a `sessionDisconnected` event when your client disconnects from the
session. The application defines an event handler for this event:

```javascript
    session.on('sessionDisconnected', function(event) {
      console.log('You were disconnected from the session.', event.reason);
    });
```

## Publishing an audio video stream to the session

Upon successfully connecting to the OpenTok session (see the previous section), the application
initializes an OpenTok Publisher object and publishes an audio-video stream to the session. This is
done inside the completion handler for the connect() method, since you should only publish to the
session once you are connected to it.

The Publisher object is initialized as shown below. The `OT.initPublisher()` method takes three
optional parameters:

* The target DOM element or DOM element ID for placement of the publisher video
* The properties of the publisher
* The completion handler

```javascript
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
```

Once the Publisher object is initialized, we publish to the session using the `publish()`
method of the Session object:

```javascript
    session.publish(publisher);
```

## Subscribing to another client's audio-video stream

The Session object dispatches a `streamCreated` event when a new stream (other than your own) is
created in a session. A stream is created when a client publishes to the session. The
`streamCreated` event is also dispatched for each existing stream in the session when you first
connect. This event is defined by the StreamEvent object, which has a `stream` property,
representing stream that was created. The application adds an event listener for the
`streamCreated` event and subscribes to all streams created in the session using the
`Session.subscribe()` method:

```javascript
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
```

The `Session.subscribe()` method takes four parameters:

* The Stream object to which we are subscribing
* The target DOM element or DOM element ID (optional) for placement of the subscriber video
* A set of properties (optional) that customize the appearance of the subscriber view
* The completion handler function (optional) that is called when the method completes
  successfully or fails
