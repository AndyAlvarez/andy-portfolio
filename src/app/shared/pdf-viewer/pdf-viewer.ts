import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, inject, input, signal, viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ViewerFrame } from '../viewer-frame/viewer-frame';

type PdfDoc = {
  numPages: number;
  getPage(n: number): Promise<{
    getViewport(opts: { scale: number }): { width: number; height: number };
    render(opts: { canvas: HTMLCanvasElement; viewport: { width: number; height: number } }): { promise: Promise<void> };
  }>;
  destroy(): Promise<void>;
};

/**
 * Inline PDF viewer built on pdf.js (pdfjs-dist). Pages are drawn to <canvas>.
 * Zoom is pixel-based with two-axis pan; Fit width resets to the current pane;
 * Expand opens a full-viewport dialog. Download / Open use the same served file.
 */
@Component({
  selector: 'app-pdf-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewerFrame],
  template: `
    <div #home class="home">
      <div #shell class="shell">
        <app-viewer-frame [name]="name()" [href]="src()" [pageLabel]="page() + ' / ' + (pages() || '…')"
          [zoomPct]="zoomPct()" [zoomable]="true" [expanded]="expanded()"
          (zoom)="onZoom($event)" (fit)="fitWidth()" (expand)="expand()" (close)="collapse()">
          <div #host class="pages">
            @if (error()) { <p class="err">Couldn't load the document.</p> }
          </div>
        </app-viewer-frame>
      </div>
    </div>
    <dialog #dlg class="expand-dlg" aria-label="Document viewer" (cancel)="onCancel($event)" (click)="onBackdrop($event)">
    </dialog>
  `,
  styles: `
    :host { display: block; height: 100%; min-height: 0; }
    .home, .shell { height: 100%; min-height: 0; display: flex; flex-direction: column; }
    .shell app-viewer-frame { flex: 1; min-height: 0; height: 100%; }
    .pages { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; width: max-content; min-width: 100%; }
    :host ::ng-deep canvas.pdfpage { height: auto; box-shadow: 0 4px 18px #0008; background: #fff; display: block; }
    .err { color: var(--chrome); font-family: var(--f-vfd); }
    .expand-dlg { width: 100vw; height: 100vh; max-width: none; max-height: none; margin: 0; padding: 28px 36px; border: 0; background: transparent; }
    .expand-dlg[open] { display: flex; flex-direction: column; }
    .expand-dlg .shell { flex: 1; min-height: 0; }
    .expand-dlg::backdrop { background: rgba(14, 17, 22, .52); }
    @media (max-width: 700px) { .expand-dlg { padding: 8px; } }
    :host-context([data-ui='pro']) {
      ::ng-deep canvas.pdfpage { box-shadow: 0 2px 12px rgba(0, 0, 0, .18); }
      .err { color: var(--mut); font-family: var(--f-sans); }
      .expand-dlg .shell app-viewer-frame { border-radius: 12px; }
    }
    :host-context([data-ui='atomic']) {
      .expand-dlg { padding: 18px 20px; }
      .expand-dlg::backdrop { background: #000c; }
    }
  `,
})
export class PdfViewer {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly src = input.required<string>();
  readonly name = input.required<string>();
  readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  readonly home = viewChild.required<ElementRef<HTMLDivElement>>('home');
  readonly shell = viewChild.required<ElementRef<HTMLDivElement>>('shell');
  readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  readonly pages = signal(0);
  readonly page = signal(1);
  readonly zoomPct = signal(100);
  readonly expanded = signal(false);
  readonly error = signal(false);

  private pdf: PdfDoc | null = null;
  private task: { destroy(): Promise<void> } | null = null;
  private observer?: IntersectionObserver;
  private baseWidth = 0;
  private zoomTimer = 0;
  private paintGen = 0;

