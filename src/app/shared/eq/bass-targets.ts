/**
 * Simulated bass-heavy groove (128 BPM, 4/4) used when the EQ is in
 * user-toggled "playing" mode, or as the drawn pattern for ext / silent live.
 * bassTargets is left-to-right (lows → highs). centeredBassTargets mirrors
 * that so the lowest bands sit in the middle and highs run out to both edges.
 */

const BPM = 128;
const BEAT = 60 / BPM;

/** Stable 0..1 hash so velocities vary per beat without a short loop. */
function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Exponential envelope: attack seconds, then decay with time-constant tau. */
function env(dt: number, attack: number, tau: number): number {
  if (dt < 0) return 0;
  if (dt < attack) return dt / attack;
  return Math.exp(-(dt - attack) / tau);
}

/** Left-to-right spectrum: index 0 is the lowest (kick/sub), n-1 is the top (hats). */
export function bassTargets(t: number, n: number, noise: boolean): Float32Array {
  const out = new Float32Array(n);
  const beat = t / BEAT;
  const beatAbs = Math.max(0, beat);
  const beatInBar = ((beatAbs % 4) + 4) % 4;
  const bar = Math.floor(beatAbs / 4);
  const phraseBar = ((bar % 8) + 8) % 8;
  const phrasePos = phraseBar + beatInBar / 4;
  const beatNum = Math.floor(beatAbs);

  let build = 0;
  if (phrasePos >= 4) build = ((phrasePos - 4) / 4) * 0.35;
  if (phrasePos >= 6) build = Math.max(build, (phrasePos - 6) / 2);

  const onDrop = phraseBar === 0 && beatInBar < 1;

  const kickDt = (beatInBar - Math.floor(beatInBar)) * BEAT;
  const kickTau = 0.15 + 0.1 * hash(beatNum + 4.2);
  let kickVel = 0.78 + 0.2 * hash(beatNum + 17);
  if (onDrop) kickVel = 1;
  const beatI = Math.floor(beatInBar);
  if (beatI === 0) kickVel = Math.min(1, kickVel + 0.08);
  if (beatI === 2) kickVel *= 0.92;
  const kickEnv = env(kickDt, 0.02, kickTau) * kickVel;

  let snareEnv = 0;
  const roll = phraseBar === 7 && beatInBar >= 2;
  if (roll) {
    const sixteenth = beatAbs * 4;
    const sFrac = sixteenth - Math.floor(sixteenth);
    const dt = sFrac * (BEAT / 4);
    const vel = 0.45 + 0.4 * ((Math.floor(sixteenth) % 4) / 3) + 0.15 * hash(Math.floor(sixteenth) + 8);
    snareEnv = env(dt, 0.01, 0.07) * vel;
  } else if (beatI === 1 || beatI === 3) {
    const dt = (beatInBar - beatI) * BEAT;
    snareEnv = env(dt, 0.012, 0.13) * (0.72 + 0.24 * hash(beatNum + 99));
  }

  const eighth = beatAbs * 2;
  const eighthFrac = eighth - Math.floor(eighth);
  const hat8 = env(eighthFrac * (BEAT / 2), 0.008, 0.045) * (0.2 + 0.12 * hash(Math.floor(eighth) + 3));
  const sixteenth = beatAbs * 4;
  const isOffEighth = Math.floor(sixteenth) % 2 === 1;
  const sFrac = sixteenth - Math.floor(sixteenth);
  let hat16 = 0;
  if (isOffEighth) {
    hat16 =
      env(sFrac * (BEAT / 4), 0.006, 0.03) *
      (0.05 + 0.28 * build) *
      (0.65 + 0.35 * hash(Math.floor(sixteenth) + 5));
  }
  let openHat = 0;
  if (beatI === 3 && hash(bar + 0.33) > 0.72) {
    const dt = (beatInBar - 3.5) * BEAT;
    if (dt >= 0) openHat = env(dt, 0.01, 0.11) * 0.28;
  }

  const wobble =
    0.58 +
    0.28 * Math.sin((2 * Math.PI * beatAbs) / 2) +
    0.12 * Math.sin((2 * Math.PI * beatAbs) / 0.67);
  const subLevel = wobble * (1 - 0.7 * kickEnv) * (onDrop ? 1.08 : 0.92 + 0.08 * (1 - build));

  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 0 : i / (n - 1);
    const kick =
      kickEnv * (Math.exp(-((x / 0.07) ** 2)) * 1.05 + Math.exp(-((x / 0.17) ** 2)) * 0.38);
    const sub = subLevel * Math.exp(-((x / 0.05) ** 2));
    const snare =
      snareEnv * (Math.exp(-(((x - 0.4) / 0.13) ** 2)) * 0.88 + Math.exp(-(((x - 0.58) / 0.1) ** 2)) * 0.32);
    const hats = (hat8 + hat16 + openHat) * Math.pow(Math.max(0, (x - 0.62) / 0.38), 1.05);
    const riser = build * build * (0.12 + 0.62 * x) * (0.55 + 0.45 * hash(i + bar * 0.01 + 1.7));
    const pad =
      (0.1 + 0.07 * Math.sin(t * 1.15 + i * 0.37) + 0.04 * Math.sin(t * 0.47 - i * 0.19)) *
      (1 - x * 0.55) *
      (1 - 0.5 * kickEnv) *
      (0.85 - 0.25 * build);

    let v = kick + sub + snare + hats + riser * 0.7 + pad;
    v = v * (1 - 0.28 * x) + hats * 0.15;
    if (noise) v += 0.018 * Math.random() * (0.35 + 0.65 * x);
    v += 0.025 * Math.sin(t * 4.7 + i * 1.61) * x;
    out[i] = clamp01(v);
  }
  return out;
}

/** Mirror a low→high half-spectrum so bass sits in the center, highs at both edges. */
export function centeredBassTargets(t: number, n: number, noise: boolean): Float32Array {
  if (n <= 1) return bassTargets(t, n, noise);
  const half = Math.ceil(n / 2);
  const src = bassTargets(t, half, noise);
  const out = new Float32Array(n);
  const mid = (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const j = Math.min(half - 1, Math.round((Math.abs(i - mid) / mid) * (half - 1)));
    out[i] = src[j];
  }
  return out;
}
