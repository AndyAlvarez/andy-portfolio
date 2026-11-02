import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** HTML5 player for Andy's own clips. No download control, no context menu. */
@Component({
  selector: 'app-inline-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <video [src]="src()" [poster]="poster()" controls muted playsinline preload="none"
      controlsList="nodownload noremoteplayback" disablePictureInPicture disableRemotePlayback
      (contextmenu)="$event.preventDefault()"></video>
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
  readonly src = input.required<string>();
  readonly poster = input<string>('');
  readonly label = input<string>('');
}
