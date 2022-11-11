OpenTok.js Basic Video Transformer
=======================

This sample application shows how to use a basic transformer with the Vonage
video APIs. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example but it adds a [transformer.js](./js/transformer.js), [worker-media-processor.js](./js/worker-media-processor.js), and [worker.js](./js/worker.js) files which create a canvas transformer, a web worker, and a separate thread for the web worker publishing a transformed video stream that uses a threshold processing for implementation.

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Basic-Video-Transformer/](https://opentok.github.io/opentok-web-samples/Basic-Video-Transformer/)

> **Note** The demo is set up so that a new room is generated based on your public IP address. So it will only work if you are connecting from two browsers on the same network.

## Installing dependencies

Before running the app, install the Node modules it uses:

```
npm install
```

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)

* [Configuring the application](../README.md#configuring-the-application)

* [Testing the application](../README.md#testing-the-application) -- Note however that this
  sample requires that you serve the index.html page via an http://localhost server or an
  HTTPS server. This is because the sample loads the app.js script with `type` set to `"module"`:
  
  ```
  <script type="module" src="js/app.js"></script>
  ```

  Modules are not supported in pages loaded with a file: URL scheme.

## Understanding the code

After connecting to the session, and publishing the audio-video stream, the app calls
transform the video stream.

```javascript
session.publish(publisher, () => transformStream(publisher));
```

The `transformStream())` method calls the `OT.hasMediaProcessorSupport()` method to
check if the client supports Media Processors. (Media Processors are only supported in recent versions
of Chrome, Electron, Opera, and Edge.) If the client supports Media Processors, it calls
the `Publisher.setAudioMediaProcessorConnector()` method, passing in a MediaProcessorConnector
object:

```javascript
const transformStream = async (publisher) => {
  const mediaProcessor = new WorkerMediaProcessor();
  const mediaProcessorConnector = new MediaProcessorConnector(mediaProcessor);

  if (OT.hasMediaProcessorSupport()) {
    publisher
      .setVideoMediaProcessorConnector(mediaProcessorConnector)
      .catch((e) => {
        console.error(e);
      });
  } else {
    console.log('Browser does not support media processors');
  }
};
```

The `Publisher.setVideoMediaProcessorConnector()` method applies a video transformer to a published stream.

### Video Transformer
A Transformer is an object or class instance representing the transformer. For a definition, see the `transformer` parameter of the [`TransformStream()`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream#parameters) constructor. Also see the definition for `Transformer` interface in the [TypeScript Transformer interface](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts).

To see the example thresholding filter, check out [Basic-Video-Transformer/js/transformer.js](./js/transformer.js).

### Web Workers
You will probably run transformers in a Web Worker for performance benefits; this example app uses one.

To do this, initialize both the `MediaProcessor` and the transformer on the worker thread. (See [Basic-Video-Transformer/js/worker.js](./js/worker.js) and [Basic-Video-Transformer/js/transformer.js](./js/transformer.js).)

```javascript
// from Basic-Video-Transformer/js/worker.js
mediaProcessor = new MediaProcessor();
const transformers = [new Transformer()];
```

To create a MediaProcessorConnector on the main thread while running the MediaProcessor on the worker thread, you need to create you own MediaProcessor that implements the [MediaProcessor interface](https://vonage.github.io/media-processor-docs/docs/intro#mediaprocessor-bridge-code) and communicates with the worker. (See [Basic-Video-Transformer/js/worker-media-processor.js](./js/worker-media-processor.js) for this sample app's implementation of the MediaProcessor)

```javascript
// from Basic-Video-Transformer/js/app.js
const mediaProcessor = new WorkerMediaProcessor();
const mediaProcessorConnector = new MediaProcessorConnector(mediaProcessor);
```

## More information

For more information, see the following topic in the Vonage Video API developer guides
[Using the Vonage Media Processor library to apply custom transformations](https://tokbox.com/developer/guides/audio-video/js/#media-processor).
