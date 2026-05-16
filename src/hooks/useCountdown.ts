import { useEffect, useRef, useState } from 'react';

interface Options {
  durationSec: number;
  paused: boolean;
  onComplete?: () => void;
}

export function useCountdown({ durationSec, paused, onComplete }: Options) {
  const [remaining, setRemaining] = useState(durationSec);
  const endAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Reset when duration changes
  useEffect(() => {
    setRemaining(durationSec);
    endAtRef.current = null;
    completedRef.current = false;
  }, [durationSec]);

  useEffect(() => {
    if (paused) {
      // freeze: remember current remaining; clear endAt
      endAtRef.current = null;
      return;
    }
    if (completedRef.current) return;

    endAtRef.current = Date.now() + remaining * 1000;

    const tick = () => {
      if (endAtRef.current == null) return;
      const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0 && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
    // intentionally not depending on remaining to avoid resetting endAt each tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  return remaining;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
