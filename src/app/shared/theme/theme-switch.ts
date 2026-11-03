import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChildren } from '@angular/core';
import { Icon } from '../icon/icon';
import { IconName } from '../../data/profile';
import { THEMES, Theme, ThemeService } from './theme.service';

/**
 * Three-way theme control: Light / Dark (Pro) and Atomic. An ARIA radiogroup with roving tabindex:
 * arrow keys / Home / End move and select, Tab leaves the group. Sun and moon are icon-only with
 * tooltips; "Atomic" shows its label on wide screens. Every option keeps a text name for screen readers.
 */
@Component({
  selector: 'app-theme-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="seg" role="radiogroup" aria-label="Site theme" (keydown)="onKey($event)">
      @for (o of opts; track o.id) {
        <button #b type="button" role="radio" [class]="'o-' + o.id" [class.on]="o.id === svc.theme()"
          [attr.aria-checked]="o.id === svc.theme()" [attr.tabindex]="o.id === svc.theme() ? 0 : -1"
          [attr.title]="o.tip" (click)="svc.set(o.id)">
          <app-icon [name]="o.icon" [size]="16" /><span class="lbl">{{ o.label }}</span>
        </button>
      }
    </div>
  `,
  styleUrl: './theme-switch.scss',
})
export class ThemeSwitch {
  readonly svc = inject(ThemeService);
  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('b');
  readonly opts: { id: Theme; label: string; tip: string; icon: IconName }[] = [
    { id: 'light', label: 'Light', tip: 'Light', icon: 'sun' },
    { id: 'dark', label: 'Dark', tip: 'Dark', icon: 'moon' },
    { id: 'atomic', label: 'Atomic', tip: 'Atomic (Y2K chrome look)', icon: 'atom' },
  ];

  onKey(ev: KeyboardEvent) {
    const i = THEMES.indexOf(this.svc.theme());
    const n = THEMES.length;
    let j: number;
    switch (ev.key) {
      case 'ArrowRight': case 'ArrowDown': j = (i + 1) % n; break;
      case 'ArrowLeft': case 'ArrowUp': j = (i - 1 + n) % n; break;
      case 'Home': j = 0; break;
      case 'End': j = n - 1; break;
      default: return;
    }
    ev.preventDefault();
    this.svc.set(THEMES[j]);
    this.buttons()[j]?.nativeElement.focus();
  }
}
