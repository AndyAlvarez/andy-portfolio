import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { scrollToSection } from '../../scroll';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="nav">
      <a class="logo" href="#top" (click)="go('top', $event)">ANDY<span>·</span>ALVAREZ</a>
      <button type="button" class="burger" (click)="open.set(!open())" [attr.aria-expanded]="open()" aria-label="Menu">☰</button>
      <ul [class.open]="open()">
        @for (l of links; track l.id) {
          <li [class.on]="l.id === active()"><a [href]="'#' + l.id" [attr.aria-current]="l.id === active() ? 'true' : null" (click)="go(l.id, $event)">{{ l.label }}</a></li>
        }
      </ul>
      <a class="cta chip-btn" href="#resume" (click)="go('resume', $event)">VIEW RESUME</a>
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
