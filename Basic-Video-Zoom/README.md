OpenTok.js Basic Video Zoom
=======================

This sample application shows how to use a basic transformer to zoom the publisher with the Vonage
video APIs.

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Basic-Video-Zoom/](https://opentok.github.io/opentok-web-samples/Basic-Video-Zoom/)

> **Note** The demo is setup so that a new room is generated based on your public IP address. So will only work if you are connecting from 2 browsers on the same network.

## Running the App
Install the Node modules used by the app:
npm install;

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:
* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

Also, you need to run this app on an HTTP server. Because of security restrictions,
the app does not work on a file: URL. (On macOS, you can serve the app by running
`python3 -m http.server`.)

## Transforming the Video Stream

After connecting to the session, and publishing the audio-video stream, transform the video stream.
```javascript
  const transformStream = async (publisher) => {
    if (OT.hasMediaProcessorSupport()) {
      const mediaProcessor = new WorkerMediaProcessor();
      const mediaProcessorConnector = new MediaProcessorConnector(
        mediaProcessor
      );

      publisher
        .setVideoMediaProcessorConnector(mediaProcessorConnector)
        .catch((e) => {
          throw e;
        });
    }
  }
```

Send video image to mediaPipeHelper periodically to get the detected face dimension.
```javascript
   if (timestamp - this.faceDetectionlastTimestamp >= FACE_DETECTION_TIME_GAP){
      this.faceDetectionlastTimestamp = timestamp;
      postMessage(image)
    }
```

Resize videoFrame with the face dimension result reported by the mediaPipeHelper .
```javascript
      const resizeFrame = new VideoFrame(image, {
        visibleRect: {
            x: this.visibleRectDimensionState.visibleRectX,
            y: this.visibleRectDimensionState.visibleRectY,
            width: this.visibleRectDimensionState.visibleRectWidth,
            height: this.visibleRectDimensionState.visibleRectHeight
        },
        timestamp,
        alpha: 'discard'
      })
      controller.enqueue(resizeFrame)
```

