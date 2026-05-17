import { useEffect, useRef, useState } from 'react';

interface Options {
  durationSec: number;
  paused: boolean;
  /** Increment to force a reset back to full durationSec. */
  resetSignal?: number;
  onComplete?: () => void;
}

/**
 * Countdown timer based on an absolute endAt timestamp (not a decrementing
 * counter) so the displayed remaining time always reflects wall-clock truth
 * and recovers correctly from setting changes / hot reloads.
 *
 * Pause works by recording when paused started, then sliding endAt forward
 * by the paused duration on resume.
 */
export function useCountdown({
  durationSec,
  paused,
  resetSignal = 0,
  onComplete,
}: Options) {
  const [remaining, setRemaining] = useState(durationSec);
  const endAtRef = useRef<number>(Date.now() + durationSec * 1000);
  const pausedAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  // Keep latest onComplete in a ref so we don't restart the loop just because
  // the callback identity changed.
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset on duration change or explicit reset signal.
  useEffect(() => {
    endAtRef.current = Date.now() + durationSec * 1000;
    pausedAtRef.current = paused ? Date.now() : null;
    completedRef.current = false;
    setRemaining(durationSec);
    // intentionally not listing `paused` — it's read once at reset time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSec, resetSignal]);

  // Pause / resume: shift endAt forward by the time spent paused.
  useEffect(() => {
    if (paused) {
      pausedAtRef.current = Date.now();
    } else if (pausedAtRef.current != null) {
      const pausedDurationMs = Date.now() - pausedAtRef.current;
      endAtRef.current += pausedDurationMs;
      pausedAtRef.current = null;
    }
  }, [paused]);

  // Tick loop.
  useEffect(() => {
    if (paused || completedRef.current) return;

    const tick = () => {
      // ceil so the user sees the exact starting value (e.g. set 60m → first
      // frame is 60:00, not 59:59 due to the few ms it took to reach this tick).
      // Each displayed integer then lasts a full wall-clock second.
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0 && !completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [paused, durationSec, resetSignal]);

  return remaining;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
