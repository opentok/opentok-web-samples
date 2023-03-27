OpenTok.js Basic Captions
=======================

This sample application shows how to connect to an OpenTok session, publish a stream,
subscribe to a stream, and publish captions to a session.

> **Note** The demo requires a server that is running and is able to handle OpenTok captions. This server should also be able to generate sessions and tokens. 

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/opentok/opentok-web-samples/tree/main/Basic-Captions)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.


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
connect others in another session (another meeting room).

**Token** -- The client also needs a token, which grants them access to the session. Each client is
issued a unique token when they connect to the session. Since the user publishes an audio-video
stream to the session, the token generated must include the publish role (the default). For more
information about tokens, see the OpenTok [Token creation
overview](https://tokbox.com/opentok/tutorials/create-token/). Moderator token role is required for
captions API to work. 

**API key** -- The API key identifies your OpenTok developer account.

Upon starting up, the application executes the following code in the app.js file:

```javascript
// See the config.js file.
if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
  .then((response) => response.json())
  .then((json) => {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;
    // Initialize an OpenTok Session object
    initializeSession();
  }).catch((error) => {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
```

The captions need to be enabled by making a request to your server. Please see [the following
sample](https://github.com/opentok/learning-opentok-node) on how to set up a NodeJS server.

The following method will enable the captions in your session: 

```javascript
async function startCaptions() {
  console.log('start captions');
  try {
    captions = await postData(SAMPLE_SERVER_BASE_URL +'/captions/start',{sessionId, token});
    captionsStartBtn.style.display = 'none';
    captionsStopBtn.style.display = 'inline';
  }
  catch(error){
    handleError(error);
  }
}
```

The following method will stop the captions in your session:

```javascript
async function stopCaptions() {
  console.log('stop captions');
  try {
    captions = await postData(`${SAMPLE_SERVER_BASE_URL}/captions/${captions.id}/stop`,{});
    captionsStartBtn.style.display = 'none';
    captionsStopBtn.style.display = 'inline';
  }
  catch(error){
    captionsStartBtn.style.display = 'inline';
    captionsStopBtn.style.display = 'none';
    handleError(error);
  }
}
```

The `postData` method is used by both `startCaptions` and `stopCaptions` methods and is defined as following:
```javascript
async function postData(url='', data={}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok){
      throw new Error('error getting data!');
    }
    return response.json();
  }
  catch (error){
    handleError(error);
  }
}
```

When initializing a Publisher that you would like to have the captions enabled for, pass the `publishCaptions` property set to `true`:

```javascript
      const publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        publishCaptions: true,
      };
```

The Subscriber object has an event, `captionReceived`, that you can listen for in order to make the changes to the UI:

```javascript
subscriber.on('captionReceived', function(event){
      const captionText = event.caption;
      const subscriberContainer = OT.subscribers.find().element;
      const [subscriberWidget] = subscriberContainer.getElementsByClassName('OT_widget-container');
    
      const oldCaptionBox = subscriberWidget.querySelector('.caption-box');
      if (oldCaptionBox) {
        oldCaptionBox.remove();
      }
    
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
```

To learn more about OpenTok Captions API, please visit the [Captions API Developer Documentation page](https://www.tokbox.com/developer/guides/live-captions/).
