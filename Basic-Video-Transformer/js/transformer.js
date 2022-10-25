/* global VideoFrame */

export class GreyScaleTransformer {
  constructor() {
    console.log('creating transformer');
    this.canvas = new OffscreenCanvas(1, 1);
    this.ctx = this.canvas.getContext('2d',
      { alpha: false, desynchronized: true }
    );
    if (!this.ctx) {
      throw new Error('Unable to create CanvasRenderingContext2D');
    }
    console.log('finished creating transformer');
  }

  start(controller) {
    console.log('this is a controller', controller);
    // In this sample nothing needs to be done.
  }

  transform(frame, controller) {
    console.log('transformer started');
    this.canvas.width = frame.displayWidth;
    this.canvas.height = frame.displayHeight;
    const timestamp = frame.timestamp;
    // my stuff
    // this.ctx.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
    // this.ctx.filter = 'grayscale(100%)';
    // frame.close();
    // controller.enqueue(new VideoFrame(this.canvas, { timestamp, alpha: 'discard' }));

    // blue line from sample app
    this.ctx.drawImage(frame, 0, 0);
    frame.close();
    this.ctx.shadowColor = '#34ebc3';
    this.ctx.shadowBlur = 20;
    this.ctx.lineWidth = 50;
    this.ctx.strokeStyle = '#34ebc3';
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    controller.enqueue(new VideoFrame(this.canvas_, { timestamp, alpha: 'discard' }));
  }

  flush(controller) {
    console.log('this is a controller', controller);
    // In this sample nothing needs to be done.
  }
}
