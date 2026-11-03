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
    /* Pro look: same diagram, recoloured from the theme tokens; JetBrains Mono is wider than VT323, so sizes scale down. */
    :host-context([data-ui='pro']) {
      .dbsvg { font-family: var(--f-mono); }
      text[font-size='13'] { font-size: 9.5px; }
      text[font-size='14'] { font-size: 10px; }
      text[font-size='15'] { font-size: 10.5px; }
      text[font-size='16'] { font-size: 11px; font-weight: 600; }
      text[font-size='18'] { font-size: 12.5px; font-weight: 700; }
      [fill='#05060a'] { fill: var(--bg); }
      g[stroke='#1F51FF1c'] { stroke: var(--line); }
      [fill='#5d6a7d'], [fill='#6f8099'] { fill: var(--mut); }
      [fill='#0b1a0b'], [fill='#0a0f2a'], [fill='#0f1017'] { fill: var(--surf); }
      [stroke='#39FF14'], [stroke='#1F51FF'], [stroke='#C0C6CF66'], [stroke='#c0c6cf33'] { stroke: var(--line2); }
      [fill='#39FF14'], [fill='#9fb4ff'], [fill='#c9b3ff'] { fill: var(--tx2); }
      [fill='#04141a'], [fill='#140a2a'] { fill: var(--chip); }
      [stroke='#00E5FF'], [stroke='#B48CFF'], [stroke='#7B2CFF'] { stroke: var(--accent); }
      [fill='#00E5FF'] { fill: var(--accent-t); }
      [fill='#7B2CFF'] { fill: var(--accent); }
      text[fill='#fff'], [fill='#e6e9ee'] { fill: var(--tx); }
      text[fill='#fff'][font-size='13'] { fill: var(--onacc); }
      [fill='#ffcc00'] { fill: #B45309; }
    }
    :host-context([data-theme='dark']) [fill='#ffcc00'] { fill: #FBBF24; }
  `,
})
export class DbDiagram {}
