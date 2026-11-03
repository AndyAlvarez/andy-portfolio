import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Static, illustrative diagram for the "Core API, Database & Telemetry Pipeline" card.
 * Entities are generalized on purpose: no real table names, hosts or customer names.
 * Scrolls horizontally on phones so the labels stay readable.
 */
@Component({
  selector: 'app-db-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './db-diagram.html',
  styles: `
    :host { display: block; width: 100%; height: 100%; }
    .dbsvg { display: block; width: 100%; height: 100%; }
    @media (max-width: 600px) {
      :host { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .dbsvg { width: 620px; height: 291px; }
    }
  `,
})
export class DbDiagram {}
