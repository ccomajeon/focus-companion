---
description: Launch the Focus Companion desktop pet timer. Optionally pass duration / importance / character / task.
argument-hint: "[25m] [normal] [cat] [\"task name\"]"
---

# /focus — Launch Focus Companion

Launch the Focus Companion desktop widget. If `$ARGUMENTS` is empty, launch with the user's last-used settings. Otherwise, parse the arguments and pre-fill the Launcher.

**Arguments to parse** (any order, any subset, all optional):
- `<number>` or `<number>m` → duration in minutes (clamped to 1–480)
- `low` / `light` / `normal` / `focused` / `intense` → importance level (1, 2, 3, 4, 5)
- `cat` / `catto` / `dog` / `pup` / `bunny` / `clawd` / `claw'd` → character
- A quoted string `"..."` or trailing free text → task name

If `$ARGUMENTS` is provided:

```
$ARGUMENTS
```

**Then invoke the `focus-timer` skill** which handles the actual launch. The skill is in this plugin under `skills/focus-timer/SKILL.md` — invoke it via the Skill tool with the parsed values (or no args if parsing was ambiguous).

After the skill runs and the app launches, reply with a single short line confirming and listing what got pre-filled (if anything). Don't narrate the launch in detail.
