OpenTok.js Signaling Sample
===========================

This sample application shows the use the OpenTok signaling API to implement text chat.

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Signaling/](https://opentok.github.io/opentok-web-samples/Signaling/)

> **Note** The demo is setup so that a new room is generated based on your public IP address. So will only work if you are connecting from 2 browsers on the same network.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

For this application, once the two clients have connected to the OpenTok session, enter text
in the text field in the bottom-righthand corner of one of the web client pages and press
the Enter button. The text message is displayed in the text field righthand side of the
other client's page.

## Using the signaling API to implement text chat

Text chat is implemented using the OpenTok signaling API. A signal is sent using the `signal()`
method of the Session object. To receive a signal a client needs to listen to the `signal` event
dispatched by the session object.

In our application, when the user enters text in the input text field, the following code is
executed:

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
    });

This method calls the `signal()` method of the Session object, which sends a signal to all clients
connected to the OpenTok session. Each signal is defined by a `type` property identifying the type
of message (in this case `"msg"`) and a `data` property containing the message. The text entered is
sent in the data property of the signal method.

When another client connected to the session (in this app, there is only one) sends a message, the
session's `signal` event handler is invoked:

    session.on('signal:msg', function(event) {
      var msg = document.createElement('p');
      msg.innerText = event.data;
      msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
      msgHistory.appendChild(msg);
      msg.scrollIntoView();
    });

This method checks to see if the signal was sent by the local web client or by the other client
connected to the session:

    event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';

The Session object represents your OpenTok session. It has a `connection` property, which has a
`connectionId` property. The event object represents the event associated with this signal. It has
a `from` property (which is a Connection object) with a `connectionId` property. This represents
the connection ID of the client sending the signal. If these match, the signal was sent by the
local web client.

The data associated with the event is then appended as a child of the `history` DOM element.

This app uses the OpenTok signaling API to implement text chat. However, you can use the signaling
API to send messages to other clients (individually or collectively) connected to the session.

For more information, see the [OpenTok signaling developer
guide](https://tokbox.com/developer/guides/signaling/js/).
