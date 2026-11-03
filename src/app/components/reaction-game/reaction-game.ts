import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

type State = 'idle' | 'wait' | 'lit' | 'done' | 'early';

/**
 * "How fast is 200 ms?": a small reaction test next to the PCM's <200 ms glass-to-glass figure.
 * Start, wait 1.4–3.0 s for the pad to light, then press it (mouse, touch, Enter or Space). Nothing is stored.
 */
@Component({
  selector: 'app-reaction-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rx" [attr.data-s]="state()">
      <button type="button" class="pad" [attr.aria-label]="padLabel()" (pointerdown)="press($event)" (keydown)="key($event)">
        @if (state() === 'done') { <span class="num">{{ ms() }}<small>ms</small></span> } @else { <span class="dot"></span> }
      </button>
      <div class="rt" aria-live="polite"><b>{{ line1() }}</b><span>{{ line2() }}</span>@if (line3()) { <span>{{ line3() }}</span> }</div>
      <button type="button" class="go" (click)="start()">{{ state() === 'idle' ? 'Start' : 'Again' }}</button>
    </div>
  `,
  styleUrl: './reaction-game.scss',
})
export class ReactionGame {
  readonly state = signal<State>('idle');
  readonly ms = signal(0);
  readonly line1 = signal('How fast is 200 ms?');
  readonly line2 = signal('Click Start, then click the pad as soon as it lights up.');
  readonly line3 = signal('');
  private timer = 0;
  private t0 = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  padLabel() {
    const s = this.state();
    return s === 'lit' ? 'Reaction pad: press now' : s === 'wait' ? 'Reaction pad: wait for the light' : 'Reaction pad';
  }

  start() {
    clearTimeout(this.timer);
    this.show('wait', 'Wait for it…', 'Click the pad the moment it turns blue.');
    this.timer = window.setTimeout(() => {
      this.t0 = performance.now();
      this.show('lit', 'Now!', 'Click the pad.');
    }, 1400 + Math.random() * 1600);
  }

  press(ev: Event) {
    const s = this.state();
    if (s === 'wait') {
      clearTimeout(this.timer);
      this.show('early', 'Too soon.', 'Wait for the light, then click. Press Again.');
    } else if (s === 'lit') {
      const ms = Math.round(performance.now() - this.t0);
      this.ms.set(ms);
      this.show('done', `Your reaction: ${ms} ms.`, 'The shuttle video link: under 200 ms glass-to-glass.',
        ms < 200 ? 'You beat it. Nice reflexes.' : 'The video got there first.');
    } else {
      this.start();
    }
    if (ev.cancelable) ev.preventDefault();
  }

  key(ev: KeyboardEvent) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    if (!ev.repeat) this.press(ev);
  }

  private show(s: State, a: string, b: string, c = '') {
    this.state.set(s);
    this.line1.set(a);
    this.line2.set(b);
    this.line3.set(c);
  }
}
