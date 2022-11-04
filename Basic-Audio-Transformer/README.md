OpenTok.js Basic Audio Transformer
=======================

This sample application shows how to use a basic transformer with the Vonage
video APIs. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example but it adds [transformer.js](./js/transformer.js), [worker-media-processor.js](./js/worker-media-processor.js), and [worker.js](./js/worker.js) files which create an audio transformer, a web worker, and a separate thread for the web worker publishing a transformed audio stream that publishes the audio below the cutoff value of 100Hz. 

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Basic-Audio-Transformer/](https://opentok.github.io/opentok-web-samples/Basic-Audio-Transformer/)

> **Note** The demo is setup so that a new room is generated based on your public IP address. So will only work if you are connecting from 2 browsers on the same network.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Transforming the Audio Stream

After connecting to the session, and publishing the audio-video stream, transform the audio stream.
```javascript
session.publish(publisher, () => transformStream(publisher));
```

## Known Limitations
 * MediaProcessors are only supported in recent versions of Chrome, Electron, Opera, and Edge. They are not supported in other (non-Chromium-based) browsers or on iOS. You can check if the client supports this feature by calling the `OT.hasMediaProcessorSupport()` method.