  constructor() {
    afterNextRender(() => this.lazyLoad());
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.zoomTimer);
      this.observer?.disconnect();
      void this.task?.destroy();
      this.pdf = null;
    });
  }

  /** Only fetch + render the PDF when the viewer scrolls near the viewport. */
  private lazyLoad() {
    const el = this.host().nativeElement;
    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        this.observer?.disconnect();
        this.observer = undefined;
        this.open().catch(() => this.error.set(true));
      }
    }, { rootMargin: '600px' });
    this.observer.observe(el);
  }

  private async open() {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.min.mjs';
    const task = pdfjs.getDocument({ url: this.src() });
    this.task = task;
    this.pdf = (await task.promise) as unknown as PdfDoc;
    this.pages.set(this.pdf.numPages);
    const body = this.host().nativeElement.parentElement;
    body?.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.baseWidth = this.measureBase();
    await this.paint();
  }

  onZoom(dir: number) {
    const z = Math.min(200, Math.max(60, this.zoomPct() + dir * 20));
    this.applyZoom(z);
    this.schedulePaint();
  }

  fitWidth() {
    this.baseWidth = this.measureBase();
    this.applyZoom(100);
    this.schedulePaint();
  }

  expand() {
    if (!this.browser || this.expanded()) return;
    const dlg = this.dlg().nativeElement;
    dlg.appendChild(this.shell().nativeElement);
    dlg.showModal();
    this.expanded.set(true);
    this.afterLayout(() => this.fitWidth());
  }

  collapse() {
    if (!this.expanded()) return;
    this.home().nativeElement.appendChild(this.shell().nativeElement);
    const dlg = this.dlg().nativeElement;
    if (dlg.open) dlg.close();
    this.expanded.set(false);
    this.afterLayout(() => this.fitWidth());
  }

  onCancel(ev: Event) {
    ev.preventDefault();
    this.collapse();
  }

  onBackdrop(ev: MouseEvent) {
    if (ev.target === this.dlg().nativeElement) this.collapse();
  }

  onScroll() {
    const body = this.host().nativeElement.parentElement;
    if (!body) return;
    const top = body.getBoundingClientRect().top;
    const canvases = this.canvases();
    let current = 1;
    for (const c of canvases) if (c.getBoundingClientRect().top - top < body.clientHeight / 2) current = +(c.dataset['page'] ?? 1);
    this.page.set(current);
  }

  private applyZoom(z: number) {
    this.zoomPct.set(z);
    const w = this.baseWidth * (z / 100);
    for (const c of this.canvases()) {
      c.style.width = `${w}px`;
      c.style.height = 'auto';
    }
  }

  private measureBase(): number {
    const body = this.host().nativeElement.parentElement;
    if (!body) return Math.max(this.host().nativeElement.clientWidth, 200);
    const cs = getComputedStyle(body);
    const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    return Math.max(body.clientWidth - pad, 200);
  }

  private schedulePaint() {
    clearTimeout(this.zoomTimer);
    this.zoomTimer = window.setTimeout(() => void this.paint(), 250);
  }

  private afterLayout(fn: () => void) {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }

  private canvases(): HTMLCanvasElement[] {
    return Array.from(this.host().nativeElement.querySelectorAll('canvas.pdfpage'));
  }

  private async paint() {
    const pdf = this.pdf;
    if (!pdf || !this.browser) return;
    const gen = ++this.paintGen;
    if (!this.baseWidth) this.baseWidth = this.measureBase();
    const cssWidth = this.baseWidth * (this.zoomPct() / 100);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const host = this.host().nativeElement;
    const body = host.parentElement;
    const sl = body && body.scrollWidth ? body.scrollLeft / body.scrollWidth : 0;
    const st = body && body.scrollHeight ? body.scrollTop / body.scrollHeight : 0;
    for (const c of this.canvases()) c.remove();
    for (let i = 1; i <= pdf.numPages; i++) {
      if (gen !== this.paintGen) return;
      const p = await pdf.getPage(i);
      if (gen !== this.paintGen) return;
      const base = p.getViewport({ scale: 1 });
      const vp = p.getViewport({ scale: (cssWidth / base.width) * dpr });
      const canvas = document.createElement('canvas');
      canvas.className = 'pdfpage';
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      canvas.dataset['page'] = String(i);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = 'auto';
      host.appendChild(canvas);
      await p.render({ canvas, viewport: vp }).promise;
    }
    if (gen !== this.paintGen || !body) return;
    body.scrollLeft = sl * body.scrollWidth;
    body.scrollTop = st * body.scrollHeight;
  }
}
