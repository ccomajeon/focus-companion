import { app, BrowserWindow, ipcMain, Notification, screen } from 'electron';
import path from 'node:path';
import { SIZE_MAX, SIZE_MIN, store, type Settings } from './store';

process.env.APP_ROOT = path.join(__dirname, '..');
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
const PRELOAD = path.join(__dirname, 'preload.js');

const ASPECT_RATIO = 130 / 180;

let launcherWin: BrowserWindow | null = null;
let widgetWin: BrowserWindow | null = null;

function clampSize(width: number): { width: number; height: number } {
  const w = Math.max(SIZE_MIN.width, Math.min(SIZE_MAX.width, Math.round(width)));
  const h = Math.round(w / ASPECT_RATIO);
  return { width: w, height: h };
}

function loadRoute(win: BrowserWindow, route: string) {
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(`${VITE_DEV_SERVER_URL}#${route}`);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'), { hash: route });
  }
}

function createLauncher() {
  if (launcherWin && !launcherWin.isDestroyed()) {
    launcherWin.focus();
    return;
  }

  const savedTheme = store.get('themeMode') ?? 'dark';
  const initialBg = savedTheme === 'light' ? '#FAFAFB' : '#0E0E11';

  launcherWin = new BrowserWindow({
    width: 360,
    height: 620,
    frame: false,
    resizable: false,
    transparent: false,
    backgroundColor: initialBg,
    alwaysOnTop: false,
    show: false,
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  launcherWin.once('ready-to-show', () => launcherWin?.show());
  launcherWin.on('closed', () => {
    launcherWin = null;
  });

  loadRoute(launcherWin, '/launcher');
}

function createWidget(opts: { initialState: 'running' | 'done' }) {
  if (widgetWin && !widgetWin.isDestroyed()) {
    widgetWin.focus();
    return;
  }

  const savedPos = store.get('widgetPos');
  const savedSize = store.get('widgetSize');
  const size = savedSize ?? { width: 130, height: 180 };
  const defaultBounds = (() => {
    const { workArea } = screen.getPrimaryDisplay();
    return {
      x: workArea.x + workArea.width - size.width - 40,
      y: workArea.y + 80,
      width: size.width,
      height: size.height,
    };
  })();
  const bounds = savedPos
    ? { x: savedPos.x, y: savedPos.y, width: size.width, height: size.height }
    : defaultBounds;

  widgetWin = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    minWidth: SIZE_MIN.width,
    minHeight: SIZE_MIN.height,
    maxWidth: SIZE_MAX.width,
    maxHeight: SIZE_MAX.height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    hasShadow: false,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  widgetWin.setAlwaysOnTop(true, 'screen-saver');

  let moveTimer: NodeJS.Timeout | null = null;
  widgetWin.on('move', () => {
    if (moveTimer) clearTimeout(moveTimer);
    moveTimer = setTimeout(() => {
      if (widgetWin && !widgetWin.isDestroyed()) {
        const b = widgetWin.getBounds();
        store.set('widgetPos', b);
      }
    }, 300);
  });

  widgetWin.once('ready-to-show', () => widgetWin?.show());
  widgetWin.on('closed', () => {
    widgetWin = null;
  });

  loadRoute(widgetWin, opts.initialState === 'done' ? '/done' : '/widget');
}

ipcMain.handle('settings:get', () => store.store);

ipcMain.handle('settings:set', (_evt, partial: Partial<Settings>) => {
  for (const [key, value] of Object.entries(partial)) {
    store.set(key as keyof Settings, value as never);
  }
  return store.store;
});

ipcMain.handle('session:start', (_evt, session: Partial<Settings>) => {
  for (const [key, value] of Object.entries(session)) {
    store.set(key as keyof Settings, value as never);
  }
  launcherWin?.close();
  createWidget({ initialState: 'running' });
});

ipcMain.handle('session:cancel', () => {
  widgetWin?.close();
  createLauncher();
});

ipcMain.handle('session:done', (_evt, payload: { taskName: string }) => {
  if (Notification.isSupported()) {
    new Notification({
      title: 'Focus session complete!',
      body: payload.taskName ? `${payload.taskName} — 잘 했어요` : '잘 했어요',
      silent: false,
    }).show();
  }
});

ipcMain.handle('widget:newSession', () => {
  widgetWin?.close();
  createLauncher();
});

ipcMain.handle('widget:resizeBy', (_evt, deltaPx: number) => {
  if (!widgetWin || widgetWin.isDestroyed()) return null;
  const b = widgetWin.getBounds();
  const newSize = clampSize(b.width + deltaPx);
  widgetWin.setBounds({ x: b.x, y: b.y, ...newSize });
  store.set('widgetSize', newSize);
  return newSize;
});

app.whenReady().then(() => {
  createLauncher();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createLauncher();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
