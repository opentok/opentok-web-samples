/* global OT Promise */
// This file exposes a publish function which when called returns a Promise
// to an OpenTok Publisher and a setPanValue function. The Publisher
// returned uses a custom audioSource playing audio from a file with stereo
// enabled. The setPanValue function can be used to pan audio between left
// and right stereo channels.

((exports) => {
  const getAudioBuffer = (url, audioContext) => (
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(audioData => new Promise((resolve, reject) => {
        audioContext.decodeAudioData(audioData, resolve, reject);
      }))
  );

  const createAudioStream = (audioBuffer, audioContext) => {
    const startTime = audioContext.currentTime;

    const player = audioContext.createBufferSource();
    player.buffer = audioBuffer;
    player.start(startTime);
    player.loop = true;

    const destination = audioContext.createMediaStreamDestination();

    // createStereoPanner available in Chrome 42+, Firefox 37+, Edge
    const panner = audioContext.createStereoPanner();
    panner.pan.value = 0;
    panner.connect(destination);
    player.connect(panner);

    const setPanValue = (value) => {
      panner.pan.value = Number(value).toFixed(1);
    };
    setPanValue(0);

    return {
      audioStream: destination.stream,
      setPanValue,
      stop() {
        panner.disconnect();
        player.disconnect();
        player.stop();
      }
    };
  };

  // Returns a Promise to a Publisher
  const publish = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Request access to the microphone and camera
    return Promise.all([
      getAudioBuffer('./media/funkloop.mp3', audioContext),
      OT.getUserMedia({ audioSource: null })
    ]).then((results) => {
      const [audioBuffer, videoStream] = results;
      const {
        audioStream,
        setPanValue,
        stop
      } = createAudioStream(audioBuffer, audioContext);

      const publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        // Pass in the video track from our underlying mediaStream as the videoSource
        videoSource: videoStream.getVideoTracks()[0],
        // Pass in the generated audio track as our custom audioSource
        audioSource: audioStream.getAudioTracks()[0],
        // Enable stereo audio
        enableStereo: true,
        // Increasing audio bitrate is recommended for stereo music
        audioBitrate: 128000
      };
      return new Promise((resolve, reject) => {
        const publisher = OT.initPublisher('publisher', publisherOptions, (err) => {
          if (err) {
            stop();
            reject(err);
          } else {
            resolve({ publisher, setPanValue });
          }
        });
        publisher.on('destroyed', () => {
          // When the publisher is destroyed we cleanup
          stop();
          audioContext.close();
        });
      });
    }).catch((error) => {
      audioContext.close();
      throw error;
    });
  };

  exports.publish = publish;
})(exports);
