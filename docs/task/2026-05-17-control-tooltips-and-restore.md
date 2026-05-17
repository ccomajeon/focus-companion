# 컨트롤 버튼 툴팁 + 최소화 상태 복원 칩

> 날짜: 2026-05-17 · 커밋: TBD

## Context

사용자 피드백:
- 위젯에서 최소화(○) 버튼을 누르면 위젯이 작은 원으로 줄어드는데, 그 상태에서 마우스를 가져다 대도 3개의 컨트롤 버튼이 다시 안 보여서 펼칠 방법이 없어 보임 (실제로는 더블클릭이 있지만 비공개 동작이라 발견 안 됨)
- 컨트롤 바의 3개 버튼(⏸ / ○ / ✕)이 호버 시 무슨 동작인지 라벨이 안 나옴

## What changed

### 컨트롤 버튼 툴팁
- `ControlBar.tsx` 각 버튼에 `data-tip` 속성 부여 — "일시정지" / "재개" / "최소화" / "세션 취소"
- `ControlBar.css`에 `.ctrl[data-tip]::after`로 호버 시 버튼 위에 작은 검정 툴팁 + 아래로 향하는 삼각형 꼬리(`::before`) 표시
- 툴팁 글꼴은 `--font-bubble` (맑은 고딕)로 통일

### 최소화 상태에서 복원 칩
- `Widget.tsx`의 minimized 분기에 `restore-chip` 버튼 추가 — 작은 원형 ↗ 아이콘
- 평소엔 숨겨져 있다가 `.widget-stage.minimized:hover` 시 페이드인
- 클릭하면 `toggleMinimize()` 호출 → 원래 크기로 복원
- 기존의 더블클릭 복원도 함께 유지 (호환성)
- 칩 자체에도 `data-tip="펼치기"` 툴팁 적용

## Files touched

- `src/components/ControlBar.tsx` — `data-tip` 속성 추가, `title` → `aria-label`/`data-tip`로 일원화
- `src/components/ControlBar.css` — `::before`/`::after`로 툴팁 화살표 + 본문 구현
- `src/views/Widget.tsx` — minimized 분기에 `<button class="restore-chip">` 추가
- `src/views/Widget.css` — `.restore-chip` 위치/스타일/툴팁 + 호버 페이드인

## How to verify

- `npm run dev`로 앱 실행 → 25분 임의 작업으로 Begin Focus
- 위젯에 마우스 호버 → 하단 컨트롤 바 등장, 각 버튼에 마우스 올리면 위쪽에 작은 한글 라벨 등장 확인
- ○(최소화) 버튼 클릭 → 작은 원으로 축소되는지 확인
- 최소화된 캐릭터에 마우스 호버 → 우상단에 ↗ 칩이 나타나는지 확인
- ↗ 칩 클릭 → 원래 크기로 복원되는지 확인
- ↗ 칩에 호버 → "펼치기" 툴팁이 나오는지 확인

## References

- CLAUDE.md §2.3 외과적 변경 — 더블클릭 복원 동작은 유지, 추가만 함
- 툴팁 글꼴 통일은 `2026-05-17-bubble-font-malgun.md`의 `--font-bubble` 변수 재사용
