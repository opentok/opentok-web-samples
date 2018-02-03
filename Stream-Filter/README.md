OpenTok.js Stream Filter Sample
=======================

As of v2.13 of opentok.js you can pass a custom videoSource and audioSource to the Publisher. This sample shows how to use this API to apply custom filters to a Publisher. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example but it adds a [publish.js](./js/publish.js) and [filters.js](./js/filters.js) files which handle publishing a custom videoSource and audioSource.

You can set a custom audio source and video source for a publisher's stream when you call [`OT.initPublisher()`](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher). The custom audio and video source are [`MediaStreamTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) objects.

In this example, we use the [`OT.getUserMedia()`](https://tokbox.com/developer/sdks/js/reference/OT.html#getUserMedia) method (from OpenTok.js) to get a reference to a [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) object that uses the microphone and camera as the audio and video source.

The sample attaches the video `MediaStreamTrack` (from the `MediaStream` object) to an HTML canvas, manipulates the canvas's image (for example, applying a grayscale filter -- see the video-filters.js file). It then obtains the resulting `MediaStreamTrack` from the canvas, using the [`Canvas.captureStream()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream) method to get a `MediaStream` object, and it calls `getVideoTracks()[0]` on that object to get the video `MediaStreamTrack` object. Finally, it uses that `MediaStreamTrack` object when calling `OT.initPublisher()`.

The sample obtains an audio `MediaStreamTrack` object obtained by calling `getAudioTracks()[0]`
on the MediaStream returned by the call to `OT.getUserMedia()`. It uses this audio
`MediaStreamTrack` object as the `audioSource` when calling `OT.initPublisher()`. The sample
creates a [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) object and
calls its `createMediaStreamSource()` method, passing in the `MediaStream` object, to create a
[`MediaStreamAudioSourceNode`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode) object.
See the audio-filters.js file. This file also includes functions that apply
different audio effects to the `MediaStreamAudioSourceNode`.

## Running the App

Follow the instructions at [Basic Video Chat](../Basic%20Video%20Chat/)

## Known Limitations

 * The custom streaming API works on Chrome 51+, Firefox 49+ and Safari 11+. It does not work in IE or Edge browsers.
 * If the browser window loses focus (eg. you open a new tab) then the video will pause or become really slow. This is because it is using requestAnimationFrame to draw the video which is limited when the tab is not in focus.
