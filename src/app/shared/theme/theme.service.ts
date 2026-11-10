import { ApplicationRef, DOCUMENT, Injectable, PLATFORM_ID, afterNextRender, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { powerDown, powerOn } from './crt';

/** light / dark = the Pro look; atomic = the Atomic look. */
export type Theme = 'light' | 'dark' | 'atomic';
export const THEMES: readonly Theme[] = ['light', 'dark', 'atomic'];
export const isTheme = (v: unknown): v is Theme => v === 'light' || v === 'dark' || v === 'atomic';

/** Browser UI colour per theme (keep in sync with the inline script in index.html). */
const THEME_COLOR: Record<Theme, string> = { light: '#FAFAF8', dark: '#0B0F17', atomic: '#0B0B12' };

/**
 * Site theme. The inline script in index.html picks the first theme before paint
 * (?theme= > localStorage `theme` > prefers-color-scheme) and sets data-theme / data-ui on <html>.
 *
 * Prerender and the first client render (hydration) always start as light so the DOM matches.
 * After hydration, this service reads the attribute the inline script already set.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme = signal<Theme>('light');
  readonly atomic = computed(() => this.theme() === 'atomic');

  constructor() {
    afterNextRender(() => {
      const t = this.doc.documentElement.getAttribute('data-theme');
      if (isTheme(t) && t !== this.theme()) this.theme.set(t);
    });
  }

  set(next: Theme) {
    if (!this.browser || next === this.theme()) return;
    try { localStorage.setItem('theme', next); } catch { /* private mode: still switch for this visit */ }
    this.dropUrlParam();
    const apply = () => {
      this.theme.set(next);
      this.applyAttrs(next);
    };
    const reduce = this.doc.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduce) return apply();
    // Into / out of Atomic: CRT power-on / power-down; the swap happens while the screen is dark.
    // A click during the effect just retargets it: the latest pick is what gets applied.
    if (this.crt) { this.crt.target = next; if (this.crt.swapped) apply(); return; }
    const prev = this.theme();
    if ((next === 'atomic' || prev === 'atomic') && typeof this.doc.body.animate === 'function') {
      const crt: { target: Theme; swapped: boolean } = { target: next, swapped: false };
      this.crt = crt;
      const swap = () => {
        crt.swapped = true;
        this.theme.set(crt.target);
        this.applyAttrs(crt.target);
        this.appRef.tick();
      };
      (next === 'atomic' ? powerOn : powerDown)(this.doc, swap)
        .catch(() => { if (!crt.swapped) swap(); })
        .finally(() => { this.crt = null; });
      return;
    }
    // Light <-> dark: short cross-fade; render the new theme inside the transition callback.
    const vt = (this.doc as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
    if (typeof vt !== 'function') return apply();
    vt.call(this.doc, () => { apply(); this.appRef.tick(); });
  }

  private crt: { target: Theme; swapped: boolean } | null = null;

  private applyAttrs(t: Theme) {
    const html = this.doc.documentElement;
    html.setAttribute('data-theme', t);
    html.setAttribute('data-ui', t === 'atomic' ? 'atomic' : 'pro');
    this.doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[t]);
  }

  /** A ?theme= link only sets the first visit; once the visitor picks, a reload keeps their pick. */
  private dropUrlParam() {
    const win = this.doc.defaultView;
    if (!win) return;
    const url = new URL(win.location.href);
    if (!url.searchParams.has('theme')) return;
    url.searchParams.delete('theme');
    win.history.replaceState(win.history.state, '', url);
  }
}
