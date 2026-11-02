import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Document-viewer chrome (title, page counter, zoom). Deliberately has no download/print buttons. */
@Component({
  selector: 'app-viewer-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <span class="name">▤ {{ name() }}</span>
      <span class="page">{{ pageLabel() }}</span>
      @if (zoomable()) {
        <span class="zoom">
          <button type="button" (click)="zoom.emit(-1)" aria-label="Zoom out">−</button>
          {{ zoomPct() }}%
          <button type="button" (click)="zoom.emit(1)" aria-label="Zoom in">+</button>
        </span>
      } @else { <span class="zoom">{{ zoomPct() }}%</span> }
    </div>
    <div class="body" (contextmenu)="$event.preventDefault()"><ng-content /></div>
  `,
  styleUrl: './viewer-frame.scss',
})
export class ViewerFrame {
  readonly name = input.required<string>();
  readonly pageLabel = input('1 / 1');
  readonly zoomPct = input(100);
  readonly zoomable = input(false);
  readonly zoom = output<number>();
}
