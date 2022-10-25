export class WorkerMediaProcessor {
  constructor() {
    console.log('WorkerMediaProcessor started');
    this.worker = new Worker('js/worker.js', { type: 'module' });
    this.worker.addEventListener('message', (msg) => {
      console.log('worker event listener: ', msg.data.message);
      if (msg.data.message === 'transform') {
        this.worker.transform();
      } else if (msg.data.message === 'destroy') {
        this.worker.terminate();
      }
    });
    this.worker.postMessage({
      operation: 'init'
    });
  }

  transform(readable, writable) {
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
