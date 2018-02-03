// This file exposes an AudioFilters object which has methods for different audio filters:
// none, grayscale, sepia and invert. It also has a selectedFilter property which is the currently
// selected filter.

(function closure(exports) {
  var mediaStream;
  var audioCtx;
  var audioSource;
  var AudioFilters = {

    init: function init(stream) {
      audioCtx = new AudioContext();
      mediaStream = stream;
      audioSource = audioCtx.createMediaStreamSource(mediaStream);
      return stream.getAudioTracks()[0];
    },

    none: function none() {
      audioSource.disconnect();
    },

    echo: function echo() {
      audioSource.disconnect();
      var delayNode = audioCtx.createDelay();
      var feedbackNode = audioCtx.createGain();
      var bypassNode = audioCtx.createGain();
      var masterNode = audioCtx.createGain();

      delayNode.delayTime.value = 0.5;
      feedbackNode.gain.value = 0.4;
      bypassNode.gain.value = 0.6;

      audioSource.connect(delayNode);
      delayNode.connect(feedbackNode);
      feedbackNode.connect(delayNode);
      delayNode.connect(bypassNode);
      bypassNode.connect(masterNode);
      audioSource.connect(masterNode);
      masterNode.connect(audioCtx.destination);
    },
    
    distortion: function distortion() {
      // Thanks to https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
      // and https://stackoverflow.com/questions/22312841/
      audioSource.disconnect();
      var distortion = audioCtx.createWaveShaper();

      function makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 50,
          n_samples = 44100,
          curve = new Float32Array(n_samples),
          deg = Math.PI / 180,
          i = 0,
          x;
        for ( ; i < n_samples; ++i ) {
          x = i * 2 / n_samples - 1;
          curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        }
        return curve;
      };

      distortion.curve = makeDistortionCurve(200);
      distortion.oversample = '4x';
      audioSource.connect(distortion);
      distortion.connect(audioCtx.destination);
    }
  };

  // Set the initial filter to none
  AudioFilters.selectedFilter = AudioFilters.none;

  // When the filter selector changes we update the selectedFilter
  var audioFilterSelector = document.querySelector('#audio-filter');
  audioFilterSelector.addEventListener('change', function change() {
    AudioFilters.selectedFilter = AudioFilters[audioFilterSelector.value];
    AudioFilters[audioFilterSelector.value]();

  });

  exports.AudioFilters = AudioFilters;
})(exports);
