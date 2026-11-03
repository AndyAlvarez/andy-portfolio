import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';

/**
 * Silent ambient loop (no audio track): autoplays muted, loops, no controls, never feeds the EQ.
 * The file only loads once the clip scrolls near the viewport, and it pauses when off-screen.
 * With prefers-reduced-motion it stays on the poster frame.
 */
@Component({
  selector: 'app-loop-clip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<video #v [poster]="poster()" muted loop playsinline preload="none" disablePictureInPicture disableRemotePlayback
    controlsList="nodownload noremoteplayback nofullscreen" (contextmenu)="$event.preventDefault()" aria-hidden="true"></video>`,
  styles: `:host { display: block; position: relative; background: #000; }
    video { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }`,
})
export class LoopClip {
  readonly src = input.required<string>();
  readonly poster = input<string>('');
  private readonly v = viewChild.required<ElementRef<HTMLVideoElement>>('v');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.v().nativeElement;
      el.muted = true;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            if (!el.getAttribute('src')) el.src = this.src();
            el.play().catch(() => {});
          } else if (!el.paused) {
            el.pause();
          }
        },
        { rootMargin: '200px' },
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
