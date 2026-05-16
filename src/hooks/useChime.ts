// Soft 2-note chime using Web Audio API — no external sound file needed.
export function playCompletionChime() {
  try {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playTone = (freq: number, startAt: number, durationSec: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + startAt);
      gain.gain.setValueAtTime(0, now + startAt);
      gain.gain.linearRampToValueAtTime(0.18, now + startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startAt + durationSec);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + startAt);
      osc.stop(now + startAt + durationSec + 0.05);
    };

    playTone(880, 0, 0.5);   // A5
    playTone(1318.5, 0.18, 0.6); // E6
    setTimeout(() => ctx.close().catch(() => undefined), 1200);
  } catch {
    // ignore — sound is non-critical
  }
}
