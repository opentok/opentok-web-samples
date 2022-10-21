/* global VideoFrame */

export class GreyScaleTransformer {
  constructor() {
    this.canvas = new OffscreenCanvas(1, 1);
    this.startCtx_ = this.canvas.getContext('2d',
      { alpha: false, desynchronized: true }
    );
    if (!this.startCtx_) {
      throw new Error('Unable to create CanvasRenderingContext2D');
    }
  }

  start(controller) {
    console.log('this is a controller', controller);
    // In this sample nothing needs to be done.
  }

  transform(frame, controller) {
    this.canvas.width = frame.displayWidth;
    this.canvas.height = frame.displayHeight;
    const timestamp = frame.timestamp;
    this.startCtx_.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
    this.startCtx_.filter = 'grayscale(100%)';
    frame.close();
    controller.enqueue(new VideoFrame(this.canvas, { timestamp, alpha: 'discard' }));
  }

  flush(controller) {
    console.log('this is a controller', controller);
    // In this sample nothing needs to be done.
  }
}
