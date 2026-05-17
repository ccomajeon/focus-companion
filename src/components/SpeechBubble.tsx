import { useEffect, useState } from 'react';
import './SpeechBubble.css';

interface Props {
  remainingSec: number;
  totalSec: number;
  paused: boolean;
  taskName: string;
}

type Mode = 'task' | 'encourage';

function pickEncouragement(
  remainingSec: number,
  totalSec: number,
  paused: boolean,
): string {
  if (paused) {
    return pickRandom(['잠깐 쉬어요...', '준비 됐어요?', '다시 시작!']);
  }
  const ratio = totalSec > 0 ? remainingSec / totalSec : 0;
  const minLeft = remainingSec / 60;

  if (minLeft <= 1) return pickRandom(['마지막 스퍼트!', '곧 끝나요!', '거의 다 왔어요!!']);
  if (ratio <= 0.1) return pickRandom(['얼마 안 남았어요!', '조금만 더!', '거의 다 왔어요!']);
  if (ratio <= 0.3) return pickRandom(['잘 하고 있어요', '집중 모드 유지!', '조금만 더!']);
  if (ratio <= 0.55) return pickRandom(['절반 왔어요!', '꾸준히 가요', '리듬 좋아요']);
  if (ratio <= 0.8) return pickRandom(['잘 하고 있어요!', '집중력 좋네요', '계속 가요']);
  return pickRandom(['오늘도 화이팅!', '같이 해봐요', '집중 시작!']);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const TASK_DISPLAY_MS = 25_000;
const ENCOURAGE_DISPLAY_MS = 5_000;

export default function SpeechBubble({
  remainingSec,
  totalSec,
  paused,
  taskName,
}: Props) {
  const [mode, setMode] = useState<Mode>('task');
  const [encourageText, setEncourageText] = useState('');

  useEffect(() => {
    let timer: number;
    const cycle = (next: Mode) => {
      if (next === 'encourage') {
        setEncourageText(pickEncouragement(remainingSec, totalSec, paused));
        setMode('encourage');
        timer = window.setTimeout(() => cycle('task'), ENCOURAGE_DISPLAY_MS);
      } else {
        setMode('task');
        timer = window.setTimeout(() => cycle('encourage'), TASK_DISPLAY_MS);
      }
    };
    timer = window.setTimeout(() => cycle('encourage'), TASK_DISPLAY_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  const displayText =
    mode === 'encourage'
      ? encourageText
      : (taskName?.trim() ? taskName : '집중 세션 진행 중');

  const taskMode = mode === 'task';

  return (
    <div className={`speech-bubble show ${taskMode ? 'task-mode' : 'encourage-mode'}`} aria-live="polite">
      <span className="bubble-text">{displayText}</span>
    </div>
  );
}
