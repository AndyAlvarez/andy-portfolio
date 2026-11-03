import { Injectable, computed, signal } from '@angular/core';
import { EqMode, HeadUnitEQ } from './head-unit-eq';

interface Source {
  mode: Exclude<EqMode, 'idle'>;
  label: string;
}

/**
 * Bus between media players and the hero EQ band.
 *  - Self-hosted <video> (InlineVideo) -> `attachVideo()` -> live Web Audio mode while it plays
 *  - YouTube embeds (YtEmbed)          -> `setSource(key, 'ext' | null)` -> simulated mode while it plays
 * The most recently started source wins; when everything stops the band returns to idle.
 */
@Injectable({ providedIn: 'root' })
export class EqService {
  private eq: HeadUnitEQ | null = null;
  private readonly active = signal<ReadonlyMap<string, Source>>(new Map());
  private readonly current = computed(() => {
    const all = [...this.active().values()];
    return all.length ? all[all.length - 1] : null;
  });
  readonly mode = computed<EqMode>(() => this.current()?.mode ?? 'idle');
  readonly label = computed(() => this.current()?.label ?? '');

  register(eq: HeadUnitEQ) {
    this.eq = eq;
    eq.setMode(this.mode());
  }

  unregister(eq: HeadUnitEQ) {
    if (this.eq === eq) this.eq = null;
  }

  /** Set (or clear with null) what a given player is doing. */
  setSource(key: string, mode: Source['mode'] | null, label = '') {
    const next = new Map(this.active());
    next.delete(key); // re-insert so the latest start is last
    if (mode) next.set(key, { mode, label });
    this.active.set(next);
    this.eq?.setMode(this.mode());
  }

  /** Live mode read only silence (no audio track / muted): show the simulated pattern instead. */
  liveWasSilent() {
    const next = new Map(this.active());
    for (const [k, s] of next) if (s.mode === 'live') next.set(k, { mode: 'ext', label: `${s.label} · NO AUDIO, SIMULATED` });
    this.active.set(next);
    this.eq?.setMode(this.mode());
  }

  /** Hook a self-hosted <video>. Returns a detach function. */
  attachVideo(key: string, video: HTMLVideoElement, label: string): () => void {
    const start = () => {
      const live = this.eq?.connect(video) ?? false;
      this.setSource(key, live ? 'live' : 'ext', label);
    };
    const stop = () => this.setSource(key, null);
    video.addEventListener('play', start);
    video.addEventListener('pause', stop);
    video.addEventListener('ended', stop);
    return () => {
      video.removeEventListener('play', start);
      video.removeEventListener('pause', stop);
      video.removeEventListener('ended', stop);
      stop();
    };
  }
}
