---
name: focus-timer
description: Launches the Focus Companion desktop widget — a transparent floating pixel-art pet (Claw'd, cat, dog, or bunny) that counts down a focus session while turning left and right, with speech bubbles showing the current task. Use whenever the user asks to start a focus session, pomodoro, work timer, deep work block, or "open Claw'd / focus pet / desktop timer". Also use if the user wants to set up a recurring focus routine and explicitly mentions wanting the on-screen pet visible.
---

# Focus Companion — Launch Skill

This skill **launches a real desktop application** (Electron). It is NOT a chat-based timer.
When invoked, follow the steps below to start the app. The user will then interact with the desktop window directly.

## Behavior

The launched app shows a small transparent widget on the desktop containing a pixel-art pet that walks in place (turning left/right) for the duration of a focus session. A speech bubble above the pet displays the current task name and rotates through encouragement messages. The user can drag the pet anywhere, resize with Ctrl+wheel, pause/resume, and the timer triggers an OS notification when the session completes.

## Steps to execute

1. **Find the app directory.** This skill's parent plugin contains the Electron app at the plugin root. The `app_root` is the directory two levels above this SKILL.md file (i.e. `../../` from this file's location). Use Bash `realpath` or compute it from the skill's known path.

2. **Check for installed dependencies.**
   - If `${app_root}/node_modules` does **not** exist: run `npm install` in `${app_root}`. Tell the user this is a one-time setup that takes ~30 seconds, then continue.
   - If `node_modules` exists, skip the install step.

3. **Launch the app in the background.** Run `npm start` in `${app_root}` with `run_in_background: true` on the Bash tool. Do NOT wait for it to finish — the app stays open until the user closes it.

4. **Confirm.** Tell the user "Focus Companion launched — the launcher window should be visible. Pick your pet, set duration and importance, then press Begin Focus." Keep it short (one or two sentences).

5. **Do not check on the running process afterward.** The dev/start script keeps Vite + Electron alive in the background. The user closes the windows when they're done.

## Optional argument parsing

If the user passes arguments along with the invocation (e.g. `/focus 25 high "design review"`), you MAY pre-write the chosen values into the settings store BEFORE launching, so the Launcher opens with them pre-filled. The settings file location is OS-dependent — only do this if you can reliably locate `electron-store`'s data file (`focus-companion-settings.json` inside the user's app config dir). If unsure, just launch — the Launcher UI lets the user enter everything.

Accepted arg shapes (all optional, in any order):
- A number followed by `m` or just a number → minutes (1–480)
- `low` / `light` / `normal` / `focused` / `intense` → importance 1–5
- `cat` / `dog` / `bunny` / `claw'd` / `clawd` → character
- Any remaining quoted string → task name

If parsing is ambiguous, do not pre-fill — launch with the previous session's settings (the app already remembers them).

## Common pitfalls — do not do these

- **Don't** run `npm run dev` instead of `npm start`. `dev` is the development server with hot reload; `start` runs the production build optimized for end-user launches.
- **Don't** run the launch in the foreground — it'll block your turn until the user closes the windows. Always use `run_in_background: true`.
- **Don't** kill the process after launching. The user controls when it closes (via the X button in the Launcher or the Cancel control in the Widget).
- **Don't** describe what the app looks like in detail unless the user asks. Just confirm it's launching.

## Troubleshooting

If `npm install` fails, check that Node.js (v18+) is installed: `node --version`. If Electron download is blocked, the user may need to set `ELECTRON_MIRROR` or have proxy access. Surface the actual error from npm — don't paraphrase.

If the Electron window doesn't appear, list the running processes with `Get-Process electron` (Windows) or `pgrep -fl electron` (macOS/Linux). If processes exist but no window, the renderer may have crashed — check the build output for errors.
