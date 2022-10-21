export class MediaProcessorHelperWorker {
  constructor() {
    this.worker = new Worker('js/worker.js');
    this.worker.addEventListener('message', (msg) => {
      if (msg.data.message === 'transform') {
        this.worker.transform();
      } else if (msg.data.message === 'destroy') {
        this.worker.terminate();
      }
    });
  }

  async transform(readable, writable) {
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
