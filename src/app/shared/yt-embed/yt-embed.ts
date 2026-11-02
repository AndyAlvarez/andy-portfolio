import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Video, thumbFor } from '../../data/videos';

/** Thumbnail facade; swaps to a youtube-nocookie iframe only when clicked. */
@Component({
  selector: 'app-yt-embed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (playing()) {
      <iframe [src]="url()" [title]="video().title" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } @else {
      <button type="button" class="facade" (click)="playing.set(true)" [attr.aria-label]="'Play video: ' + video().title">
        <img [src]="thumb()" alt="" [attr.loading]="eager() ? 'eager' : 'lazy'" [attr.fetchpriority]="eager() ? 'high' : null" decoding="async" />
        <span class="play" aria-hidden="true">▶</span>
        <span class="cap">
          <b>{{ video().title }}</b>
          <span>{{ video().source }} · {{ video().date }}@if (video().note) { · {{ video().note }} }</span>
        </span>
      </button>
    }
  `,
  styleUrl: './yt-embed.scss',
})
export class YtEmbed {
  private readonly sanitizer = inject(DomSanitizer);
  readonly video = input.required<Video>();
  /** Load the thumbnail eagerly (above-the-fold hero). */
  readonly eager = input(false);
  readonly playing = signal(false);
  readonly thumb = computed(() => thumbFor(this.video()));
  readonly url = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.video().id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    ),
  );
}
