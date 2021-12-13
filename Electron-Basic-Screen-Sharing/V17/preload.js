const {
  contextBridge,
  ipcRenderer
} = require('electron');

// Event emitter to send asynchronous messages to the main process. The
// corresponding ipcMain handler listens for the 'DESKTOP_CAPTURER_GET_SOURCES'
// channel and returns an array of the available DesktopCapturerSource objects.
const desktopCapturer = {
  getSources: (opts) => ipcRenderer.invoke('DESKTOP_CAPTURER_GET_SOURCES', opts)
};

// Expose desktopCapturer so that the SDK can access it
// via window.electron.desktopCapturer
contextBridge.exposeInMainWorld(
  'electron', {
    desktopCapturer
  }
);
