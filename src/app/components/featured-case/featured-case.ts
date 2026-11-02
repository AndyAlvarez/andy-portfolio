import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FeaturedCase as CaseData } from '../../data/cases';

/** One case study: projected media on one side, copy on the other. */
@Component({
  selector: 'app-featured-case',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.rev]': 'data().reversed' },
  template: `
    <div class="media"><ng-content select="[media]" /></div>
    <div class="text">
      <div class="kick">{{ data().kicker }}</div>
      <h3>{{ data().title }}</h3>
      <ul>@for (b of data().bullets; track $index) { <li [innerHTML]="b"></li> }</ul>
      @if (data().support?.length) {
        <div class="supp">
          @for (s of data().support; track s.title) { <div class="panel"><b>{{ s.title }}</b><small>{{ s.text }}</small></div> }
        </div>
      }
      @if (data().seal) { <div class="seal">◆ {{ data().seal }}</div> }
      <ng-content select="[credit]" />
    </div>
  `,
  styleUrl: './featured-case.scss',
})
export class FeaturedCase {
  readonly data = input.required<CaseData>();
}
