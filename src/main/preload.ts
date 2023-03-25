import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'open-site';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    sendPOSTreq(channel: Channels, args: unknown[]) {
      ipcRenderer.send('booco-post-req', args);
    },
    postNewBooking(channel: Channels, args: unknown[]) {
      ipcRenderer.send('booco-postnewbook-req', args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
