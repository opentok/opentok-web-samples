/* eslint-disable no-unused-vars */
/* global VideoFrame */

class LouReedTransformer {
  constructor() {
    console.log('transformer initializing');
    this.canvas_ = null;
    this.ctx_ = null;
  }

  start() {
    console.log('transformer starting');
    this.canvas_ = new OffscreenCanvas(1, 1);
    this.ctx_ = this.canvas_.getContext('2d', { alpha: false, desynchronized: true });
    if (!this.ctx_) {
      throw new Error('Unable to create CanvasRenderingContext2D');
    }
  }

  _applyThreshold(sourceImageData, threshold = 127) {
    const src = sourceImageData.data;

    for (let i = 0; i < src.length; i += 4) {
      const r = src[i];
      const g = src[i + 1];
      const b = src[i + 2];

      // thresholding the current value
      const v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;

      src[i] = v;
      src[i + 1] = v;
      src[i + 2] = v;
    }
    return sourceImageData;
  }

  async transform(frame, controller) {
    console.log('transformer transforming');
    this.canvas_.width = frame.displayWidth;
    this.canvas_.height = frame.displayHeight;
    const timestamp = frame.timestamp;

    this.ctx_.drawImage(frame, 0, 0);
    const imageData = this.ctx_.getImageData(0, 0, this.canvas_.width, this.canvas_.height);
    frame.close();
    const outputImageData = this._applyThreshold(imageData);
    this.ctx_.putImageData(outputImageData, 0, 0);
    controller.enqueue(new VideoFrame(this.canvas_, { timestamp, alpha: 'discard' }));
  }

  flush() {
    console.log('canvas transformer flush');
  }
}
