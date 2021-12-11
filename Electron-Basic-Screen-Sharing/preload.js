const {
  // comment the following line in to test screen sharing in Electron 12-16
  // desktopCapturer,
  contextBridge,
  // comment the following line out to test screen sharing in Electron 12-16
  ipcRenderer
} = require('electron');

// comment the desktopCapturer object out to test screen sharing in Electron 12-16
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
