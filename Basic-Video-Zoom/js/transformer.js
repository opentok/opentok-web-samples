/* eslint-disable no-unused-vars */
/* global VideoFrame */

const FACE_DETECTION_TIME_GAP = 20000;

export default class LouReedTransformer {
  mediapipeResult_;
  visibleRectDimension;

  constructor() {
    console.log('transformer initializing');
    this.faceDetectionlastTimestamp = 0;
    this.padding = {
        width: 30,
        height: 120
    }
    this.videoInfo = null
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
    if(faceDetectionresult instanceof ImageBitmap){
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
        height: frame.displayHeight
      }
    }

    const timestamp = frame.timestamp;
    createImageBitmap(frame).then( image =>{
      frame.close()
      this.processFrame(controller, image, timestamp)
    }).catch(e => {
      controller.enqueue(frame)
    })
  }

  processFrame (controller, image, timestamp) {
      // Face Detection
    if (timestamp - this.faceDetectionlastTimestamp >= FACE_DETECTION_TIME_GAP){
      this.faceDetectionlastTimestamp = timestamp;
      postMessage(image)
    }

    if (this.visibleRectDimension) {
      const resizeFrame = new VideoFrame(image, {
        visibleRect: {
            x: this.visibleRectDimension.visibleRectX,
            y: this.visibleRectDimension.visibleRectY,
            width: this.visibleRectDimension.visibleRectWidth,
            height: this.visibleRectDimension.visibleRectHeight
        },
        timestamp,
        alpha: 'discard'
      })
      controller.enqueue(resizeFrame)
    }
    else {
      controller.enqueue(new VideoFrame(image, {timestamp, alpha: 'discard'}))
    }
    image.close()
  }

calculateDimensions() {
    let faceDetectionresult = this.mediapipeResult_ ;
    if (!faceDetectionresult || !this.videoInfo) return;
    let newWidth = Math.floor((faceDetectionresult.width * this.videoInfo.width) + (this.padding.width*2));
    let newHeight = Math.floor((faceDetectionresult.height * this.videoInfo.height) + (this.padding.height*2));
    let newX = Math.floor((faceDetectionresult.xCenter * this.videoInfo.width) - (faceDetectionresult.width * this.videoInfo.width)/2) - this.padding.width;
    newX = Math.max(0, newX);
    let newY = Math.floor((faceDetectionresult.yCenter * this.videoInfo.height) - (faceDetectionresult.height * this.videoInfo.height)/2) - this.padding.height;
    newY = Math.max(0, newY);

    
    if (!this.visibleRectDimension || Math.abs(newX - this.visibleRectDimension.visibleRectX) >=  1 || Math.abs(newY - this.visibleRectDimension.visibleRectY) >= 1 ) {
        // Ensure x and y is even value
        let visibleRectX = (( newX % 2) === 0) ? newX : (newX + 1);
        let visibleRectY = (( newY % 2) === 0) ? newY : (newY + 1);
        // Ensure visibleRectWidth and visibleRectHeight fall within videoWidth and videoHeight
        let visibleRectWidth = (visibleRectX + newWidth) > this.videoInfo.width ? (this.videoInfo.width -  visibleRectX) : newWidth
        let visibleRectHeight = (visibleRectY + newHeight) > this.videoInfo.height ? (this.videoInfo.height -  visibleRectY) : newHeight

        this.visibleRectDimension= {
        visibleRectX,
        visibleRectY,
        visibleRectWidth,
        visibleRectHeight
        }
    }
}

  flush() {
    console.log('canvas transformer flush');
  }
}
