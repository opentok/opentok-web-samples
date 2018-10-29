OpenTok.js Publish Different Devices Sample
===========================

In this sample application we show you how to choose an initial microphone and camera to publish and then how to use the [`setAudioSource()`](https://tokbox.com/developer/sdks/js/reference/Publisher.html#setAudioSource) and [`cycleVideo()`](https://tokbox.com/developer/sdks/js/reference/Publisher.html#cycleVideo) methods to change the Microphone and Camera while you are publishing. It also shows you how to use the [`"audioLevelUpdated"`](https://tokbox.com/developer/sdks/js/reference/AudioLevelUpdatedEvent.html) Event to display a simple audio level meter to indicate to the user whether their microphone is working. This sample just creates a simple standalone Publisher without actually publishing it to a Session. To build a full application you will need to combine this with one of the other sample applications, eg. [Basic Video Chat](../BasicVideoChat)

## Demo

You can see a demo of this app running at [opentok.github.io/opentok-web-samples/Publish-Devices](https://opentok.github.io/opentok-web-samples/Publish-Devices)

## Running the App

* Simply open [index.html](index.html) in your browser.

## Known Limitations

* `setAudioSource()` and `cycleVideo()` are currently not supported by Internet Explorer or Microsoft Edge browsers so you need to create a new Publisher if you want to switch devices.
* `setAudioSource()` is supported in v2.15+ of opentok.js
* `cycleVideo()` is supported in v2.14+ of opentok.js
