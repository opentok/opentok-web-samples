OpenTok.js Basic Video Transformer
=======================

This sample application shows how to use a basic transformer with the Vonage
Video APIs. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example but it adds a [transformer.js](./js/transformer.js), [worker-media-processor.js](./js/worker-media-processor.js), and [worker.js](./js/worker.js) files which create a canvas transformer, a web worker, and a separate thread for the web worker publishing a transformed video stream that uses a threshold processing for implementation.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/opentok/opentok-web-samples/tree/main/Basic-Audio-Transformer)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Transforming the Video Stream

After connecting to the session, and publishing the audio-video stream, transform the video stream.
```javascript
session.publish(publisher, () => transformStream(publisher));
```

## Known Limitations
 * MediaProcessors are only supported in recent versions of Chrome, Electron, Opera, and Edge. They are not supported in other (non-Chromium-based) browsers or on iOS. You can check if the client supports this feature by calling the `OT.hasMediaProcessorSupport()` method.
