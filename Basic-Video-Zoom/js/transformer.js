/* eslint-disable no-unused-vars */
/* global VideoFrame */

const FACE_DETECTION_TIME_GAP = 20000;

export default class ResizeTransformer {
  mediapipeResult_;
  visibleRectDimension;
  frameMovingSteps;
  visibleRectDimensionState;

  constructor() {
    console.log('transformer initializing');
    this.faceDetectionlastTimestamp = 0;
    this.padding = {
      width: 30,
      height: 120
    };
    this.videoInfo = null;
    this.frameMovingSteps = {
      x: 1,
      y: 1,
      width: 1,
      height: 1
    };
  }

  start() {
    console.log('transformer starting');
    this.canvas_ = new OffscreenCanvas(1, 1);
    this.ctx_ = this.canvas_.getContext('2d', { alpha: false, desynchronized: true });
    if (!this.ctx_) {
      throw new Error('Unable to create CanvasRenderingContext2D');
    }
  }

  onResult(faceDetectionresult) {
    if (faceDetectionresult instanceof ImageBitmap) {
      return;
    }

    this.mediapipeResult_ = faceDetectionresult;
    this.calculateDimensions();
  }

  async transform(frame, controller) {
    console.log('transformer transforming');

    if (!this.videoInfo) {
      this.videoInfo = {
        width: frame.displayWidth,
        height: frame.displayHeight,
        frameRate: 30 // Set to 30, ideal case: get actual framerate from camera track
      };
    }

    const timestamp = frame.timestamp;
    createImageBitmap(frame).then( image =>{
      frame.close();
      this.processFrame(controller, image, timestamp);
    }).catch(e => {
      controller.enqueue(frame);
    });
  }

  processFrame(controller, image, timestamp) {
    // Face Detection
    if (timestamp - this.faceDetectionlastTimestamp >= FACE_DETECTION_TIME_GAP) {
      this.faceDetectionlastTimestamp = timestamp;
      postMessage(image);
    }

    if (this.visibleRectDimension) {
      if (this.visibleRectDimensionState.visibleRectX !== this.visibleRectDimension.visibleRectX) this.visibleRectDimensionState.visibleRectX = this.visibleRectDimensionState.visibleRectX > this.visibleRectDimension.visibleRectX ? this.visibleRectDimensionState.visibleRectX - this.frameMovingSteps.x : this.visibleRectDimensionState.visibleRectX + this.frameMovingSteps.x;
      if (this.visibleRectDimensionState.visibleRectY !== this.visibleRectDimension.visibleRectY) this.visibleRectDimensionState.visibleRectY = this.visibleRectDimensionState.visibleRectY > this.visibleRectDimension.visibleRectY ? this.visibleRectDimensionState.visibleRectY - this.frameMovingSteps.y : this.visibleRectDimensionState.visibleRectY + this.frameMovingSteps.y;
      if (this.visibleRectDimensionState.visibleRectWidth !== this.visibleRectDimension.visibleRectWidth) this.visibleRectDimensionState.visibleRectWidth = this.visibleRectDimensionState.visibleRectWidth > this.visibleRectDimension.visibleRectWidth ? this.visibleRectDimensionState.visibleRectWidth - this.frameMovingSteps.width : this.visibleRectDimensionState.visibleRectWidth + this.frameMovingSteps.width;
      if (this.visibleRectDimensionState.visibleRectHeight !== this.visibleRectDimension.visibleRectHeight) this.visibleRectDimensionState.visibleRectHeight = this.visibleRectDimensionState.visibleRectHeight > this.visibleRectDimension.visibleRectHeight ? this.visibleRectDimensionState.visibleRectHeight - this.frameMovingSteps.height : this.visibleRectDimensionState.visibleRectHeight + this.frameMovingSteps.height;

      if (Math.abs(this.visibleRectDimensionState.visibleRectX - this.visibleRectDimension.visibleRectX) <= this.frameMovingSteps.x) this.visibleRectDimensionState.visibleRectX = this.visibleRectDimension.visibleRectX;
      if (Math.abs(this.visibleRectDimensionState.visibleRectY  - this.visibleRectDimension.visibleRectY) <= this.frameMovingSteps.y) this.visibleRectDimensionState.visibleRectY = this.visibleRectDimension.visibleRectY;
      if (Math.abs(this.visibleRectDimensionState.visibleRectWidth  - this.visibleRectDimension.visibleRectWidth) <= this.frameMovingSteps.width) this.visibleRectDimensionState.visibleRectWidth = this.visibleRectDimension.visibleRectWidth;
      if (Math.abs(this.visibleRectDimensionState.visibleRectHeight  - this.visibleRectDimension.visibleRectHeight) <= this.frameMovingSteps.height) this.visibleRectDimensionState.visibleRectHeight = this.visibleRectDimension.visibleRectHeight;

      let deltaX = this.visibleRectDimensionState.visibleRectX + this.visibleRectDimensionState.visibleRectWidth;
      let deltaY = this.visibleRectDimensionState.visibleRectY + this.visibleRectDimensionState.visibleRectHeight;

      if (deltaX > this.videoInfo.width) this.visibleRectDimensionState.visibleRectWidth = this.visibleRectDimensionState.visibleRectWidth - (deltaX - this.videoInfo.width);
      if (deltaY > this.videoInfo.height) this.visibleRectDimensionState.visibleRectHeight = this.visibleRectDimensionState.visibleRectHeight - (deltaY - this.videoInfo.height);

      const resizeFrame = new VideoFrame(image, {
        visibleRect: {
          x: this.visibleRectDimensionState.visibleRectX,
          y: this.visibleRectDimensionState.visibleRectY,
          width: this.visibleRectDimensionState.visibleRectWidth,
          height: this.visibleRectDimensionState.visibleRectHeight
        },
        timestamp,
        alpha: 'discard'
      });
      controller.enqueue(resizeFrame);
    } else {
      controller.enqueue(new VideoFrame(image, {timestamp, alpha: 'discard'}));
    }
    image.close();
  }

