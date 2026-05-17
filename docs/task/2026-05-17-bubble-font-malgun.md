# 말풍선 글꼴을 맑은 고딕으로 통일

> 날짜: 2026-05-17 · 커밋: [28ae6d2](https://github.com/ccomajeon/focus-companion/commit/28ae6d2)

## Context

캐릭터 말풍선에서 글꼴이 섞여 있었다:
- `.bubble-prefix` ("지금" 라벨) → `var(--font-serif)` (Source Serif 4)
- `.bubble-text` (작업명 / 응원 메시지) → `var(--font-sans)` (Inter)
- `.done-bubble` ("완료! 🎉") → `var(--font-sans)` (Inter)

사용자가 "전부 동일한 글꼴 맑은 고딕"으로 통일해 달라고 요청.

## What changed

- `theme.css`에 `--font-bubble: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif;` 변수 신설. 위젯·Launcher 양쪽 모두 접근 가능한 `:root` 스코프에 둠.
- `SpeechBubble.css`의 `.speech-bubble`과 `.bubble-prefix` 모두 `var(--font-bubble)` 사용. prefix의 `font-style: italic`은 사용자가 명시적으로 변경 요청 안 했으므로 그대로 유지 (CLAUDE.md §2.3 외과적 변경 원칙).
- `Done.css`의 `.done-bubble`도 `var(--font-bubble)` 사용.

## Files touched

- `src/styles/theme.css` — `--font-bubble` 변수 추가
- `src/components/SpeechBubble.css` — `.speech-bubble`, `.bubble-prefix` 글꼴 교체
- `src/views/Done.css` — `.done-bubble` 글꼴 교체

## How to verify

- `npm run dev`로 앱 실행 → Launcher에서 25분 / 임의 작업명으로 시작
- 위젯 말풍선의 "지금" 접두어 + 작업명 텍스트가 같은 맑은 고딕으로 보이는지 확인
- 25초 후 응원 메시지로 전환될 때도 같은 글꼴인지 확인
- 1분 짜리 세션 끝까지 가서 Done 화면의 "완료! 🎉" 풍선도 같은 글꼴인지 확인

## References

- CLAUDE.md §2.3 외과적 변경 — italic 속성은 그대로 둠
- 영향 받지 않는 곳: 타이머 숫자(Geist Mono), 본문 UI(Inter), launcher 제목/라벨 — 말풍선만 격리

## Notes

Malgun Gothic은 Windows 기본 한국어 글꼴이라 별도 웹폰트 로드 없이 즉시 적용된다. macOS/Linux에서는 `Apple SD Gothic Neo` → 시스템 sans-serif로 폴백.
