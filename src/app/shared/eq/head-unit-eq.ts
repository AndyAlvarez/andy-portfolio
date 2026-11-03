/**
 * HeadUnitEQ: segmented "VFD" spectrum visualizer (canvas), ported from the prototype eq-visualizer.js.
 *
 * Modes
 *  - idle: slow procedural drift (static frame when the visitor prefers reduced motion)
 *  - live: Web Audio AnalyserNode on a same-origin <video> (self-hosted clips)
 *  - ext:  a cross-origin player (YouTube) is playing; its audio can't be read, so a simulated pattern is drawn
 *
 * Bar approach after codepen.io/nfj525/pen/rVBaab (AnalyserNode + getByteFrequencyData), restyled to the site palette.
 */
export type EqMode = 'idle' | 'live' | 'ext';

export interface HeadUnitEqOptions {
  bars?: number;
  segH?: number;
  segGap?: number;
  reflect?: boolean;
  /** Called when live mode has read only silence for ~1.5 s (e.g. a clip with no audio track, or a muted player). */
  onSilence?: () => void;
}

const PAL = { chrome: '#C0C6CF', blue: '#1F51FF', cyan: '#00E5FF', green: '#39FF14', purple: '#7B2CFF' };
/** Segment colour by height (0..1): green floor -> cyan -> blue -> purple top. */
const segColor = (h: number) => (h < 0.34 ? PAL.green : h < 0.62 ? PAL.cyan : h < 0.84 ? PAL.blue : PAL.purple);

interface AudioRig {
  ctx: AudioContext;
  analyser: AnalyserNode;
  data: Uint8Array<ArrayBuffer>;
}

export class HeadUnitEQ {
  private readonly ctx: CanvasRenderingContext2D;
  private bars: number;
  private readonly seg: number;
  private readonly gap: number;
  private readonly reflect: boolean;
  private val: Float32Array;
  private peak: Float32Array;
  private peakT: Float32Array;
  private audio: AudioRig | null = null;
  /** createMediaElementSource is allowed ONCE per element, so keep the node per element. */
  private readonly sources = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();
  private readonly reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  private readonly t0 = performance.now();
  private readonly ro: ResizeObserver;
  private readonly io: IntersectionObserver;
  private raf = 0;
  private visible = true;
  private silentFrames = 0;
  private d = 1;
  private mode: EqMode = 'idle';
  private destroyed = false;

