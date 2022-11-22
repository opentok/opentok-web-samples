OpenTok.js Publish from a Canvas Sample
===========================

In this sample application we show you how to publish a custom stream from a Canvas tag. This sample just creates a simple Publisher without actually publishing it to a Session. For a more detailed example that uses a Canvas to apply a filter to your Camera have a look at the [Stream-Filter](../Stream-Filter) sample.

As of v2.13 of opentok.js you can set a custom audio source and video source for a publisher's stream when you call [`OT.initPublisher()`](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher). The custom audio and video source are [`MediaStreamTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) objects. In this sample we obtain a `MediaStreamTrack` from a canvas, using the [`Canvas.captureStream()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream) method to get a `MediaStream` object, and then call `getVideoTracks()[0]` on that object to get the video `MediaStreamTrack` object.

## Demo

You can see a demo of this app running at [opentok.github.io/opentok-web-samples/Publish-Canvas](https://opentok.github.io/opentok-web-samples/Publish-Canvas)

## Running the App

* Simply open [index.html](index.html) in your browser.

## Known Limitations

* The custom streaming API works on Chrome 51+, Firefox 49+ and Safari 11+. It does not work in IE or Edge browsers.
* If the browser window loses focus (eg. you open a new tab) then the video will pause or become really slow. This is because it is using setInterval to draw the video which is limited when the tab is not in focus.
