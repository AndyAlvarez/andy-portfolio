import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { scrollToSection } from '../../scroll';
import { ThemeSwitch } from '../../shared/theme/theme-switch';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ThemeSwitch, Icon],
  template: `
    <nav class="nav">
      <a class="logo" href="#top" (click)="go('top', $event)" aria-label="Andy Alvarez, back to top">
        <svg class="mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <g transform="rotate(-14 16 19)" fill="none" stroke="var(--accent)" stroke-width="1.9"><path d="M2.8 19 A13.2 4.6 0 0 1 29.2 19" /></g>
          <path d="M6.6 27.2 L16 4.8 L25.4 27.2" fill="none" stroke="var(--bg)" stroke-width="6" />
          <path d="M6.6 27.2 L16 4.8 L25.4 27.2" fill="none" stroke="currentColor" stroke-width="3.6" />
          <g transform="rotate(-14 16 19)" fill="none" stroke="var(--accent)" stroke-width="1.9"><path d="M29.2 19 A13.2 4.6 0 0 1 2.8 19" /></g>
          <circle cx="16" cy="19" r="2.4" fill="var(--accent)" />
        </svg>
        <span class="l-atomic" aria-hidden="true">ANDY<span>·</span>ALVAREZ</span><span class="l-pro" aria-hidden="true">Andy Alvarez</span>
      </a>
      <button type="button" class="burger" (click)="open.set(!open())" [attr.aria-expanded]="open()" aria-label="Menu">
        <app-icon name="menu" [size]="22" />
      </button>
      <ul [class.open]="open()">
        @for (l of links; track l.id) {
          <li [class.on]="l.id === active()"><a [href]="'#' + l.id" [attr.aria-current]="l.id === active() ? 'true' : null" (click)="go(l.id, $event)">{{ l.label }}</a></li>
        }
      </ul>
      <div class="hr">
        <app-theme-switch />
        <a class="cta chip-btn" href="#resume" (click)="go('resume', $event)"><app-icon class="pi" name="doc" [size]="16" />View resume</a>
      </div>
    </nav>
  `,
  styleUrl: './header.scss',
})
export class Header {
  readonly open = signal(false);
  readonly links = [
    { id: 'top', label: 'Home' },
    { id: 'work', label: 'Work' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];
  /** Scroll-spy: id of the section currently under the reading line (hero = 'top'). */
  readonly active = signal('top');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let raf = 0;
      const update = () => {
        raf = 0;
        const doc = document.documentElement;
        // Reached the bottom: the last (short) section wins even if its top never crosses the line.
        if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
          this.active.set(this.links[this.links.length - 1].id);
          return;
        }
        const line = window.innerHeight * 0.35;
        let current = this.links[0].id;
        for (const l of this.links) {
          const el = document.getElementById(l.id);
          if (el && el.getBoundingClientRect().top <= line) current = l.id;
        }
        this.active.set(current);
      };
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        if (raf) cancelAnimationFrame(raf);
      });
    });
  }

  go(id: string, ev: Event) {
    this.open.set(false);
    scrollToSection(id, ev);
  }
}