  constructor(
    private readonly c: HTMLCanvasElement,
    private readonly opts: HeadUnitEqOptions = {},
  ) {
    this.ctx = c.getContext('2d')!;
    this.bars = opts.bars ?? 40;
    this.seg = opts.segH ?? 4;
    this.gap = opts.segGap ?? 2;
    this.reflect = opts.reflect !== false;
    this.val = new Float32Array(this.bars);
    this.peak = new Float32Array(this.bars);
    this.peakT = new Float32Array(this.bars);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(c);
    // Pause the loop while the band is off-screen.
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.schedule();
    });
    this.io.observe(c);
    this.reducedQuery.addEventListener('change', this.onReducedChange);
    this.resize();
    this.schedule();
  }

  get reduced() {
    return this.reducedQuery.matches;
  }

  setBars(n: number) {
    if (n === this.bars) return;
    this.bars = n;
    this.val = new Float32Array(n);
    this.peak = new Float32Array(n);
    this.peakT = new Float32Array(n);
    this.drawStatic();
  }

  setMode(m: EqMode) {
    if (this.mode === m) return;
    this.mode = m;
    this.silentFrames = 0;
    this.schedule();
    if (this.reduced) this.drawStatic();
  }

  /**
   * Route a self-hosted <video> through the analyser. Call from the element's `play` handler (a user gesture).
   * The video must be same-origin (or CORS + crossorigin attr) or the analyser reads zeros.
   * Returns false when Web Audio isn't available, so the caller can fall back to ext mode.
   */
  connect(video: HTMLMediaElement): boolean {
    try {
      if (!this.audio) {
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.78;
        analyser.connect(ctx.destination);
        this.audio = { ctx, analyser, data: new Uint8Array(analyser.frequencyBinCount) };
      }
      if (!this.sources.has(video)) {
        const src = this.audio.ctx.createMediaElementSource(video);
        src.connect(this.audio.analyser);
        this.sources.set(video, src);
      }
      if (this.audio.ctx.state === 'suspended') void this.audio.ctx.resume();
      return true;
    } catch (e) {
      console.warn('EQ: Web Audio unavailable, using simulated mode', e);
      return false;
    }
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    this.reducedQuery.removeEventListener('change', this.onReducedChange);
    void this.audio?.ctx.close();
    this.audio = null;
  }

  private readonly onReducedChange = () => {
    this.schedule();
    this.drawStatic();
  };

  private resize() {
    const d = devicePixelRatio || 1;
    const r = this.c.getBoundingClientRect();
    this.c.width = Math.max(1, Math.round(r.width * d));
    this.c.height = Math.max(1, Math.round(r.height * d));
    this.d = d;
    this.drawStatic();
  }

  /** Run the rAF loop only when visible, not destroyed, and motion is allowed. */
  private schedule() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.destroyed || !this.visible || this.reduced) return;
    this.raf = requestAnimationFrame(this.frame);
  }

  private readonly frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    this.draw(this.targets((now - this.t0) / 1000), false);
  };

  /** Reduced motion (or before the first frame): one settled frame of the current mode, no animation. */
  private drawStatic() {
    if (this.destroyed) return;
    const tg = this.mode === 'idle' ? this.targets(0) : this.simulated(1.2, false);
    this.val.set(tg);
    this.peak.set(tg);
    this.draw(tg, true);
  }

  private targets(t: number): Float32Array {
    const n = this.bars;
    if (this.mode === 'live' && this.audio) {
      const out = new Float32Array(n);
      const { analyser, data, ctx } = this.audio;
      analyser.getByteFrequencyData(data);
      const nyq = ctx.sampleRate / 2, lo = 40, hi = 14000;
      let max = 0;
      for (let i = 0; i < n; i++) {
        // log-spaced bands, like a real head-unit EQ
        const f0 = lo * Math.pow(hi / lo, i / n), f1 = lo * Math.pow(hi / lo, (i + 1) / n);
        const b0 = Math.floor((f0 / nyq) * data.length), b1 = Math.max(b0 + 1, Math.ceil((f1 / nyq) * data.length));
        let m = 0;
        for (let b = b0; b < b1 && b < data.length; b++) m = Math.max(m, data[b]);
        max = Math.max(max, m);
        out[i] = Math.pow(m / 255, 1.35) * (0.85 + (0.35 * i) / n); // gentle treble tilt
      }
      this.silentFrames = max === 0 ? this.silentFrames + 1 : 0;
      if (this.silentFrames === 90) this.opts.onSilence?.();
      return out;
    }
    if (this.mode === 'ext' || this.mode === 'live') return this.simulated(t, true);
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      out[i] = 0.16 + 0.11 * Math.sin(t * 0.7 + i * 0.33) + 0.08 * Math.sin(t * 1.15 - i * 0.61) + 0.05 * Math.sin(t * 0.37 + i * 1.7);
    }
    return out;
  }

  /** Simulated "playing" pattern for players whose audio can't be read. */
  private simulated(t: number, noise: boolean): Float32Array {
    const n = this.bars, out = new Float32Array(n);
    const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2.1)), 6);
    for (let i = 0; i < n; i++) {
      const x = i / n, tilt = 1 - x * 0.55;
      out[i] = Math.min(1, tilt * (0.28 + 0.22 * Math.sin(t * 3.1 + i * 0.7) * Math.sin(t * 1.3 + i * 0.21) + 0.3 * beat * (1 - x)) + (noise ? 0.12 * Math.random() : 0.06));
    }
    return out;
  }

  private draw(tg: Float32Array, settled: boolean) {
    const { ctx, c, d } = this, W = c.width, H = c.height;
    const floorH = this.reflect ? H * 0.78 : H;
    ctx.clearRect(0, 0, W, H);
    const gapX = 3 * d, bw = (W - gapX * (this.bars - 1)) / this.bars;
    const sh = this.seg * d, sg = this.gap * d, step = sh + sg, segs = Math.floor(floorH / step);
    for (let i = 0; i < this.bars; i++) {
      if (!settled) {
        const v = this.val[i], g = tg[i];
        this.val[i] = g > v ? v + (g - v) * 0.55 : v + (g - v) * 0.12; // fast attack, slow release
        if (this.val[i] >= this.peak[i]) {
          this.peak[i] = this.val[i];
          this.peakT[i] = 0;
        } else if (++this.peakT[i] > 18) this.peak[i] = Math.max(0, this.peak[i] - 0.012);
      }
      const lit = Math.round(Math.min(1, this.val[i]) * segs), x = i * (bw + gapX);
      for (let s = 0; s < segs; s++) {
        const y = floorH - (s + 1) * step + sg, on = s < lit, col = segColor(s / segs);
        ctx.globalAlpha = on ? 1 : 0.07;
        ctx.fillStyle = col;
        ctx.shadowColor = on ? col : 'transparent';
        ctx.shadowBlur = on ? 8 * d : 0;
        ctx.fillRect(x, y, bw, sh);
        if (this.reflect && on && s < 6) {
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 0.14 * (1 - s / 6);
          ctx.fillRect(x, floorH + s * step + sg, bw, sh);
        }
      }
      const ps = Math.min(segs - 1, Math.round(this.peak[i] * segs)); // chrome peak-hold cap
      ctx.globalAlpha = 0.95;
      ctx.shadowBlur = 6 * d;
      ctx.shadowColor = '#fff';
      ctx.fillStyle = PAL.chrome;
      ctx.fillRect(x, floorH - (ps + 1) * step + sg - 2 * d, bw, Math.max(1, 1.5 * d));
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    if (this.reflect) {
      ctx.fillStyle = '#c0c6cf33';
      ctx.fillRect(0, floorH + sg / 2, W, d);
    }
  }
}
