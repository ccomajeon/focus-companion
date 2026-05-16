# CLAUDE.md

이 저장소에서 Claude(또는 다른 AI 코딩 에이전트)가 작업할 때 따라야 하는 지침.

---

## 1. 작업 내역 기록 (필수)

**의미 있는 작업 — 기능 추가, 버그 수정, 리팩토링, 디자인 변경 — 을 마칠 때마다 반드시 `docs/task/`에 로그 파일을 남긴다.**

### 형식

- **파일명:** `YYYY-MM-DD-short-slug.md` (예: `2026-05-17-priority-label.md`)
- **언어:** 한국어 (영어가 자연스러운 부분은 영어 그대로)
- **분량:** 10~40줄. 짧고 명확하게.
- **append, never overwrite:** 같은 작업을 다시 건드릴 일이 생기면 새 파일을 만들고 이전 파일을 references에서 가리킨다.

### 템플릿

```markdown
# {제목 한 줄}

> 날짜: YYYY-MM-DD · 커밋: {hash 또는 PR 링크}

## Context
왜 이 작업을 했나. 어떤 사용자 요청 / 문제 / 결정이 트리거였나.

## What changed
- 변경 1
- 변경 2

## Files touched
- `path/to/file.ts` — 한 줄 설명
- `path/to/other.css` — 한 줄 설명

## How to verify
- 실행 방법, 확인 포인트

## References
- 관련 커밋 / PR / 이슈
- 관련 이전 task 로그
```

### 생략해도 되는 경우

오타 수정, 한 줄 변경, 주석만 변경 같은 trivial한 작업.

---

## 2. 코딩 원칙

Andrej Karpathy의 [CLAUDE.md 가이드라인](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)에서 가져온 4가지 원칙. **속도보다 신중함**에 무게를 둔다. 사소한 작업에서는 판단껏.

### 2.1 Think Before Coding — 먼저 생각하라

**가정하지 마라. 혼란을 숨기지 마라. 트레이드오프를 드러내라.**

구현 전에:
- 가정이 있다면 명시적으로 말한다. 불확실하면 묻는다.
- 해석이 여러 개라면 다 제시한다 — 혼자 정하지 않는다.
- 더 간단한 방법이 있으면 말한다. 필요하면 사용자 요청에도 push back 한다.
- 헷갈리는 게 있으면 멈춘다. 헷갈리는 부분을 짚어서 묻는다.

### 2.2 Simplicity First — 단순함이 먼저다

**문제를 푸는 최소한의 코드만 쓴다. 추측성 코드 금지.**

- 요청되지 않은 기능 추가 금지.
- 한 번만 쓰일 코드에 추상화 금지.
- 요청 안 한 "유연성"이나 "설정성" 추가 금지.
- 일어날 수 없는 시나리오에 대한 에러 처리 금지.
- 200줄을 썼는데 50줄로 가능하다면 다시 쓴다.

**자문:** "시니어 엔지니어가 보면 이거 과하다고 할까?" → 그렇다면 단순화.

### 2.3 Surgical Changes — 외과적 변경

**필요한 것만 건드린다. 본인이 만든 흔적만 치운다.**

기존 코드 수정 시:
- 인접한 코드 / 주석 / 포맷을 "개선" 금지.
- 망가지지 않은 걸 리팩토링 금지.
- 본인 스타일과 달라도 기존 스타일에 맞춘다.
- 관련 없는 dead code를 발견하면 — **언급은 하되 삭제는 하지 않는다.**

변경이 orphan을 만들 때:
- **본인의 변경 때문에** 안 쓰이게 된 import/변수/함수만 제거한다.
- 기존부터 있던 dead code는 요청받기 전까지 제거 금지.

**테스트:** 변경된 모든 줄이 사용자의 요청에서 직접 유래해야 한다.

### 2.4 Goal-Driven Execution — 목표 기반 실행

**성공 기준을 먼저 정의한다. 검증될 때까지 반복한다.**

작업을 검증 가능한 목표로 바꾼다:
- "validation 추가" → "잘못된 입력에 대한 테스트를 쓰고 통과시킨다"
- "버그 수정" → "버그를 재현하는 테스트를 쓰고 통과시킨다"
- "X 리팩토링" → "전후로 테스트가 통과하는지 확인한다"

여러 단계 작업이라면 간단한 계획을 먼저 제시:

```
1. [단계] → verify: [확인 방법]
2. [단계] → verify: [확인 방법]
3. [단계] → verify: [확인 방법]
```

**강한 성공 기준은 독립적으로 루프하게 해준다.** 약한 기준("그냥 동작하게")은 매번 사용자 확인이 필요하다.

---

## 3. 이 저장소 고유 컨텍스트

### 프로젝트 개요
Focus Companion — Electron + React + TypeScript 기반의 데스크탑 포커스 타이머 위젯. Claude Code 플러그인으로도, 독립 실행 .exe로도 배포.

### 핵심 디렉터리
- `electron/` — main process, preload, electron-store
- `src/views/` — Launcher / Widget / Done 세 화면
- `src/components/` — PixelPet, SpeechBubble, IntensitySlider 등
- `src/data/characters.ts` — 4종 픽셀 캐릭터 레지스트리
- `skills/focus-timer/SKILL.md`, `commands/focus.md` — Claude Code 플러그인 진입점
- `docs/task/` — **이 파일에서 요구하는 작업 로그가 누적되는 곳**

### 두 가지 테마 스코프 분리
- 위젯 / Done — 코랄·크림 색상의 따뜻한 톤 (`theme.css`의 root 변수)
- Launcher — Linear/Geist 스타일 다크·라이트 (`theme.css`의 `.launcher-theme-*` 변수)
- **두 테마는 절대 섞이지 않도록 스코프 분리되어 있다.** 위젯 작업 시 launcher 변수, 반대도 마찬가지로 건드리지 않는다.

### 빌드 산출물
- 소스 변경 후 `npm run typecheck`로 타입 체크.
- 사용자가 직접 실행 확인을 원하면 `npm run dev` (개발 모드, 핫리로드) 또는 `npm start` (프로덕션 빌드 후 실행).
- 릴리즈는 `npm run pack`으로 portable `.exe` 빌드 후 GitHub Releases에 첨부.

---

## 4. 이 지침이 효과를 보이는 신호

- diff에 불필요한 변경이 줄어든다
- 과한 구현으로 인한 재작성이 줄어든다
- 명확한 질문이 실수 **후**가 아니라 구현 **전**에 나온다
- `docs/task/`를 보면 이 프로젝트의 의사결정 히스토리가 한눈에 들어온다
