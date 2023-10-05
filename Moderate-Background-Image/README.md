OpenTok.js Moderate Background Image Replacement
=======================

This sample application shows how to add background image replacement with the Vonage
Video APIs. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example, but it adds a background image to the publisher. See [Vonage ML Transformers](https://vonage.github.io/ml-transformers-docs/) library for more information.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/opentok/opentok-web-samples/tree/main/Moderate-Background-Image)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Change the background image for the Video Stream

After connecting to the session and publishing the audio-video stream, you can change the background image by replacing it with a new URI using the following code:

```javascript
  config.backgroundAssetUri = assetUri;
  processor.setBackgroundOptions(config);
```

## Known Limitations
 * MediaProcessors are only supported in recent versions of Chrome, Electron, Opera, and Edge. They are not supported in other (non-Chromium-based) browsers or on iOS. You can check if the client supports this feature by calling the `OT.hasMediaProcessorSupport()` method.
