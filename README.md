# Focus Companion 🐾

> A floating pixel-art desktop pet that counts down your focus sessions.
> Available as both a **standalone Electron app** and a **Claude Code plugin**.

A tiny transparent widget sits on your desktop. A pixel-art pet (Claw'd, Catto the cat, Pup the dog, or Bunny) turns left and right in place while a speech bubble shows what you're working on. When the time runs out, you get an OS notification, a soft chime, and the pet does a little smile.

![preview placeholder](preview.png)

## Features

- **4 pixel-art characters** with eye blinks, walking legs, and color shifts on completion
- **Speech bubbles** that always show the current task name + rotating encouragement
- **Pomodoro-friendly**: 15 / 25 / 45 / 60 minute presets or any custom duration up to 8 hours
- **Importance 1–5** drives the pet's walking-leg speed for visual intensity
- **Always-on-top transparent widget** — drag anywhere with the mouse
- **Resizable** — `Ctrl` + mouse wheel to zoom (saved between sessions)
- **Settings remembered**: last task, duration, importance, character, widget position & size

---

## Install as a Claude Code plugin (recommended)

This is the easiest way for end users — once installed, just type `/focus` in Claude Code and the desktop app launches.

### One-time setup

1. **Clone or download this repo** into your Claude Code plugins folder:
   ```bash
   git clone https://github.com/junyoung/focus-companion.git ~/.claude/plugins/focus-companion
   ```

2. **Restart Claude Code** (or run `/plugins reload` if available) so it picks up the new plugin.

3. **First-time dependency install** happens automatically on first launch. You'll see "[focus-companion] first launch — building bundles..." for ~30 seconds, then the app appears.

### Usage

| Command | What it does |
|---|---|
| `/focus` | Launch with your last-used settings |
| `/focus 25m normal cat "design review"` | Launch with 25 min, normal importance, cat companion, task "design review" |
| `/focus 45 intense` | 45 minutes at maximum intensity (importance 5), other settings as last used |
| "포커스 타이머 시작해줘" / "start a focus session" | Conversational — Claude detects intent and invokes the skill |

You can also pass any subset: `/focus 25m`, `/focus bunny`, `/focus "deep work"`, etc. Arguments are parsed in any order.

---

## Install as a standalone app

If you don't use Claude Code, you can still run it directly:

```bash
git clone https://github.com/junyoung/focus-companion.git
cd focus-companion
npm install
npm start
```

To build a Windows `.exe` installer:
```bash
npm run pack
# Output in release/0.1.0/Focus Companion Setup.exe
```

---

## Project structure

```
focus-companion/
├── .claude-plugin/plugin.json     # Plugin metadata
├── skills/focus-timer/SKILL.md    # Claude Code skill instructions
├── commands/focus.md              # /focus slash command
├── scripts/start.mjs              # Production launch script (npm start)
├── electron/                      # Electron main process + IPC
│   ├── main.ts                    # Two-window setup (Launcher + transparent Widget)
│   ├── preload.ts                 # contextBridge — focusApp API
│   └── store.ts                   # electron-store settings
├── src/
│   ├── views/                     # Launcher / Widget / Done screens
│   ├── components/                # PixelPet, SpeechBubble, ControlBar, ...
│   ├── data/characters.ts         # 4-character registry
│   ├── hooks/                     # useCountdown, useTurnInPlace, useChime
│   └── styles/theme.css           # Claude-inspired coral + cream palette
├── package.json
└── vite.config.ts                 # Vite + vite-plugin-electron
```

## Requirements

- **Node.js 18+** (for the build)
- **Windows / macOS / Linux** — Electron runs on all, but the prebuilt installer is currently Windows-only (`npm run pack` to build for your platform)

## Tech stack

Electron · React 18 · TypeScript · Vite · electron-store

## License

MIT
