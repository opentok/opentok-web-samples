const {
  desktopCapturer,
  contextBridge
} = require('electron');

// Expose desktopCapturer so that the SDK can access it
// via window.electron.desktopCapturer
contextBridge.exposeInMainWorld(
  'electron', {
    desktopCapturer
  }
);
