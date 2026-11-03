import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, input, signal, viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Video, thumbFor } from '../../data/videos';
import { EqService } from '../eq/eq.service';

const YT_ORIGIN = 'https://www.youtube-nocookie.com';
let nextId = 0;

/**
 * Thumbnail facade; swaps to a youtube-nocookie iframe only when clicked (plays inline, no link-out).
 * While it plays, the hero EQ shows its simulated pattern (YouTube audio can't be analysed cross-origin).
 * Play/pause is read from the embed's postMessage events (enablejsapi=1) without loading the YouTube API script.
 */
@Component({
  selector: 'app-yt-embed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (playing()) {
      <iframe #frame [src]="url()" [title]="video().title" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen (load)="listen()"></iframe>
    } @else {
      <button type="button" class="facade" (click)="play()" [attr.aria-label]="'Play video: ' + video().title">
        <img [src]="thumb()" alt="" [attr.loading]="eager() ? 'eager' : 'lazy'" [attr.fetchpriority]="eager() ? 'high' : null" decoding="async" />
        <span class="play" aria-hidden="true">▶</span>
        @if (caption()) {
          <span class="cap">
            <b>{{ video().title }}</b>
            <span>{{ video().source }} · {{ video().date }}</span>
          </span>
        }
      </button>
    }
  `,
  styleUrl: './yt-embed.scss',
})
export class YtEmbed {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly eq = inject(EqService);
  private readonly key = `yt-${nextId++}`;
  readonly video = input.required<Video>();
  /** Load the thumbnail eagerly (above-the-fold hero). */
  readonly eager = input(false);
  /** Show the title/source caption over the thumbnail. */
  readonly caption = input(true);
  /** Short label shown on the EQ band while this video plays. */
  readonly eqLabel = input('');
  readonly playing = signal(false);
  readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');
  readonly thumb = computed(() => thumbFor(this.video()));
  readonly url = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `${YT_ORIGIN}/embed/${encodeURIComponent(this.video().id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1` +
        `&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`,
    ),
  );

  private readonly onMessage = (ev: MessageEvent) => {
    const win = this.frame()?.nativeElement.contentWindow;
    if (!win || ev.source !== win || typeof ev.data !== 'string') return;
    let msg: { event?: string; info?: unknown };
    try {
      msg = JSON.parse(ev.data);
    } catch {
      return;
    }
    let state: number | undefined;
    if (msg.event === 'onStateChange' && typeof msg.info === 'number') state = msg.info;
    else if (msg.event === 'infoDelivery' && msg.info && typeof (msg.info as { playerState?: unknown }).playerState === 'number') {
      state = (msg.info as { playerState: number }).playerState;
    }
    // 1 = playing, 3 = buffering (keep), 0 = ended, 2 = paused, 5 = cued
    if (state === 1) this.eq.setSource(this.key, 'ext', this.label());
    else if (state === 0 || state === 2 || state === 5) this.eq.setSource(this.key, null);
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('message', this.onMessage);
      this.eq.setSource(this.key, null);
    });
  }

  play() {
    this.playing.set(true);
    // The click is the intent to play; state messages from the player refine this once it loads.
    this.eq.setSource(this.key, 'ext', this.label());
    window.addEventListener('message', this.onMessage);
  }

  /** Ask the embed to post its state changes to this page. */
  listen() {
    const win = this.frame()?.nativeElement.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: 'listening', id: this.key, channel: 'widget' }), YT_ORIGIN);
    win.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'], id: this.key, channel: 'widget' }), YT_ORIGIN);
  }

  private label() {
    return this.eqLabel() || this.video().source.toUpperCase();
  }
}
