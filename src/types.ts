import type { CharacterId } from './data/characters';

export type Importance = 1 | 2 | 3 | 4 | 5;

export type Phase = 'running' | 'paused' | 'done';

export type Facing = 'left' | 'right';

export type ThemeMode = 'dark' | 'light';

export interface SessionConfig {
  taskName: string;
  durationMin: number;
  importance: Importance;
  character: CharacterId;
}

export interface FocusApi {
  getSettings: () => Promise<{
    lastTaskName: string;
    lastDurationMin: number;
    lastImportance: Importance;
    lastCharacter: CharacterId;
    themeMode: ThemeMode;
    widgetPos: { x: number; y: number; width: number; height: number } | null;
    widgetSize: { width: number; height: number };
  }>;
  setSettings: (partial: Record<string, unknown>) => Promise<unknown>;
  startSession: (session: {
    lastTaskName: string;
    lastDurationMin: number;
    lastImportance: Importance;
    lastCharacter: CharacterId;
  }) => Promise<void>;
  cancelSession: () => Promise<void>;
  notifyDone: (payload: { taskName: string }) => Promise<void>;
  startNewSession: () => Promise<void>;
  resizeBy: (deltaPx: number) => Promise<{ width: number; height: number } | null>;
}

declare global {
  interface Window {
    focusApp: FocusApi;
  }
}
