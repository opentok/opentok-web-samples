/* global OT Promise */
// This file exposes a publish function on window which when called returns a Promise to
// an OpenTok Publisher. The Publisher returned uses a custom videoSource while applies the
// currently selected filter.

// Draws a video to a canvas and applies the selected filter

(function closure(exports) {
  var getFilteredCanvas = function getFilteredCanvas(mediaStream) {
    var WIDTH = 640;
    var HEIGHT = 480;
    var videoEl = document.createElement('video');
    videoEl.srcObject = mediaStream;
    videoEl.setAttribute('playsinline', '');
    videoEl.muted = true;
    setTimeout(function timeout() {
      videoEl.play();
    });
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = WIDTH;
    tmpCanvas.height = HEIGHT;

    videoEl.addEventListener('resize', function resize() {
      canvas.width = tmpCanvas.width = videoEl.videoWidth;
      canvas.height = tmpCanvas.height = videoEl.videoHeight;
    });

    var reqId;

    // Draw each frame of the video
    var drawFrame = function drawFrame() {
      // Draw the video element onto the temporary canvas and pull out the image data
      tmpCtx.drawImage(videoEl, 0, 0, tmpCanvas.width, tmpCanvas.height);
      var imgData = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
      // Apply the currently selected filter and get the new image data
      imgData = exports.Filters.selectedFilter(imgData);
      // Draw the filtered image data onto the main canvas
      ctx.putImageData(imgData, 0, 0);

      reqId = requestAnimationFrame(drawFrame);
    };

    reqId = requestAnimationFrame(drawFrame);

    return {
      canvas: canvas,
      stop: function stop() {
        // Stop the video element, the media stream and the animation frame loop
        videoEl.pause();
        if (mediaStream.stop) {
          mediaStream.stop();
        }
        if (MediaStreamTrack && MediaStreamTrack.prototype.stop) {
          // Newer spec
          mediaStream.getTracks().forEach(function each(track) { track.stop(); });
        }
        cancelAnimationFrame(reqId);
      }
    };
  };

  // Returns a Promise to a Publisher
  var publish = function publish() {
    // Request access to the microphone and camera
    return OT.getUserMedia().then(function gotMedia(mediaStream) {
      var filteredCanvas = getFilteredCanvas(mediaStream);

      var publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        // Pass in the canvas stream video track as our custom videoSource
        videoSource: filteredCanvas.canvas.captureStream(30).getVideoTracks()[0],
        // Pass in the audio track from our underlying mediaStream as the audioSource
        audioSource: mediaStream.getAudioTracks()[0]
      };
      return new Promise(function promise(resolve, reject) {
        var publisher = OT.initPublisher('publisher', publisherOptions, function initComplete(err) {
          if (err) {
            filteredCanvas.stop();
            reject(err);
          } else {
            resolve(publisher);
          }
        });
        publisher.on('destroyed', function destroyed() {
          // When the publisher is destroyed we cleanup
          filteredCanvas.stop();
        });
        publisher.on('streamCreated', function created() {
          // We use this for testing so we know when we are publishing successfully
          publisher.element.dataset.streamCreated = true;
        });

        // We insert the canvas into the publisher element on iOS because the video element
        // just stays black otherwise because of a bug https://bugs.webkit.org/show_bug.cgi?id=181663
        if (navigator.userAgent.indexOf('iPhone OS') > -1) {
          publisher.on('videoElementCreated', function videoElementCreated(event) {
            event.element.parentNode.insertBefore(filteredCanvas.canvas, event.element);
            filteredCanvas.canvas.style.width = '100%';
            filteredCanvas.canvas.style.height = '100%';
            filteredCanvas.canvas.style.position = 'absolute';
            filteredCanvas.canvas.style.zIndex = 1;
            filteredCanvas.canvas.style.objectFit = window.getComputedStyle(event.element).objectFit;
          });
        }
      });
    });
  };

  exports.publish = publish;
})(exports);
