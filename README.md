# Focus Companion 🐾

> 데스크탑 위에 떠 있는 픽셀 아트 친구가 집중 세션을 카운트다운해주는 위젯.
> **독립 실행형 Electron 앱**으로도, **Claude Code 플러그인**으로도 사용 가능합니다.

작은 투명 위젯이 바탕화면 위에 자리잡고, 픽셀 아트 친구(Claw'd, 고양이 Catto, 강아지 Pup, 토끼 Bunny)가 제자리에서 좌우로 몸을 돌리며 걸어 다닙니다. 말풍선에는 지금 하고 있는 작업이 적혀 있고, 가끔 응원 메시지가 떠올라요. 시간이 다 되면 OS 알림과 부드러운 챔, 그리고 친구가 살짝 미소짓습니다.

![preview placeholder](preview.png)

## 주요 기능

- **4종 픽셀 아트 캐릭터** — 눈 깜빡임, 걷는 다리 애니메이션, 완료 시 색 변화
- **상시 말풍선** — 현재 작업명이 기본으로 보이고, 25초마다 응원 메시지로 잠깐 전환
- **포모도로 친화적** — 15 / 25 / 45 / 60분 프리셋 + 1분 ~ 8시간 자유 입력
- **중요도 1~5단계** — 캐릭터 걷는 속도가 시각적으로 달라짐
- **항상 위 + 투명 위젯** — 마우스로 어디든 드래그
- **크기 조절** — `Ctrl` + 마우스 휠로 확대/축소 (다음 실행 시에도 유지)
- **설정 자동 저장** — 마지막 작업명·시간·중요도·캐릭터·위젯 위치 모두 기억

---

## 설치 방법 1 — Claude Code 플러그인 (추천)

설치 후 Claude Code에서 `/focus`만 치면 앱이 뜨는 가장 간편한 방식입니다.

### 최초 1회 설정

1. **이 repo를 Claude Code 플러그인 폴더에 clone합니다:**
   ```bash
   git clone https://github.com/ccomajeon/focus-companion.git ~/.claude/plugins/focus-companion
   ```

2. **Claude Code를 재시작**합니다 (또는 가능하다면 `/plugins reload`).

3. **첫 실행 시 자동으로 의존성 설치**가 진행됩니다. "[focus-companion] first launch — building bundles..." 메시지가 약 30초간 보인 후 앱이 뜹니다.

### 사용법

| 명령 | 동작 |
|---|---|
| `/focus` | 직전 설정 그대로 바로 실행 |
| `/focus 25m normal cat "디자인 리뷰"` | 25분 / 보통 중요도 / 고양이 / 작업명 "디자인 리뷰"로 미리 채워서 실행 |
| `/focus 45 intense` | 45분 + 최대 강도(중요도 5), 나머지는 직전 설정 |
| "포커스 타이머 시작해줘" / "start a focus session" | 자연어 — Claude가 의도를 감지해서 스킬 자동 호출 |

인자는 어떤 조합이든 가능합니다: `/focus 25m`, `/focus bunny`, `/focus "deep work"` 등. 순서는 자유.

**인자 형식:**
- `<숫자>` 또는 `<숫자>m` → 시간(분) (1 ~ 480)
- `low` / `light` / `normal` / `focused` / `intense` → 중요도 (1 ~ 5)
- `cat` / `catto` / `dog` / `pup` / `bunny` / `clawd` / `claw'd` → 캐릭터
- 따옴표 문자열 또는 나머지 텍스트 → 작업명

---

## 설치 방법 2 — 독립 실행형 앱

Claude Code를 쓰지 않더라도 그냥 실행할 수 있습니다:

```bash
git clone https://github.com/ccomajeon/focus-companion.git
cd focus-companion
npm install
npm start
```

Windows용 `.exe` 인스톨러 빌드:
```bash
npm run pack
# 결과물: release/0.1.0/Focus Companion Setup.exe
```

---

## 위젯 조작법

| 동작 | 방법 |
|---|---|
| 위젯 이동 | 캐릭터를 마우스로 잡고 드래그 |
| 크기 조절 | 위젯 위에서 `Ctrl` + 마우스 휠 |
| 일시정지 / 재개 | 위젯에 호버 → ⏸ / ▶ 버튼 |
| 최소화 / 복원 | 위젯에 호버 → ⊖ 버튼 (작은 원형으로 축소, 더블클릭으로 복원) |
| 세션 종료 | 위젯에 호버 → ✕ 버튼 (Launcher로 복귀) |
| 중요도 변경 | 위젯 하단 점 5개를 직접 클릭 |

---

## 프로젝트 구조

```
focus-companion/
├── .claude-plugin/plugin.json     # 플러그인 메타데이터
├── skills/focus-timer/SKILL.md    # Claude Code 스킬 정의
├── commands/focus.md              # /focus 슬래시 커맨드
├── scripts/start.mjs              # 프로덕션 실행 스크립트 (npm start)
├── electron/                      # Electron 메인 프로세스 + IPC
│   ├── main.ts                    # 2개 윈도우 (Launcher + 투명 Widget) 셋업
│   ├── preload.ts                 # contextBridge — focusApp API 노출
│   └── store.ts                   # electron-store 설정 영구화
├── src/
│   ├── views/                     # Launcher / Widget / Done 화면
│   ├── components/                # PixelPet, SpeechBubble, ControlBar, ...
│   ├── data/characters.ts         # 4종 캐릭터 레지스트리
│   ├── hooks/                     # useCountdown, useTurnInPlace, useChime
│   └── styles/theme.css           # Claude 톤(코랄 + 크림) 컬러 변수
├── package.json
└── vite.config.ts                 # Vite + vite-plugin-electron 설정
```

## 요구 사항

- **Node.js 18 이상** (빌드용)
- **Windows / macOS / Linux** — Electron은 모든 OS에서 실행 가능. 다만 미리 빌드된 인스톨러는 현재 Windows용만 제공. 다른 OS는 직접 `npm run pack`으로 빌드.

## 기술 스택

Electron · React 18 · TypeScript · Vite · electron-store

## 라이선스

MIT
