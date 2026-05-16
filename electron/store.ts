import Store from 'electron-store';

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

const defaults: Settings = {
  lastTaskName: '',
  lastDurationMin: 25,
  lastImportance: 3,
  lastCharacter: 'clawd',
  widgetPos: null,
  widgetSize: { width: 130, height: 180 },
};

export const store = new Store<Settings>({
  name: 'focus-companion-settings',
  defaults,
});

export const SIZE_MIN = { width: 100, height: 140 };
export const SIZE_MAX = { width: 360, height: 480 };
