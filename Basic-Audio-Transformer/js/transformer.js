/* eslint-disable no-unused-vars */
/* global Float32Array AudioData */


/*
* This Audio transformer implements a lowpass filter
* Credit to: https://github.com/maikthomas
* Adapted from: https://github.com/webrtc/samples/blob/gh-pages/src/content/insertable-streams/audio-processing/js/main.js
*/
export default class AudioTransformer {
  lastValuePerChannel = null;
  cutoff = 100;

  // eslint-disable-next-line class-methods-use-this
  start() {}

  transform(data, controller) {
    const format = 'f32-planar';
    const rc = 1.0 / (this.cutoff * 2 * Math.PI);
    const dt = 1.0 / data.sampleRate;
    const alpha = dt / (rc + dt);
    const nChannels = data.numberOfChannels;
    if (!this.lastValuePerChannel) {
      this.lastValuePerChannel = Array(nChannels).fill(0);
    }
    const buffer = new Float32Array(data.numberOfFrames * nChannels);
    for (let c = 0; c < nChannels; c++) {
      const offset = data.numberOfFrames * c;
      const samples = buffer.subarray(offset, offset + data.numberOfFrames);
      data.copyTo(samples, { planeIndex: c, format });
      let lastValue = this.lastValuePerChannel[c];

      // Apply low-pass filter to samples.
      for (let i = 0; i < samples.length; ++i) {
        lastValue += alpha * (samples[i] - lastValue);
        samples[i] = lastValue;
      }

      this.lastValuePerChannel[c] = lastValue;
    }
    controller.enqueue(
      new AudioData({
        format,
        sampleRate: data.sampleRate,
        numberOfFrames: data.numberOfFrames,
        numberOfChannels: nChannels,
        timestamp: data.timestamp,
        data: buffer
      })
    );
  }

  // eslint-disable-next-line class-methods-use-this
  flush() {
    console.log('canvas transformer flush');
  }
}
