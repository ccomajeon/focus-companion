#!/usr/bin/env node
/**
 * Production launch script.
 * - Builds renderer + electron bundles if they're missing OR stale
 *   (any source file under src/ or electron/ newer than the latest bundle)
 * - Spawns Electron pointing at the built main process
 *
 * Force a clean rebuild any time with `npm run build`.
 */
import { spawnSync, spawn } from 'node:child_process';
import { existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const isWin = process.platform === 'win32';

const mainBundle = resolve(root, 'dist-electron', 'main.js');
const preloadBundle = resolve(root, 'dist-electron', 'preload.js');
const rendererBundle = resolve(root, 'dist', 'index.html');

const bundles = [mainBundle, preloadBundle, rendererBundle];
const sourceDirs = ['src', 'electron'];
const sourceFiles = [
  resolve(root, 'index.html'),
  resolve(root, 'vite.config.ts'),
  resolve(root, 'package.json'),
];

function latestMtime(paths) {
  let max = 0;
  for (const p of paths) {
    if (!existsSync(p)) continue;
    const s = statSync(p);
    if (s.isDirectory()) {
      max = Math.max(max, walkDir(p));
    } else if (s.mtimeMs > max) {
      max = s.mtimeMs;
    }
  }
  return max;
}

function walkDir(dir) {
  let max = 0;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      max = Math.max(max, walkDir(p));
    } else {
      const s = statSync(p);
      if (s.mtimeMs > max) max = s.mtimeMs;
    }
  }
  return max;
}

function needsBuild() {
  if (!bundles.every(existsSync)) return true;
  const bundleTime = Math.min(...bundles.map((p) => statSync(p).mtimeMs));
  const sourceTime = latestMtime([
    ...sourceDirs.map((d) => resolve(root, d)),
    ...sourceFiles,
  ]);
  return sourceTime > bundleTime;
}

if (needsBuild()) {
  console.log('[focus-companion] sources changed — rebuilding bundles...');
  const r = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    shell: isWin,
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
