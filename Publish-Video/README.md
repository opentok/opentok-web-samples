OpenTok.js Publish from a Video Element Sample
===========================

In this sample application we show you how to publish a Video file to an OpenTok Session.

As of v2.13 of opentok.js you can set a custom audio source and video source for a publisher's stream when you call [`OT.initPublisher()`](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher). The custom audio and video source are [`MediaStreamTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) objects. In this sample we obtain a `MediaStreamTrack` from a Video Element, using the [`captureStream()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream) method to get a `MediaStream` object, and then call `getVideoTracks()[0]` on that object to get the video `MediaStreamTrack` object and `getAudioTracks()[0]` to get the audio `MediaStreamTrack` object.

## Demo

You can see a demo of this app running at [opentok.github.io/opentok-web-samples/Publish-Video](https://opentok.github.io/opentok-web-samples/Publish-Video)

## Running the App

* Simply open [index.html](index.html) in your browser.

## Known Limitations

* This sample app works on Chrome 53+. [HTMLMediaElement.captureStream](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream) currently does not work in Safari, Firefox, IE or Edge browsers.
