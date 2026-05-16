#!/usr/bin/env node
/**
 * Production launch script.
 * - Builds renderer + electron bundles if they don't exist yet
 * - Spawns Electron pointing at the built main process
 *
 * For a clean rebuild, run `npm run build` first.
 */
import { spawnSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const isWin = process.platform === 'win32';

const mainBundle = resolve(root, 'dist-electron', 'main.js');
const preloadBundle = resolve(root, 'dist-electron', 'preload.js');
const rendererBundle = resolve(root, 'dist', 'index.html');

const bundlesPresent =
  existsSync(mainBundle) && existsSync(preloadBundle) && existsSync(rendererBundle);

if (!bundlesPresent) {
  console.log('[focus-companion] first launch — building bundles...');
  const r = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    shell: isWin, // Windows needs shell for .cmd resolution
  });
  if (r.status !== 0) {
    console.error('[focus-companion] build failed (exit ' + r.status + ')');
    process.exit(r.status ?? 1);
  }
}

const electronBin = isWin ? 'electron.cmd' : 'electron';
const electronPath = resolve(root, 'node_modules', '.bin', electronBin);
if (!existsSync(electronPath)) {
  console.error('[focus-companion] electron not installed — run `npm install` in this directory first');
  process.exit(1);
}

console.log('[focus-companion] launching app');
const child = spawn(electronPath, ['.'], {
  cwd: root,
  stdio: 'inherit',
  shell: isWin,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
