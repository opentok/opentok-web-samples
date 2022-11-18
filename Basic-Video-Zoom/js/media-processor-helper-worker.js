import { MediapipeHelper } from '../node_modules/@vonage/ml-transformers/dist/ml-transformers.es.js';

export class WorkerMediaProcessor {
  constructor() {
    console.log('WorkerMediaProcessor started');
    this.worker = new Worker('js/worker.js', { type: 'module' });
    this.worker.postMessage({
      operation: 'init'
    });
    this.mediaPipeHelper = new MediapipeHelper();
    this.mediaPipeHelper.initialize({
      mediaPipeModelConfigArray: [{modelType: 'face_detection', options: {
        selfieMode: false,
        minDetectionConfidence: 0.5,
        model: 'short'
      },
      listener: (results) => {
        if (results && results.detections.length !== 0) {
          this.worker.postMessage({
            operation: 'onResults',
            result: results.detections[0].boundingBox
          });
        }
      }}]
    });
    this.worker.addEventListener('message', (msg) => {
      if (msg.data instanceof ImageBitmap) {
        this.mediaPipeHelper.send(msg.data).then( () => {
          msg.data.close();
        })
          .catch(e => {
            console.log('error: ', e);
          });
      }
    });
  }


  async transform(readable, writable) {
    console.log('WorkerMediaProcessor transforming');
    this.worker.postMessage(
      {
        operation: 'transform',
        readable,
        writable
      },
      [readable, writable]
    );
  }

  destroy() {
    this.worker.postMessage({
      operation: 'destroy'
    });
  }
}
