OpenTok.js Moderate Background Blur
=======================

This sample application shows how to add background blur with the Vonage
Video APIs. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example, but it adds a background blur to the publisher. See [Vonage ML Transformers](https://vonage.github.io/ml-transformers-docs/) library for more information.

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Moderate-Background-Blur/](https://opentok.github.io/opentok-web-samples/Moderate-Background-Blur/)

> **Note** The demo is setup so that a new room is generated based on your public IP address. So will only work if you are connecting from 2 browsers on the same network.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Blurring the Video Stream

After connecting to the session, and publishing the audio-video stream, adds background blur.
```javascript
session.publish(publisher, () => transformStream(publisher));
```

## Known Limitations
 * MediaProcessors are only supported in recent versions of Chrome, Electron, Opera, and Edge. They are not supported in other (non-Chromium-based) browsers or on iOS. You can check if the client supports this feature by calling the `OT.hasMediaProcessorSupport()` method.
