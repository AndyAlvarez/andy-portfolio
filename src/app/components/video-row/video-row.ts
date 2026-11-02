import { ChangeDetectionStrategy, Component } from '@angular/core';
import { videosFor } from '../../data/videos';
import { YtEmbed } from '../../shared/yt-embed/yt-embed';

@Component({
  selector: 'app-video-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [YtEmbed],
  template: `
    @if (videos.length) {
      <section id="media" class="sec">
        <h2 class="sec-title"><span>03</span> IN THE FIELD · GUIDENT VIDEOS</h2>
        <div class="row">@for (v of videos; track v.id) { <app-yt-embed [video]="v" /> }</div>
      </section>
    }
  `,
  styles: `
    .row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media (max-width: 1000px) { .row { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .row { grid-template-columns: 1fr; } }
  `,
})
export class VideoRow {
  readonly videos = videosFor('row');
}
