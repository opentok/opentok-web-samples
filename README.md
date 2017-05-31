# OpenTok Web Samples

Sample applications for using the [OpenTok.js](https://tokbox.com/developer/sdks/js/) library.

The code for this sample is found the following subdirectories:

* Basic Video Chat -- This sample shows you how to connect to an OpenTok session, publish a stream,
  subscribe to a stream, and mute audio.

* Archiving -- This sample shows you how to record an OpenTok session.

* Signaling -- This sample shows you how to use the OpenTok signaling API to implement text chat.

See the README file in each of these subdirectories for application-specific notes.

Each of these sample applications are described in the [Web tutorials
section](https://tokbox.com/developer/tutorials/web/) of the OpenTok developer center.

## Configuring the application

1. Clone this repository.

2. Open the folder that contains the sample you want to run (such as `Basic Video Chat`). Navigate
   to the `js` directory and make a copy of the sampleconfig.js file named config.js.

3. Edit the config.js file and set the values for `API_KEY`, `SESSION_ID`, and `TOKEN`:

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

1. The web app is in the index.html (in each sample directory). You will need to run this
   on a web server.
   
   If you have Python on your system, you can start the web server by running
   `python -m SimpleHTTPServer 8000` in the root subdirectory containing the sample
   (the directory containing the index.html file).

   You cannot publish video on a page loaded from a `file://` URL, due to browser security
   limitations. You need to load the page from an `http://` or `https://` URL. Note also,
   that Chrome requires you to load a page from an https:// URL (although you can use http to test
    a localhost URL in Chrome). For example, you can test a page from http://localhost if you have
    a web server set up on your local machine.

2. Once you have the server running open the index.html in a supported browser.
   For example, if our local web server is running on port 8000, load the following URL:

   http://localhost:8000

   The OpenTok.js library is supported in Chrome, Firefox, and Internet Explorer 10 - 11.
   (Internet Explorer requires installation of the OpenTok plugin, which the library asks you
   to install, if you haven't already.)

3. When prompted, grant the page access to your camera and microphone.

4. Mute the speaker on your computer, and then load the page again in another browser tab.

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
