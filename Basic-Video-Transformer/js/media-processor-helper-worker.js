export class WorkerMediaProcessor {
  constructor() {
    console.log('WorkerMediaProcessor started');
    this.worker = new Worker('js/worker.js', { type: 'module' });
    this.worker.postMessage({
      operation: 'init'
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
