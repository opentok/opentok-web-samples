OpenTok.js Vonage Media Library Background Blur
=======================

This sample application shows how to add background blur with the Vonage
video APIs. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example but it adds a background blur to the publisher. See [Vonage ML Transformers](https://vonage.github.io/ml-transformers-docs/) library for more information. The OpenTok.js library includes a background blur filter through the [Publisher.applyVideoFilter()](https://tokbox.com/developer/sdks/js/reference/Publisher.html#applyVideoFilter). This sample app shows how to apply a video filter with using a media processor from the `@vonage/ml-transformers` library.

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Vonage-Media-Library-Blur/](https://opentok.github.io/opentok-web-samples/Vonage-Media-Library-Blur/)

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

```javascript
const transformStream = async (publisher) => {
  const processor = await createVonageMediaProcessor(config);

  if (OT.hasMediaProcessorSupport()) {
    publisher
      .setVideoMediaProcessorConnector(processor.getConnector())
      .catch(handleError);
  } else {
    console.log('Browser does not support media processors');
  }
};
```

The `Publisher.setVideoMediaProcessorConnector()` method applies a video transformer to a published stream.

### Video Transformer
A Transformer is an object or class instance representing the transformer. For a definition, see the `transformer` parameter of the [`TransformStream()`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream#parameters) constructor. Also see the definition for `Transformer` interface in the [TypeScript Transformer interface](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts).

## More information

For more information, see the following topic in the Vonage Video API developer guides
[Using the Vonage Media Processor library to apply custom transformations](https://tokbox.com/developer/guides/audio-video/js/#media-processor).