  calculateDimensions() {
    let faceDetectionresult = this.mediapipeResult_;
    if (!faceDetectionresult || !this.videoInfo) return;
    let newWidth = Math.floor((faceDetectionresult.width * this.videoInfo.width) + (this.padding.width * 2));
    let newHeight = Math.floor((faceDetectionresult.height * this.videoInfo.height) + (this.padding.height * 2));
    let newX = Math.floor((faceDetectionresult.xCenter * this.videoInfo.width) - (faceDetectionresult.width * this.videoInfo.width) / 2) - this.padding.width;
    newX = Math.max(0, newX);
    let newY = Math.floor((faceDetectionresult.yCenter * this.videoInfo.height) - (faceDetectionresult.height * this.videoInfo.height) / 2) - this.padding.height;
    newY = Math.max(0, newY);


    if (!this.visibleRectDimension || Math.abs(newX - this.visibleRectDimension.visibleRectX) > 10 || Math.abs(newY - this.visibleRectDimension.visibleRectY) > 10 ) {
      // Ensure x and y is even value
      let visibleRectX = (( newX % 2) === 0) ? newX : (newX + 1);
      let visibleRectY = (( newY % 2) === 0) ? newY : (newY + 1);
      // Ensure visibleRectWidth and visibleRectHeight fall within videoWidth and videoHeight
      let visibleRectWidth = (visibleRectX + newWidth) > this.videoInfo.width ? (this.videoInfo.width -  visibleRectX) : newWidth;
      let visibleRectHeight = (visibleRectY + newHeight) > this.videoInfo.height ? (this.videoInfo.height -  visibleRectY) : newHeight;

      this.visibleRectDimension = {
        visibleRectX,
        visibleRectY,
        visibleRectWidth,
        visibleRectHeight
      };
      if (!this.visibleRectDimensionState) this.visibleRectDimensionState = this.visibleRectDimension;
      else {
        this.frameMovingSteps = {
          x: Math.max(Math.floor(Math.abs(this.visibleRectDimensionState.visibleRectX - this.visibleRectDimension.visibleRectX) / (this.videoInfo.frameRate / 5)), 1),
          y: Math.max(Math.floor(Math.abs(this.visibleRectDimensionState.visibleRectY - this.visibleRectDimension.visibleRectY) / (this.videoInfo.frameRate / 5)), 1),
          width: Math.max(Math.floor(Math.abs(this.visibleRectDimensionState.visibleRectWidth - this.visibleRectDimension.visibleRectWidth) / (this.videoInfo.frameRate / 5)), 1),
          height: Math.max(Math.floor(Math.abs(this.visibleRectDimensionState.visibleRectHeight - this.visibleRectDimension.visibleRectHeight) / (this.videoInfo.frameRate / 5)), 1)
        };
      }
    }
  }

  flush() {
    console.log('canvas transformer flush');
  }
}
