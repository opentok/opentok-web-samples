OpenTok.js Basic Background Blur
=======================

This sample application shows how to add background blur with the Vonage
Video APIs. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example, but it adds a background blur to the publisher in browsers that support media processors. 
See the [OpenTok documentation](https://tokbox.com/developer/sdks/js/reference/OT.html#hasMediaProcessorSupport) and this [blog post](https://developer.vonage.com/en/blog/blurring-for-clarity-avoid-awkward-conversations-about-your-home) for more information.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/opentok/opentok-web-samples/tree/main/Basic-Background-Blur)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Blurring the Video Stream

When initializing the publisher, set the `videoFilter` object of the publisher's options only if media processors are supported.
```javascript
if (OT.hasMediaProcessorSupport()) {
    publisherOptions.videoFilter = {
        type: 'backgroundBlur',
        blurStrength: 'high'
    };
}
```

## Known Limitations
 * MediaProcessors are only supported in recent versions of Chrome, Electron, Opera, and Edge. They are not supported in other (non-Chromium-based) browsers or on iOS. You can check if the client supports this feature by calling the `OT.hasMediaProcessorSupport()` method.
