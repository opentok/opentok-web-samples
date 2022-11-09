OpenTok.js Basic Audio Transformer
=======================

This sample application shows how to use a basic transformer with the Vonage
Video APIs. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example but it adds [transformer.js](./js/transformer.js), [worker-media-processor.js](./js/worker-media-processor.js), and [worker.js](./js/worker.js) files which create an audio transformer, a web worker, and a separate thread for the web worker publishing a transformed audio stream that publishes the audio below the cutoff value of 100Hz.

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Basic-Audio-Transformer/](https://opentok.github.io/opentok-web-samples/Basic-Audio-Transformer/)

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
transform the audio stream.

```javascript
session.publish(publisher, () => transformStream(publisher));
```

The `transformStream())` method calls the `OT.hasMediaProcessorSupport()` method to
check if the client supports Media Processors. (Media Processors are only supported in recent versions
of Chrome, Electron, Opera, and Edge.) If the client supports Media Processors, it calls
the `Publisher.setAudioMediaProcessorConnector()` method, passing in a MediaProcessorConnector
object:

```
const transformStream = async (publisher) => {
  const mediaProcessor = new WorkerMediaProcessor();
  const mediaProcessorConnector = new MediaProcessorConnector(mediaProcessor);

  if (OT.hasMediaProcessorSupport()) {
    publisher
      .setAudioMediaProcessorConnector(mediaProcessorConnector)
      .catch(handleError);
  } else {
    console.log('Browser does not support media processors');
  }
};
```

## More information

For more information, see the following topic in the Vonage Video API developer guides
[Using the Vonage Media Processor library to apply custom transformations](https://tokbox.com/developer/guides/audio-video/js/#media-processor).
