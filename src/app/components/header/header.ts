import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
          <li [class.on]="l.id === 'top'"><a [href]="'#' + l.id" (click)="go(l.id, $event)">{{ l.label }}</a></li>
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
  go(id: string, ev: Event) {
    this.open.set(false);
    scrollToSection(id, ev);
  }
}
