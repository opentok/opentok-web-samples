# OpenTok Web Samples

Sample applications for using the [OpenTok.js](https://tokbox.com/developer/sdks/js/) library with vanilla JavaScript.

For framework examples (Angular, React, Vue etc.) please see the [Web Component example applications](https://github.com/opentok/web-components/tree/main/examples).
For the electron app samples, these have been moved to [Vonage Community](https://github.com/Vonage-Community/sample-video-electron-app)

The code for this sample is found the following subdirectories:

* Archiving ([source](https://github.com/opentok/opentok-web-samples/tree/main/Archiving)) -- This sample shows you how to record an OpenTok session.

* Basic-Audio-Transformer ([source](https://github.com/opentok/opentok-web-samples/tree/main/Basic-Audio-Transformer)) -- This sample application shows how to use a basic audio transformer with the Vonage Video APIs. It is very similar to the Basic Video Chat example but it adds a low-pass filter to the published audio.

* Basic-Background-Blur ([source](https://github.com/opentok/opentok-web-samples/tree/main/Basic-Background-Blur)) -- This sample application shows how to add background blur with the Vonage Video APIs and Vonage ML Transformers library.

* Basic-Video-Transformer ([source](https://github.com/opentok/opentok-web-samples/tree/main/Basic-Video-Transformer)) -- This sample application shows how to use a basic video transformer with the Vonage Video APIs. It is very similar to the Basic Video Chat example but it adds a threshold processor to the published video.

* Basic Video Chat ([source](https://github.com/opentok/opentok-web-samples/tree/main/Basic%20Video%20Chat)) -- This sample shows you how to connect to an OpenTok session, publish a stream, and
  subscribe to a stream.

* Basic-Video-Zoom ([source](https://github.com/opentok/opentok-web-samples/tree/master/Basic-Video-Zoom)) -- This sample shows you how to use a video transformer to zoom and center a publisher.

* Moderate-Background-Blur ([source](https://github.com/opentok/opentok-web-samples/tree/main/Moderate-Background-Blur)) -- This sample application shows how to add background blur with the Vonage Video APIs and Vonage ML Transformers library.

* Publish-Canvas ([source](https://github.com/opentok/opentok-web-samples/tree/main/Publish-Canvas)) -- In this sample application we show you how to publish a custom stream from a Canvas tag.

* Publish-Video ([source](https://github.com/opentok/opentok-web-samples/tree/main/Publish-Video)) -- In this sample application we show you how to publish a video file to an OpenTok Session.

* Publish-Devices ([source](https://github.com/opentok/opentok-web-samples/tree/main/Publish-Devices)) -- In this sample application we show you how to choose different Cameras and Microphones when publishing.

* Stereo-Audio ([source](https://github.com/opentok/opentok-web-samples/tree/main/Stereo-Audio)) -- In this sample application we show you how to publish a stereo music file to an OpenTok Session.

* Signaling ([source](https://github.com/opentok/opentok-web-samples/tree/main/Signaling)) -- This sample shows you how to use the OpenTok signaling API to implement text chat.

* Stream-Filter ([source](https://github.com/opentok/opentok-web-samples/tree/main/Stream-Filter)) -- This sample shows you how to apply custom grayscale, sepia and invert filters.

See the README file in each of these subdirectories for application-specific notes.

Each of these sample applications are described in the [Web tutorials
section](https://tokbox.com/developer/tutorials/web/) of the OpenTok developer center. 

**Not seeing a sample application for what you are trying to do? [File a new issue](https://github.com/opentok/opentok-web-samples/issues/new?labels=new%20sample%20request) or upvote [an existing one](https://github.com/opentok/opentok-web-samples/labels/new%20sample%20request).**

## Configuring the application

1. Clone this repository.

2. Edit the config.js file and set the values for `API_KEY`, and `TOKEN`:

   To do this, log into your [TokBox Account](https://tokbox.com/account), and either create
   a new project or use an existing project. Then go to your project page and scroll down to the
   **Project Tools** section. From there, you can generate a session ID and token manually. Use the
   project’s API key along with the session ID and token you generated.

**Important notes:**

* You can continue to get the session ID and token values from your Account during testing and
  development, but before you go into production you must set up a server. We will discuss this
  in the [Setting up the test web service](#setting-up-the-test-web-service) section.

* The Archiving sample app requires you to set up the test web service.

## Testing the application

1. The web app is in the index.html (in each sample directory). Open the index.html in a supported browser.

   For information about which browsers are supported by the OpenTok.js library see the [browser support section of the documentation](https://tokbox.com/developer/sdks/js/).

2. When prompted, grant the page access to your camera and microphone.

3. Mute the speaker on your computer, and then load the page again in another browser tab.

   You will see a person-to-person video chat session using OpenTok.

See the README file in each of these subdirectories for application-specific notes.


## Setting up the test web service

The [Learning OpenTok PHP](https://github.com/opentok/learning-opentok-php) repo includes code for
setting up a web service.

1. Clone or download the repo and run its code on a PHP-enabled web server. If you do not have a
   PHP server set up, you can use Heroku to run a remote test server -- see [Automatic deployment
   to Heroku](https://github.com/opentok/learning-opentok-php#automatic-deployment-to-heroku).

2. After getting this web service running, edit the config.js file and set the value for
   `SAMPLE_SERVER_BASE_URL` to the URL for the web service:

   * If you deployed a the test web service to a local PHP server, set this to the following:

        var SAMPLE_SERVER_BASE_URL = 'http://localhost:8080';

   * If you deployed this to Heroku, set this to the following:

        var SAMPLE_SERVER_BASE_URL = 'https://YOUR-HEROKU-APP-URL';

   ***Do not add the trailing slash of the URL.***

The sample will load the OpenTok session ID, token, and API key from the web service. Also,
the archiving sample will use the web service to start, stop, and view archives.

## Other resources

See the following:

* [API reference](https://tokbox.com/developer/sdks/js/reference/) -- Provides details on
  the OpenTok.js API

* [Developer guides](https://tokbox.com/developer/guides/) -- Includes conceptual information and
  code samples for all OpenTok features
