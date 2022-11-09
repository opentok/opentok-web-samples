export class WorkerMediaProcessor {
  constructor() {
    this.worker = new Worker('js/worker.js', { type: 'module' });
    this.worker.postMessage({
      operation: 'init'
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
