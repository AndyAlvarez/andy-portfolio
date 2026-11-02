import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE } from '../../data/profile';
import { PCM_SUMMARY, PCM_TAGS } from '../../data/cases';
import { videosFor } from '../../data/videos';
import { YtEmbed } from '../../shared/yt-embed/yt-embed';
import { scrollToSection } from '../../scroll';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [YtEmbed],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly p = PROFILE;
  readonly tags = PCM_TAGS;
  readonly summary = PCM_SUMMARY;
  readonly heroVideo = videosFor('hero')[0];
  readonly eq = [30, 55, 80, 45, 95, 70, 40, 85, 60, 35, 75, 50, 90, 65, 30, 55, 80, 45, 70, 38, 88, 52, 66, 42];
  readonly go = scrollToSection;
}
