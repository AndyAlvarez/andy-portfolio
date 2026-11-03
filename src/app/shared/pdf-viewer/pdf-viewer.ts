import {
  ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterNextRender, input, signal, viewChild,
} from '@angular/core';
import { ViewerFrame } from '../viewer-frame/viewer-frame';

/**
 * Inline PDF viewer built on pdf.js (pdfjs-dist). Pages are rendered to <canvas>,
 * so there is no browser PDF toolbar and no download / print button.
 */
@Component({
  selector: 'app-pdf-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewerFrame],
  template: `
    <app-viewer-frame [name]="name()" [pageLabel]="page() + ' / ' + (pages() || '…')" [zoomPct]="zoomPct()"
      [zoomable]="true" (zoom)="onZoom($event)">
      <div #host class="pages">
        @if (error()) { <p class="err">Couldn't load the document.</p> }
      </div>
    </app-viewer-frame>
  `,
  styles: `
    :host { display: block; min-height: 0; }
    app-viewer-frame { height: 100%; }
    .pages { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 10px; }
    :host ::ng-deep canvas.pdfpage { width: calc(var(--z, 1) * 100%); height: auto; box-shadow: 0 4px 18px #0008; background: #fff; }
    .err { color: var(--chrome); font-family: var(--f-vfd); }
    :host-context([data-ui='pro']) {
      ::ng-deep canvas.pdfpage { box-shadow: 0 2px 12px rgba(0, 0, 0, .18); }
      .err { color: var(--mut); font-family: var(--f-sans); }
    }
  `,
})
export class PdfViewer implements OnDestroy {
  readonly src = input.required<string>();
  readonly name = input.required<string>();
  readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  readonly pages = signal(0);
  readonly page = signal(1);
  readonly zoomPct = signal(100);
  readonly error = signal(false);
  private task: { destroy(): Promise<void> } | null = null;
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => this.lazyLoad());
  }

  /** Only fetch + render the PDF when the viewer scrolls near the viewport. */
  private lazyLoad() {
    const el = this.host().nativeElement;
    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        this.observer?.disconnect();
        this.render().catch(() => this.error.set(true));
      }
    }, { rootMargin: '600px' });
    this.observer.observe(el);
  }

  private async render() {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.min.mjs';
    const task = pdfjs.getDocument({ url: this.src() });
    this.task = task;
    const doc = await task.promise;
    this.pages.set(doc.numPages);
    const host = this.host().nativeElement;
    host.parentElement?.addEventListener('scroll', () => this.onScroll(), { passive: true });
    const cssWidth = Math.max(host.clientWidth, 320);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (let i = 1; i <= doc.numPages; i++) {
      const p = await doc.getPage(i);
      const base = p.getViewport({ scale: 1 });
      const vp = p.getViewport({ scale: ((cssWidth * 1.6) / base.width) * dpr });
      const canvas = document.createElement('canvas');
      canvas.className = 'pdfpage';
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      canvas.dataset['page'] = String(i);
      host.appendChild(canvas);
      await p.render({ canvas, viewport: vp }).promise;
    }
  }

  onScroll() {
    const body = this.host().nativeElement.parentElement;
    if (!body) return;
    const top = body.getBoundingClientRect().top;
    const canvases = Array.from(this.host().nativeElement.querySelectorAll('canvas'));
    let current = 1;
    for (const c of canvases) if (c.getBoundingClientRect().top - top < body.clientHeight / 2) current = +(c.dataset['page'] ?? 1);
    this.page.set(current);
  }

  onZoom(dir: number) {
    const z = Math.min(200, Math.max(60, this.zoomPct() + dir * 20));
    this.zoomPct.set(z);
    this.host().nativeElement.style.setProperty('--z', String(z / 100));
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.task?.destroy();
  }
}
