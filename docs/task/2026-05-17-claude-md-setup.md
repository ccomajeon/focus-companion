# CLAUDE.md 지침 및 task 로그 시스템 도입

> 날짜: 2026-05-17 · 커밋: TBD (이 작업 자체의 커밋 해시)

## Context

앞으로 이 저장소에서 작업하는 모든 의미 있는 변경을 한곳에 누적 기록하기 위한 시스템이 필요했다. 사용자는:

1. `docs/task/`에 작업 로그를 남기는 규칙을 만들고
2. Andrej Karpathy의 [CLAUDE.md 가이드라인](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)을 코딩 원칙으로 채택

해줄 것을 요청했다.

## What changed

- **`CLAUDE.md` 신규 작성** — 4개 섹션 구조:
  - §1 작업 내역 기록 — 파일명 규칙, 템플릿, 생략 조건
  - §2 코딩 원칙 — Karpathy의 4가지 원칙 (Think Before Coding · Simplicity First · Surgical Changes · Goal-Driven Execution)을 한국어로 번역해 적용
  - §3 이 저장소 고유 컨텍스트 — 프로젝트 개요, 핵심 디렉터리, 두 가지 테마 스코프 분리 규칙, 빌드 명령
  - §4 이 지침이 효과를 보이는 신호 — 효과 측정 기준
- **`docs/task/` 디렉터리 신설** — 첫 로그(이 파일)와 인덱스 README 포함
- **`docs/task/README.md`** — 작업 로그 인덱스 (날짜 역순으로 항목 추가)

## Files touched

- `CLAUDE.md` — 신규. 저장소 루트의 작업 지침 문서.
- `docs/task/README.md` — 신규. 로그 인덱스.
- `docs/task/2026-05-17-claude-md-setup.md` — 신규. 이 파일 자체.

## How to verify

- 저장소 루트에서 `CLAUDE.md` 존재 확인
- `docs/task/` 폴더와 README.md가 인덱스로 동작하는지 확인
- 다음 의미 있는 작업 때 이 규칙을 따라 새 로그가 추가되는지 관찰

## References

- 원본 가이드라인: https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md
- 적용된 원칙 4가지는 §2.1~§2.4에 매핑되어 있다.
