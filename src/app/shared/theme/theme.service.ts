import { ApplicationRef, DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

/** light / dark = the Pro look; atomic = the Y2K chrome look. */
export type Theme = 'light' | 'dark' | 'atomic';
export const THEMES: readonly Theme[] = ['light', 'dark', 'atomic'];
export const isTheme = (v: unknown): v is Theme => v === 'light' || v === 'dark' || v === 'atomic';

/** Browser UI colour per theme (keep in sync with the inline script in index.html). */
const THEME_COLOR: Record<Theme, string> = { light: '#FAFAF8', dark: '#0B0F17', atomic: '#0B0B12' };

/**
 * Site theme. The inline script in index.html picks the first theme before paint
 * (?theme= > localStorage `theme` > prefers-color-scheme) and sets data-theme / data-ui on <html>;
 * this service reads that, and applies + saves later changes.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  readonly theme = signal<Theme>(this.initial());
  readonly atomic = computed(() => this.theme() === 'atomic');

  set(next: Theme) {
    if (next === this.theme()) return;
    try { localStorage.setItem('theme', next); } catch { /* private mode: still switch for this visit */ }
    this.dropUrlParam();
    const apply = () => {
      this.theme.set(next);
      this.applyAttrs(next);
    };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vt = (this.doc as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
    if (reduce || typeof vt !== 'function') return apply();
    // Short cross-fade between looks; render the new theme inside the transition callback.
    vt.call(this.doc, () => { apply(); this.appRef.tick(); });
  }

  private initial(): Theme {
    const t = this.doc.documentElement.getAttribute('data-theme');
    if (isTheme(t)) return t;
    const fallback: Theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.applyAttrs(fallback);
    return fallback;
  }

  private applyAttrs(t: Theme) {
    const html = this.doc.documentElement;
    html.setAttribute('data-theme', t);
    html.setAttribute('data-ui', t === 'atomic' ? 'atomic' : 'pro');
    this.doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[t]);
  }

  /** A ?theme= link only sets the first visit; once the visitor picks, a reload keeps their pick. */
  private dropUrlParam() {
    const url = new URL(location.href);
    if (!url.searchParams.has('theme')) return;
    url.searchParams.delete('theme');
    history.replaceState(history.state, '', url);
  }
}
