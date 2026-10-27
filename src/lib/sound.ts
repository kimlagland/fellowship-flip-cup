// Synthesized sound effects via Web Audio — no audio files needed.
const KEY = "baraddur:sound";
let ctx: AudioContext | null = null;

export function isSoundOn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) !== "0";
}
export function setSoundOn(on: boolean) {
  localStorage.setItem(KEY, on ? "1" : "0");
}

function ac(): AudioContext | null {
  if (typeof window === "undefined" || !isSoundOn()) return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, vol: number, endFreq?: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(c.destination);
  o.start(start);
  o.stop(start + dur + 0.05);
}

/** Schedule reel clicks that slow down along an ease-out curve. */
export function playSpinTicks(items: number, duration: number) {
  const c = ac();
  if (!c) return;
  const now = c.currentTime;
  const n = Math.max(1, items);
  for (let k = 1; k <= n; k++) {
    const t = (1 - Math.cbrt(1 - k / n)) * duration;
    tone(c, 1800, now + t, 0.03, "square", 0.05);
  }
}

export function playReveal() {
  const c = ac();
  if (!c) return;
  const now = c.currentTime;
  tone(c, 82, now, 2.2, "sine", 0.4);
  tone(c, 123, now, 1.8, "triangle", 0.15);
  tone(c, 247, now, 1.2, "sine", 0.08);
}

export function playFanfare() {
  const c = ac();
  if (!c) return;
  const now = c.currentTime;
  [392, 523, 659, 784].forEach((f, i) => tone(c, f, now + i * 0.14, i === 3 ? 0.9 : 0.25, "sawtooth", 0.08));
}

export function playRumble() {
  const c = ac();
  if (!c) return;
  const now = c.currentTime;
  tone(c, 55, now, 2.5, "sawtooth", 0.2, 35);
  tone(c, 70, now + 0.2, 2, "square", 0.06, 40);
}

export function playEliminate() {
  const c = ac();
  if (!c) return;
  tone(c, 440, c.currentTime, 0.6, "triangle", 0.15, 110);
}

export function playVictory() {
  const c = ac();
  if (!c) return;
  const now = c.currentTime;
  [523, 659, 784, 1047].forEach((f) => tone(c, f, now, 1.6, "triangle", 0.07));
  [523, 784, 1047].forEach((f, i) => tone(c, f, now + 0.2 + i * 0.12, 0.3, "sawtooth", 0.05));
}
