import { contextBridge, ipcRenderer } from 'electron';

export type Importance = 1 | 2 | 3 | 4 | 5;
export type CharacterId = 'clawd' | 'catto' | 'pup' | 'bunny';

export interface Settings {
  lastTaskName: string;
  lastDurationMin: number;
  lastImportance: Importance;
  lastCharacter: CharacterId;
  widgetPos: { x: number; y: number; width: number; height: number } | null;
  widgetSize: { width: number; height: number };
}

const api = {
  getSettings: () => ipcRenderer.invoke('settings:get') as Promise<Settings>,
  setSettings: (partial: Partial<Settings>) =>
    ipcRenderer.invoke('settings:set', partial) as Promise<Settings>,
  startSession: (session: Partial<Settings>) =>
    ipcRenderer.invoke('session:start', session) as Promise<void>,
  cancelSession: () => ipcRenderer.invoke('session:cancel') as Promise<void>,
  notifyDone: (payload: { taskName: string }) =>
    ipcRenderer.invoke('session:done', payload) as Promise<void>,
  setMinimized: (minimized: boolean) =>
    ipcRenderer.invoke('widget:setMinimized', minimized) as Promise<void>,
  startNewSession: () => ipcRenderer.invoke('widget:newSession') as Promise<void>,
  resizeBy: (deltaPx: number) =>
    ipcRenderer.invoke('widget:resizeBy', deltaPx) as Promise<{ width: number; height: number } | null>,
};

contextBridge.exposeInMainWorld('focusApp', api);

export type FocusApi = typeof api;
