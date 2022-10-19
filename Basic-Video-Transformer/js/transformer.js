export class GreyScaleTransformer {
  constructor(message) {
    this.startCanvas_ = new OffscreenCanvas(1, 1);
    this.startCtx_ = this.startCanvas_.getContext('2d');
    this.message_ = message;
    if (!this.startCtx_) {
      throw new Error('Unable to create CanvasRenderingContext2D');
    }
  }

  start(controller) {
    console.log('this is a controller', controller);
    // In this sample nothing needs to be done.
  }

  transform(frame, controller) {
    this.startCanvas_.width = frame.displayWidth;
    this.startCanvas_.height = frame.displayHeight;
    let timestamp = frame.timestamp;
    this.startCtx_.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
    this.startCtx_.filter = 'grayscale(100%)';
    frame.close();
    // eslint-disable-next-line no-undef
    controller.enqueue(new VideoFrame(this.startCanvas_, { timestamp, alpha: 'discard' }));
  }

  flush(controller) {
    console.log('this is a controller', controller);
    // In this sample nothing needs to be done.
  }
}
