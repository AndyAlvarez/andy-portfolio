import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, output, signal, viewChild,
} from '@angular/core';
import { EqService } from '../eq/eq.service';

let nextId = 0;

/**
 * HTML5 player for my own clips. Downloads stay blocked: controlsList="nodownload noremoteplayback",
 * no picture-in-picture / remote playback, no context menu. While it plays, the hero EQ reacts live to its audio
 * (same-origin file, Web Audio analyser); clips without an audio track fall back to the simulated pattern.
 */
@Component({
  selector: 'app-inline-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <video #v [src]="src()" [poster]="poster()" controls [muted]="muted()" playsinline preload="none"
      controlsList="nodownload noremoteplayback" disablePictureInPicture disableRemotePlayback
      (contextmenu)="$event.preventDefault()" (play)="onPlay(true)" (pause)="onPlay(false)"
      (ended)="onPlay(false)"></video>
    @if (bigPlay() && !isPlaying()) {
      <button type="button" class="bigplay" (click)="play()" [attr.aria-label]="'Play ' + (label() || 'video')"><i></i></button>
    }
    @if (label()) { <span class="lab">{{ label() }}</span> }
  `,
  styles: `
    :host { display: block; position: relative; background: #000; overflow: hidden; }
    video { width: 100%; height: 100%; object-fit: cover; display: block; }
    .lab { position: absolute; left: 8px; top: 8px; padding: 3px 8px; pointer-events: none; }
    /* Centered play button; sits above any card insets (they use z-index 2). */
    .bigplay { all: unset; cursor: pointer; position: absolute; left: 50%; top: 50%; z-index: 5; transform: translate(-50%, -50%);
      border-radius: 50%; transition: transform .15s, background .15s; }
    .bigplay:hover, .bigplay:focus-visible { transform: translate(-50%, -50%) scale(1.08); }
    .bigplay i { position: absolute; border-style: solid; }
    :host-context([data-ui='atomic']) {
      & { border: 1px solid #c0c6cf44; }
      .lab { background: #000c; color: var(--cyan); font-family: var(--f-vfd); font-size: 15px; }
      .bigplay { width: 76px; height: 76px; background: #05060acc; border: 2px solid var(--cyan); }
      .bigplay i { left: 31px; top: 23px; border-width: 15px 0 15px 24px;
        border-color: transparent transparent transparent var(--cyan); }
      .bigplay:hover, .bigplay:focus-visible { background: #00e5ff22; }
      @media (max-width: 600px) {
        .bigplay { width: 60px; height: 60px; }
        .bigplay i { left: 24px; top: 18px; border-width: 12px 0 12px 19px; }
      }
    }
    :host-context([data-ui='pro']) {
      .lab { border-radius: 4px; background: rgba(0, 0, 0, .66); color: #fff; font: 500 11px var(--f-mono); }
      .bigplay { width: 58px; height: 58px; background: rgba(255, 255, 255, .92); box-shadow: 0 6px 24px rgba(0, 0, 0, .3); }
      .bigplay i { left: 23px; top: 18px; border-width: 11px 0 11px 17px; border-color: transparent transparent transparent #111; }
      .bigplay:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
    }
  `,
})
export class InlineVideo {
  private readonly eq = inject(EqService);
  readonly src = input.required<string>();
  readonly poster = input<string>('');
  readonly label = input<string>('');
  /** Short label shown on the EQ band while this clip plays. */
  readonly eqLabel = input('OWN CLIP');
  /** Start muted (default). Set false for clips with an audio track so the EQ reacts live. */
  readonly muted = input(true);
  /** Show a large centered play button over the poster until the clip plays. */
  readonly bigPlay = input(false);
  readonly playing = output<boolean>();
  readonly isPlaying = signal(false);
  private readonly v = viewChild.required<ElementRef<HTMLVideoElement>>('v');

  onPlay(on: boolean) {
    this.isPlaying.set(on);
    this.playing.emit(on);
  }

  play() {
    void this.v().nativeElement.play();
  }

  constructor() {
    let detach: (() => void) | undefined;
    afterNextRender(() => {
      detach = this.eq.attachVideo(`vid-${nextId++}`, this.v().nativeElement, this.eqLabel());
    });
    inject(DestroyRef).onDestroy(() => detach?.());
  }
}
