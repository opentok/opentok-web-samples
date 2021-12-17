OpenTok.js Electron Basic Screen-Sharing Sample (Electron 17)
=======================

This sample application shows how to publish a screen-sharing stream in a basic 
Electron application using the latest Electron version. The basics of video-chat
on Electron are covered [here](../Electron-Basic-Video-Chat). The application
creates a Publisher object while passing the screen in as the video source.

## Starting the Application
1. Get values for your OpenTok API key, session ID, and token. You can obtain these values from your TokBox account. Make sure that the token isn't expired.
For testing, you can use a session ID and token generated at your TokBox account page. However, the final application should obtain these values using the [OpenTok server SDKs](https://tokbox.com/developer/sdks/server/). For more information, see the OpenTok developer guides on [session creation](https://tokbox.com/developer/guides/create-session/) and [token creation](https://tokbox.com/developer/guides/create-token/).

2. `$ npm install`

3. `$ npm start`

## Differences Between Electron Versions
* Electron version 5 [changed the contextIsolation default from false to true and
changed the nodeIntegration default from true to false](https://www.electronjs.org/docs/latest/breaking-changes#default-changed-nodeintegration-and-webviewtag-default-to-false-contextisolation-defaults-to-true). The nodeIntegration
property allows Electron to use node APIs like require and process.
* Electron versions 12-16 have two different approaches to enabling
screen-sharing after
[the default contextIsolation property changed from `false` to `true`](https://www.electronjs.org/docs/latest/breaking-changes#default-changed-contextisolation-defaults-to-true).
The *recommended* approach is to launch Electron with a preload script to expose
the desktopCapturer method for the application ([see example application here](https://github.com/opentok/opentok-web-samples/tree/Electron-SS-V12-to-V16/Electron-Basic-Screen-Sharing/README.md)).
A less secure approach that restores the previous behavior is to manually set
`contextIsolation: false` on application startup.

* Electron 17 introduces a [breaking change](https://www.electronjs.org/docs/latest/breaking-changes#removed-desktopcapturergetsources-in-the-renderer)
for the `desktopCapturer.getSources` method, affecting screen-sharing.
To allow screen sharing in your application, see the documentation link above and/or
[the example application here](https://github.com/opentok/opentok-web-samples/blob/main/Electron-Basic-Screen-Sharing/README.md)
to create an event handler in the main process to listen for an event emitter
created in the renderer process.

## Electron Screen-Sharing Example Applications
* [Electron 01-04](https://github.com/cpettet/opentok-web-samples/tree/Electron-SS-V01-to-V04/Electron-Basic-Screen-Sharing) *<span style="color:red">legacy</span>*
* [Electron 05-11](https://github.com/cpettet/opentok-web-samples/tree/Electron-SS-V05-to-V11/Electron-Basic-Screen-Sharing) *<span style="color:red">legacy</span>*
* [Electron 12-16](https://github.com/cpettet/opentok-web-samples/tree/Electron-SS-V12-to-V16/Electron-Basic-Screen-Sharing) *<span style="color:green">current release</span>*
* [Electron 17](https://github.com/opentok/opentok-web-samples/tree/main/Electron-Basic-Screen-Sharing) *<span style="color:green">future release</span>*

## Known Issues

* When starting the application, you'll notice a silent error: 
  `ERROR:audio_send_stream.cc(93)] Failed to set up send codec state.`
  This is a known [Electron issue](https://github.com/electron/electron/issues/8991).
  We recommend staying up to date with the issue to see if the Electron team or other contributors have a solution.
