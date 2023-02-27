OpenTok.js Publish from a Video Element Sample
===========================

In this sample application we show you how to publish a Video file to an OpenTok Session. This sample creates a simple Publisher and publishes it to a Session.

As of v2.13 of opentok.js you can set a custom audio source and video source for a publisher's stream when you call [`OT.initPublisher()`](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher). The custom audio and video source are [`MediaStreamTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) objects. In this sample we obtain a `MediaStreamTrack` from a Video Element, using the [`captureStream()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream) method to get a `MediaStream` object, and then call `getVideoTracks()[0]` on that object to get the video `MediaStreamTrack` object and `getAudioTracks()[0]` to get the audio `MediaStreamTrack` object.

## Demo

You can see a demo of this app running at [opentok.github.io/opentok-web-samples/Publish-Video](https://opentok.github.io/opentok-web-samples/Publish-Video)

> **Note** The demo is setup so that a new room is generated based on your public IP address. So will only work if you are connecting from 2 browsers on the same network.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Known Limitations

* This sample app works on Chrome 53+. [HTMLMediaElement.captureStream](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream) currently does not work in Safari, Firefox, IE or Edge browsers.
