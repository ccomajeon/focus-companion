import { useEffect, useState } from 'react';
import type { Facing } from '../types';

interface Options {
  enabled: boolean;
  /** Average seconds between direction flips */
  averageGapSec?: number;
  /** ms the walking pose stays after a turn */
  walkDurationMs?: number;
}

/**
 * Periodically flips the character's facing direction in place.
 * Returns `walking=true` for a short period after each turn,
 * which the character renderer uses to speed up legs and lean the body.
 */
export function useTurnInPlace({
  enabled,
  averageGapSec = 12,
  walkDurationMs = 2400,
}: Options) {
  const [facing, setFacing] = useState<Facing>('right');
  const [walking, setWalking] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setWalking(false);
      return;
    }

    let waitTimer: number | undefined;
    let stopWalkTimer: number | undefined;
    let cancelled = false;

    const scheduleNext = () => {
      const jitter = averageGapSec * 0.45;
      const gap = (averageGapSec - jitter + Math.random() * jitter * 2) * 1000;
      waitTimer = window.setTimeout(() => {
        if (cancelled) return;
        setFacing((prev) => (prev === 'right' ? 'left' : 'right'));
        setWalking(true);
        stopWalkTimer = window.setTimeout(() => {
          if (cancelled) return;
          setWalking(false);
          scheduleNext();
        }, walkDurationMs);
      }, gap);
    };

    // First flip after an initial delay so launch feels calm
    waitTimer = window.setTimeout(() => {
      if (cancelled) return;
      setWalking(true);
      stopWalkTimer = window.setTimeout(() => {
        if (cancelled) return;
        setWalking(false);
        scheduleNext();
      }, walkDurationMs);
    }, 6000 + Math.random() * 4000);

    return () => {
      cancelled = true;
      if (waitTimer !== undefined) window.clearTimeout(waitTimer);
      if (stopWalkTimer !== undefined) window.clearTimeout(stopWalkTimer);
      setWalking(false);
    };
  }, [enabled, averageGapSec, walkDurationMs]);

  return { facing, walking };
}
