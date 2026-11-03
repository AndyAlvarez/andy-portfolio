import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, viewChild,
} from '@angular/core';
import { EqService } from '../../shared/eq/eq.service';
import { HeadUnitEQ } from '../../shared/eq/head-unit-eq';

const barsFor = (w: number) => (w < 600 ? 30 : 72);

/** Full-width hero EQ band. Idle drift by default; live / simulated while a video on the page plays. */
@Component({
  selector: 'app-eq-band',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="r">
      <span aria-live="polite"><b [class.on]="mode() !== 'idle'">● {{ status() }}</b> · {{ detail() }}</span>
    </div>
    <canvas #c aria-hidden="true"></canvas>
  `,
  styleUrl: './eq-band.scss',
})
export class EqBand {
  private readonly svc = inject(EqService);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('c');
  readonly mode = this.svc.mode;
  readonly status = computed(() => ({ idle: 'IDLE', live: 'LIVE', ext: 'SIMULATED' })[this.mode()]);
  readonly detail = computed(() => (this.mode() === 'idle' ? 'AMBIENT' : this.svc.label() || 'NOW PLAYING'));

  constructor() {
    let eq: HeadUnitEQ | undefined;
    const onResize = () => eq?.setBars(barsFor(innerWidth));
    afterNextRender(() => {
      eq = new HeadUnitEQ(this.canvas().nativeElement, {
        bars: barsFor(innerWidth),
        segH: 4,
        segGap: 2,
        reflect: false,
        onSilence: () => this.svc.liveWasSilent(),
      });
      this.svc.register(eq);
      addEventListener('resize', onResize, { passive: true });
    });
    inject(DestroyRef).onDestroy(() => {
      removeEventListener('resize', onResize);
      if (eq) {
        this.svc.unregister(eq);
        eq.destroy();
      }
    });
  }
}
