# 시작 시각을 설정값과 정확히 일치시키기 (Math.ceil) + npm start 자동 재빌드

> 날짜: 2026-05-17 · 커밋: [9172022](https://github.com/ccomajeon/focus-companion/commit/9172022)

## Context

이전 커밋([57b3e51](https://github.com/ccomajeon/focus-companion/commit/57b3e51))에서 useCountdown의 closure 버그를 잡았는데, 사용자 후속 보고: "내가 설정한 시간과 정확하게 맞아야 해". 60분으로 설정했는데 60:00이 아니라 59:59부터 시작될 수 있다는 의미로 해석.

원인은 두 가지가 가능했다:
1. **반올림 방향:** tick 함수가 `Math.round((endAt - now) / 1000)`로 계산해서, endAt 설정과 첫 tick 호출 사이에 500ms 이상 흐르면 3599로 떨어짐. 시스템 부하나 백그라운드 작업 영향을 받음.
2. **이전 수정이 반영 안 됨:** 사용자가 `npm start`로 실행 중이었다면 `scripts/start.mjs`가 번들 **존재** 여부만 보고 staleness는 확인 안 해서, 이전 빌드 산출물(버그 있던 코드)이 그대로 떠있었을 가능성.

## What changed

### 1. `Math.round` → `Math.ceil`

`useCountdown`의 tick 계산:

```ts
const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
```

- 60분(3600초) 설정 시: endAt 설정 직후 (3600000ms − Δ)/1000 = 3600 − Δ/1000 ≈ 3599.99x → ceil = 3600. 첫 frame부터 정확히 60:00.
- 이후 각 표시값이 정확히 1초간 유지됨 (T+999ms까지 60:00, T+1000ms부터 59:59).
- round/floor는 첫 표시가 0~500ms만 유지되거나 아예 안 보이는 문제가 있음.

### 2. `npm start`가 소스 변경 시 자동 재빌드

`scripts/start.mjs`에 staleness 검사 추가:

- `src/`, `electron/` 디렉토리를 재귀적으로 walk해서 가장 최신 mtime을 구함
- `index.html`, `vite.config.ts`, `package.json`도 포함
- 번들의 mtime 중 가장 오래된 것과 비교
- 소스가 더 신선하면 `npm run build` 실행 후 Electron 기동

이제 사용자가 소스를 수정하고 `npm start`만 다시 실행해도 항상 최신 코드가 도는 것이 보장됨.

## Files touched

- `src/hooks/useCountdown.ts` — `Math.round` → `Math.ceil` (한 줄 변경 + 주석)
- `scripts/start.mjs` — `needsBuild()` 함수로 mtime 비교 로직 추가

## How to verify

1. `npm start`로 실행 → 로그에 `sources changed — rebuilding bundles...` 보이는지 (이전 빌드 후 소스 변경이 있으므로 첫 실행 시 재빌드돼야 함).
2. Launcher에서 **60m** 선택 → Begin Focus.
3. 위젯 첫 frame에 **정확히 `60:00`**으로 표시되는지 확인.
4. 약 1초 후 `59:59`로 떨어지는지 확인 (각 숫자가 풀 1초간 유지).
5. 15m, 25m, 45m도 마찬가지로 시작 값이 정확한지 확인.
6. 일시정지 → 재개 → 시간이 매끄럽게 이어지는지 확인.
7. ↻ 재설정 → 다시 정확한 시작 값으로 돌아가는지 확인.

## Edge case

타이머가 0:00에 도달할 때:
- `Math.ceil((endAt - now)/1000)`이 0보다 작아질 수 있음 (`endAt - now < 0`).
- `Math.max(0, ...)`로 가드되어 있어서 음수는 안 나옴.
- `left <= 0` 조건은 한 번만 `onComplete` 호출하도록 `completedRef`로 락 걸려 있음.

## References

- 이전 로그: `2026-05-17-reset-and-timer-fix.md` — closure 캡처 버그 수정(첫 단추).
- CLAUDE.md §2.4 Goal-Driven Execution — "60:00 정확히 표시" 라는 검증 가능한 목표를 세우고 그것만 충족시키는 수정.
- CLAUDE.md §2.3 외과적 변경 — tick 함수 한 줄 + start.mjs의 staleness 검사 추가만, 그 외 변경 없음.
