import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PROFILE } from '../../data/profile';
import { NBC_FEATURE, WHAT_I_DO } from '../../data/home';
import { videosFor } from '../../data/videos';
import { YtEmbed } from '../../shared/yt-embed/yt-embed';
import { Icon } from '../../shared/icon/icon';
import { EqBand } from '../eq-band/eq-band';
import { scrollToSection } from '../../scroll';
import { ThemeService } from '../../shared/theme/theme.service';

/** Hero: who I am (name, lede, location + degrees), the NBC feature, the EQ band and "What I do". */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [YtEmbed, Icon, EqBand],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly p = PROFILE;
  readonly nbc = NBC_FEATURE;
  readonly what = WHAT_I_DO;
  readonly video = videosFor('hero')[0];
  readonly go = scrollToSection;
  readonly theme = inject(ThemeService);
}
