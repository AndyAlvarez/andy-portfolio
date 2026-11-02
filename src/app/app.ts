import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { FeaturedCase } from './components/featured-case/featured-case';
import { Projects } from './components/projects/projects';
import { VideoRow } from './components/video-row/video-row';
import { Resume } from './components/resume/resume';
import { Contact } from './components/contact/contact';
import { YtEmbed } from './shared/yt-embed/yt-embed';
import { InlineVideo } from './shared/inline-video/inline-video';
import { PdfViewer } from './shared/pdf-viewer/pdf-viewer';
import { CASES } from './data/cases';
import { videosFor } from './data/videos';
import { IEEE_PAPER, PCM_PHOTO, WPT_CLIP } from './data/media';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Header, Hero, FeaturedCase, Projects, VideoRow, Resume, Contact, YtEmbed, InlineVideo, PdfViewer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly pcm = CASES[0];
  readonly wpt = CASES[1];
  readonly pcmVideos = videosFor('pcm');
  readonly photo = PCM_PHOTO;
  readonly clip = WPT_CLIP;
  readonly paper = IEEE_PAPER;
}
