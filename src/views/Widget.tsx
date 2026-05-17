import { useEffect, useRef, useState } from 'react';
import type { Importance } from '../types';
import PixelPet from '../components/PixelPet';
import ImportanceDots from '../components/ImportanceDots';
import ControlBar from '../components/ControlBar';
import SpeechBubble from '../components/SpeechBubble';
import { useCountdown, formatTime } from '../hooks/useCountdown';
import { useTurnInPlace } from '../hooks/useTurnInPlace';
import { getCharacter } from '../data/characters';
import './Widget.css';

interface Props {
  onComplete: () => void;
}

export default function Widget({ onComplete }: Props) {
  const [importance, setImportance] = useState<Importance>(3);
  const [durationSec, setDurationSec] = useState(25 * 60);
  const [taskName, setTaskName] = useState('');
  const [characterId, setCharacterId] = useState<string>('clawd');
  const [paused, setPaused] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [winWidth, setWinWidth] = useState<number>(() => window.innerWidth);
  const [showSizeHint, setShowSizeHint] = useState(false);
  const sizeHintTimer = useRef<number | null>(null);

  useEffect(() => {
    window.focusApp.getSettings().then((s) => {
      setImportance((s.lastImportance ?? 3) as Importance);
      setDurationSec(Math.max(60, (s.lastDurationMin ?? 25) * 60));
      setTaskName(s.lastTaskName ?? '');
      setCharacterId(s.lastCharacter ?? 'clawd');
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const remaining = useCountdown({
    durationSec,
    paused: paused || !loaded,
    onComplete: () => {
      window.focusApp.notifyDone({ taskName }).catch(() => undefined);
      onComplete();
      window.location.hash = '#/done';
    },
  });

  const phase = paused ? 'paused' : 'running';

  const { facing, walking } = useTurnInPlace({
    enabled: !paused && !minimized && loaded,
  });

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const step = e.deltaY < 0 ? 20 : -20;
      window.focusApp.resizeBy(step).catch(() => undefined);
      setShowSizeHint(true);
      if (sizeHintTimer.current !== null) window.clearTimeout(sizeHintTimer.current);
      sizeHintTimer.current = window.setTimeout(() => setShowSizeHint(false), 900);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (sizeHintTimer.current !== null) window.clearTimeout(sizeHintTimer.current);
    };
  }, []);

  const togglePause = () => setPaused((p) => !p);
  const cancel = () => window.focusApp.cancelSession();
  const toggleMinimize = () => {
    const next = !minimized;
    setMinimized(next);
    window.focusApp.setMinimized(next);
  };

  const characterSize = Math.round(winWidth * 0.55);
  const timerFontPx = Math.round(winWidth * 0.16);
  const labelFontPx = Math.max(7, Math.round(winWidth * 0.055));
  const character = getCharacter(characterId);

  if (minimized) {
    return (
      <div className="widget-stage minimized" onDoubleClick={toggleMinimize}>
        <PixelPet
          character={character}
          importance={importance}
          phase={phase}
          size={Math.min(72, winWidth - 8)}
          draggable
          facing={facing}
          walking={walking}
        />
        <button
          type="button"
          className="restore-chip"
          onClick={toggleMinimize}
          aria-label="펼치기"
          data-tip="펼치기"
        >
          ↗
        </button>
      </div>
    );
  }

  return (
    <div className="widget-stage">
      <div className="bubble-slot" style={{ minHeight: Math.round(winWidth * 0.22) }}>
        <SpeechBubble
          remainingSec={remaining}
          totalSec={durationSec}
          paused={paused}
          taskName={taskName}
        />
      </div>
      <div className="character-area">
        <PixelPet
          character={character}
          importance={importance}
          phase={phase}
          size={characterSize}
          draggable
          facing={facing}
          walking={walking}
        />
      </div>

      <div className="meta">
        <div className="focus-label" style={{ fontSize: labelFontPx }}>
          {paused ? 'PAUSED' : 'FOCUS'}
        </div>
        <div className="timer-text" style={{ fontSize: timerFontPx }}>
          {formatTime(remaining)}
        </div>
        <div className="dot-row">
          <ImportanceDots value={importance} onChange={setImportance} size="sm" />
        </div>
      </div>

      <div className="control-slot">
        <ControlBar
          paused={paused}
          onPauseToggle={togglePause}
          onCancel={cancel}
          onMinimize={toggleMinimize}
        />
      </div>

      {showSizeHint && (
        <div className="size-hint">{Math.round(winWidth)} px</div>
      )}
    </div>
  );
}
