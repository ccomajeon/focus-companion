# "지금" 제거 · 최소화 → 재설정 교체 · 60분 타이머 버그 수정

> 날짜: 2026-05-17 · 커밋: [57b3e51](https://github.com/ccomajeon/focus-companion/commit/57b3e51)

## Context

사용자 피드백 3건:

1. 위젯 말풍선의 "지금" 접두어가 거슬려서 제거 요청.
2. 위젯의 ○(최소화) 컨트롤은 안 쓰이고, 대신 **재설정**(타이머를 처음으로 되돌리기)이 필요.
3. Launcher에서 60분으로 설정하고 시작했는데 위젯 타이머가 정확히 60:00으로 시작하지 않음.

## What changed

### 1. "지금" 접두어 제거
- `SpeechBubble.tsx`에서 `taskMode` 일 때 렌더되던 `<span class="bubble-prefix">지금</span>` 제거.
- `SpeechBubble.css`의 `.bubble-prefix` 룰 삭제 (dead code 청소 — CLAUDE.md §2.3에 따라 "본인이 만든 흔적" 청소만 허용. 이 prefix는 이번 세션에서 추가된 것이므로 같은 작업의 일환).

### 2. 최소화 컨트롤 → 재설정 컨트롤
- `ControlBar` props: `onMinimize` → `onReset`. 아이콘은 원형 → ↻(원형 화살표).
- `Widget.tsx`: minimized 분기 제거(전체 `if (minimized)` 블록 + `restore-chip` 버튼 + 관련 state).
- `Widget.css`: `.widget-stage.minimized`, `.restore-chip` 관련 룰 전체 삭제.
- `electron/main.ts`: `widget:setMinimized` IPC 핸들러 + `MINIMIZED_SIZE` 상수 삭제.
- `electron/preload.ts`, `src/types.ts`: `setMinimized` API 제거.
- `Widget.tsx`에 `resetSignal` state + `reset()` 핸들러 추가 — 클릭 시 `setPaused(false)` + `setResetSignal(s => s + 1)`.

### 3. 60분 타이머 버그 수정 (root cause)
**버그:** `useCountdown`이 `useEffect([paused])`에서 `remaining`을 closure로 읽고 `endAt = Date.now() + remaining * 1000`을 계산했음.

타임라인:
1. Mount 시 `durationSec = 1500` (25분 기본값), `remaining = 1500`, `paused = true` (settings 로드 전이라 `!loaded`).
2. Settings 로드 → `setDurationSec(3600)` (60분), `setLoaded(true)` → `paused` false로 전환.
3. Re-render: closure에 `remaining = 1500`이 그대로 캡처됨.
4. `useEffect([durationSec])`: `setRemaining(3600)` 호출 — 하지만 이번 render의 closure는 아직 1500.
5. `useEffect([paused])`: `endAt = now + 1500 * 1000` → 25분 짜리 타이머로 시작. ❌

**수정:** `useCountdown`을 endAt 단일 source-of-truth 구조로 다시 작성:
- duration 변경 또는 resetSignal 변경 시: `endAt = Date.now() + durationSec * 1000`, `pausedAt = paused ? Date.now() : null`, `setRemaining(durationSec)`.
- pause 시: `pausedAt = Date.now()`. resume 시: `endAt += (Date.now() - pausedAt)`로 그동안 흐른 시간만큼 endAt 뒤로 미룸 → 멈춘 만큼 되살아남.
- tick effect dep을 `[paused, durationSec, resetSignal]`로 — duration이나 reset이 발동될 때마다 tick loop도 새로 시작.
- `onComplete`는 ref에 저장해서 callback 정체성 변경으로 loop가 재시작 안 되게 분리.

## Files touched

- `src/components/SpeechBubble.tsx` — `bubble-prefix` 렌더 제거
- `src/components/SpeechBubble.css` — `.bubble-prefix` 룰 삭제
- `src/hooks/useCountdown.ts` — endAt 기반으로 전면 재작성, `resetSignal` 옵션 추가
- `src/components/ControlBar.tsx` — minimize 버튼 → reset 버튼 (아이콘/라벨/tip)
- `src/views/Widget.tsx` — minimized state/branch 제거, `resetSignal` + `reset()` 핸들러 연결
- `src/views/Widget.css` — `.widget-stage.minimized`, `.restore-chip` 관련 룰 제거
- `electron/main.ts` — `widget:setMinimized` IPC, `MINIMIZED_SIZE` 상수 제거
- `electron/preload.ts` — `setMinimized` API 제거
- `src/types.ts` — `setMinimized` 타입 제거

## How to verify

1. `npm run dev`로 앱 실행.
2. **60분 버그 확인:** Launcher에서 60m 선택 → Begin Focus → 위젯에서 첫 표시가 **정확히 60:00**으로 시작하는지 확인. 1초 내에 59:59로 떨어져야 정상.
3. **"지금" 제거 확인:** 위젯 말풍선에 작업명만 보이고 "지금" 글자가 안 보이는지 확인.
4. **재설정 확인:** 위젯 호버 → 가운데 ↻ 버튼 보이는지, 호버 시 "재설정" 툴팁 표시. 클릭하면 타이머가 60:00으로 다시 시작 + 일시정지 중이었다면 자동 재개되는지 확인.
5. **일시정지 + 재설정 조합:** 일시정지 후 ↻ 클릭 → 타이머가 60:00이 되고 자동으로 다시 흐르는지 확인.
6. **취소 동작 보존:** ✕ 클릭하면 Launcher로 돌아가는지 확인.

## References

- CLAUDE.md §2.4 Goal-Driven Execution — 버그 재현 조건(60분 설정 → 25분 표시)을 명시하고 수정 후 동일 시나리오로 검증.
- CLAUDE.md §2.3 외과적 변경 — 최소화 기능 완전 제거가 사용자의 명시적 요청이라 dead code 청소 범위에 포함.
- 이전 로그: `2026-05-17-control-tooltips-and-restore.md`에서 추가했던 `restore-chip`은 최소화 기능 자체가 사라지므로 함께 제거됨.
