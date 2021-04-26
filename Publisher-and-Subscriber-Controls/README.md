# Basic Video Call

This Example takes [Basic Video Chat](../Basic-Video-Chat) and adds more functionality that relates to calls.

This includes control over publishing audio / video using [`publishAudio()`](https://tokbox.com/developer/sdks/js/reference/Publisher.html#publishAudio) and [`publishVideo()`](https://tokbox.com/developer/sdks/js/reference/Publisher.html#publishVideo) respectively and a call / hangup button.

Properties Introduced:

```javascript
publisher.session
subscriber.session

subscriber.stream
publisher.stream

stream.hasVideo
stream.hasAudio
```

Methods introduced:

```javascript
publisher.on()
subscriber.on()

publisher.publishAudio()
publisher.publishVideo()
subscriber.subscribeToVideo()
subscriber.subscribeToVideo()

publisher.cycleVideo()
subscriber.setAudioVolume()
```

## Using OpenTok.js methods to implement publisher and subscriber controls

The buttons and controls in this sample are powered by the functions and properties shown above.

In this sample, when a button is pressed, the corresponding function is called.

For example, when the "publish video" button is pressed, this code is executed:

```javascript
function toggleCamera() {
  if (publisher && publisher.session) publisher.publishVideo(!publisher.stream.hasVideo);
  var cameraToggle = document.getElementById('camera-toggle');
  toggleStyle(cameraToggle);
}
```

This method checks whether a publisher exists and is connected to a session (see `if (publisher && publisher.session)`), if it is, the publisher checks if it is currently publishing video by using the `publisher.stream.hasVideo` property and sets video publishing to the opposite of the current state.

When a client connects the subscriber's `connected` / `disconnected` event handler is invoked:

```javascript
    subscriber.on('connected', function enableSubscriberButtons() {
      subscribedToAudio = subscriber.stream.hasAudio;
      subscribedToVideo = subscriber.stream.hasVideo;
      setButtons(subscribedToAudio, [document.getElementById('audio-toggle')]);
      setButtons(subscribedToVideo, [document.getElementById('video-toggle')]);

      document.getElementById('audio-toggle').style.display = 'block';
      document.getElementById('video-toggle').style.display = 'block';
      document.getElementById('volume-range').style.display = 'block';
    });
```

The function starts by checking whether the stream we are subscribed to is publishing audio and video by using `subscriber.stream.hasAudio` and `subscriber.stream.hasVideo`, it then sets the buttons' style accordingly. In the end it shows the buttons.

## Running the App

* Simply open [index.html](index.html) in your browser.

## Read more in the docs

* [Session](https://tokbox.com/developer/sdks/js/reference/Session.html)
* [Publisher](https://tokbox.com/developer/sdks/js/reference/Publisher.html)
* [Stream](https://tokbox.com/developer/sdks/js/reference/Stream.html)
