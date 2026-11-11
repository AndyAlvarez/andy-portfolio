import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { FEATURED, FeaturedCard, PCM_STATS, WPT_PAPER_CARD } from '../../data/home';
import { videosFor } from '../../data/videos';
import { IEEE_PAPER, PCM_MAP_LOOP, PCM_PHOTOS, PCM_ROUTE_LOOP, SUMO_CARD_CLIP, WPT_CARD_CLIP, WPT_MISALIGNMENT_PHOTO } from '../../data/media';
import { YtEmbed } from '../../shared/yt-embed/yt-embed';
import { InlineVideo } from '../../shared/inline-video/inline-video';
import { PdfViewer } from '../../shared/pdf-viewer/pdf-viewer';
import { DbDiagram } from '../db-diagram/db-diagram';
import { LoopClip } from '../../shared/loop-clip/loop-clip';
import { ReactionGame } from '../reaction-game/reaction-game';

type LightboxMedia = {
  kind: 'image' | 'video';
  src: string;
  poster?: string;
  alt: string;
  title: string;
};

/** Split body copy so "C++" can be wrapped in a nowrap span without innerHTML. */
export function bodyParts(body: string): { text: string; nw: boolean }[] {
  return body.split(/(C\+\+)/g).filter((part) => part.length > 0).map((text) => ({ text, nw: text === 'C++' }));
}

/** Work: PCM as a wide card on top (with the 200 ms reaction game), then a 2×2 grid (stacks on mobile). Copy lives in data/home.ts. */
@Component({
  selector: 'app-featured',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [YtEmbed, InlineVideo, PdfViewer, DbDiagram, LoopClip, ReactionGame],
  templateUrl: './featured.html',
  styleUrl: './featured.scss',
})
export class Featured {
  readonly cards: FeaturedCard[] = FEATURED;
  readonly bodyParts = bodyParts;
  readonly pcmVideo = videosFor('pcm')[0];
  readonly clip = WPT_CARD_CLIP;
  readonly sumoClip = SUMO_CARD_CLIP;
  readonly paper = IEEE_PAPER;
  readonly paperCard = WPT_PAPER_CARD;
  readonly misalign = WPT_MISALIGNMENT_PHOTO;
  readonly routeLoop = PCM_ROUTE_LOOP;
  readonly mapLoop = PCM_MAP_LOOP;
  readonly pcmPhotos = PCM_PHOTOS;
  readonly pcmStats = PCM_STATS;
  readonly clipPlaying = signal(false);
  /** Photo or silent loop shown in the popup; the full-size file only loads while open. */
  readonly media = signal<LightboxMedia>({ kind: 'image', src: '', alt: '', title: '' });
  readonly mediaOpen = signal(false);
  /** The paper viewer is only created while the dialog is open. */
  readonly paperOpen = signal(false);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private readonly photoDialog = viewChild.required<ElementRef<HTMLDialogElement>>('photoDlg');

  openLabPhoto() {
    this.openPhoto(this.misalign.src, this.misalign.alt, 'Lab test: serial monitor, 1.53% misalignment');
  }

  openPhoto(src: string, alt: string, title: string) {
    this.openMedia({ kind: 'image', src, alt, title });
  }

  openClip(clip: { src: string; poster: string; caption: string; alt?: string }) {
    this.openMedia({
      kind: 'video',
      src: clip.src,
      poster: clip.poster,
      alt: clip.alt ?? clip.caption,
      title: clip.caption,
    });
  }

  closePhoto() {
    this.photoDialog().nativeElement.close();
  }

  onPhotoClose() {
    this.mediaOpen.set(false);
  }

  onPhotoClick(ev: MouseEvent) {
    if (ev.target === this.photoDialog().nativeElement) this.closePhoto();
  }

  /** Muted autoplay once the lightbox video is in the DOM (dialog opens on click, so this stays browser-only). */
  playLightbox(ev: Event) {
    const el = ev.target as HTMLVideoElement;
    el.muted = true;
    el.play().catch(() => {});
  }

  openPaper() {
    this.paperOpen.set(true);
    this.dialog().nativeElement.showModal();
  }

  closePaper() {
    this.dialog().nativeElement.close();
  }

  onDialogClose() {
    this.paperOpen.set(false);
  }

  /** Click on the dimmed backdrop closes the dialog. */
  onDialogClick(ev: MouseEvent) {
    if (ev.target === this.dialog().nativeElement) this.closePaper();
  }

  private openMedia(media: LightboxMedia) {
    this.media.set(media);
    this.mediaOpen.set(true);
    this.photoDialog().nativeElement.showModal();
  }
}
