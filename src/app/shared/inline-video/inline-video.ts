import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, output, viewChild,
} from '@angular/core';
import { EqService } from '../eq/eq.service';

let nextId = 0;

/**
 * HTML5 player for Andy's own clips. Downloads stay blocked: controlsList="nodownload noremoteplayback",
 * no picture-in-picture / remote playback, no context menu. While it plays, the hero EQ reacts live to its audio
 * (same-origin file, Web Audio analyser); clips without an audio track fall back to the simulated pattern.
 */
@Component({
  selector: 'app-inline-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <video #v [src]="src()" [poster]="poster()" controls muted playsinline preload="none"
      controlsList="nodownload noremoteplayback" disablePictureInPicture disableRemotePlayback
      (contextmenu)="$event.preventDefault()" (play)="playing.emit(true)" (pause)="playing.emit(false)"
      (ended)="playing.emit(false)"></video>
    @if (label()) { <span class="lab">{{ label() }}</span> }
  `,
  styles: `
    :host { display: block; position: relative; background: #000; overflow: hidden; border: 1px solid #c0c6cf44; }
    video { width: 100%; height: 100%; object-fit: cover; display: block; }
    .lab { position: absolute; left: 8px; top: 8px; padding: 3px 8px; background: #000c; color: var(--cyan);
      font-family: var(--f-vfd); font-size: 15px; pointer-events: none; }
  `,
})
export class InlineVideo {
  private readonly eq = inject(EqService);
  readonly src = input.required<string>();
  readonly poster = input<string>('');
  readonly label = input<string>('');
  /** Short label shown on the EQ band while this clip plays. */
  readonly eqLabel = input('OWN CLIP');
  readonly playing = output<boolean>();
  private readonly v = viewChild.required<ElementRef<HTMLVideoElement>>('v');

  constructor() {
    let detach: (() => void) | undefined;
    afterNextRender(() => {
      detach = this.eq.attachVideo(`vid-${nextId++}`, this.v().nativeElement, this.eqLabel());
    });
    inject(DestroyRef).onDestroy(() => detach?.());
  }
}
