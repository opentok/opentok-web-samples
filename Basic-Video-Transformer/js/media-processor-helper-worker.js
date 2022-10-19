import { MyTransformer } from './transformer';

class MediaProcessorHelperWorker {
  constructor() {
    this.worker = new Worker('./worker.js');
    this.worker.addEventListener('message', msg => {
    });
  }

  async transform(readable, writable) {

  }
}
