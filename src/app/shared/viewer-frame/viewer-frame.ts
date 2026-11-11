import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Document-viewer chrome: title, page, zoom, fit width, expand, download and open. */
@Component({
  selector: 'app-viewer-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <span class="name">{{ name() }}</span>
      <span class="page">{{ pageLabel() }}</span>
      <div class="tools">
        @if (zoomable()) {
          <span class="zoom">
            <button type="button" class="ibtn" (click)="zoom.emit(-1)" aria-label="Zoom out">−</button>
            <b>{{ zoomPct() }}%</b>
            <button type="button" class="ibtn" (click)="zoom.emit(1)" aria-label="Zoom in">+</button>
          </span>
          <button type="button" class="ibtn" (click)="fit.emit()">Fit width</button>
        }
        @if (!expanded()) {
          <button type="button" class="ibtn" (click)="expand.emit()">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>
            Expand
          </button>
        }
        <a class="ibtn primary" [href]="href()" [attr.download]="name()">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 11l5 5 5-5M4 21h16"/></svg>
          Download
        </a>
        <a class="ibtn" [href]="href()" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5v14h14v-5M13 5h6v6M11 13l8-8"/></svg>
          Open
        </a>
        @if (expanded()) {
          <button type="button" class="ibtn" (click)="close.emit()">Close</button>
        }
      </div>
    </div>
    <div class="body"><ng-content /></div>
  `,
  styleUrl: './viewer-frame.scss',
})
export class ViewerFrame {
  readonly name = input.required<string>();
  readonly href = input.required<string>();
  readonly pageLabel = input('1 / 1');
  readonly zoomPct = input(100);
  readonly zoomable = input(false);
  readonly expanded = input(false);
  readonly zoom = output<number>();
  readonly fit = output<void>();
  readonly expand = output<void>();
  readonly close = output<void>();
}
