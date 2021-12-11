const {
  contextBridge,
  // desktopCapturer,
  ipcRenderer
  // ipcMain
} = require('electron');

// Expose the desktopCapturer so that the SDK can access to it
// via window.electron.desktopCapturer

const desktopCapturer = {
  getSources: (opts) =>
    ipcRenderer.invoke('DESKTOP_CAPTURER_GET_SOURCES', opts)
};

contextBridge.exposeInMainWorld(
  'electron', {
    desktopCapturer
  }
);

