// Expose APIs to the renderer process securely
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('myAPI', {
  sayHello: () => 'Hello from preload script!',
});
