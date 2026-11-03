import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { FEATURED, FeaturedCard, SHOW_CASE_STUDY_LINKS, WPT_PAPER_CARD } from '../../data/home';
import { videosFor } from '../../data/videos';
import { IEEE_PAPER, SUMO_CARD_CLIP, WPT_CARD_CLIP, WPT_MISALIGNMENT_PHOTO } from '../../data/media';
import { YtEmbed } from '../../shared/yt-embed/yt-embed';
import { InlineVideo } from '../../shared/inline-video/inline-video';
import { PdfViewer } from '../../shared/pdf-viewer/pdf-viewer';
import { DbDiagram } from '../db-diagram/db-diagram';

/** "01 Featured projects": PCM as a wide card on top, then a 2×2 grid (stacks on mobile). Copy lives in data/home.ts. */
@Component({
  selector: 'app-featured',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [YtEmbed, InlineVideo, PdfViewer, DbDiagram],
  templateUrl: './featured.html',
  styleUrl: './featured.scss',
})
export class Featured {
  readonly cards: FeaturedCard[] = FEATURED;
  readonly showCaseLinks = SHOW_CASE_STUDY_LINKS;
  readonly pcmVideo = videosFor('pcm')[0];
  readonly clip = WPT_CARD_CLIP;
  readonly sumoClip = SUMO_CARD_CLIP;
  readonly paper = IEEE_PAPER;
  readonly paperCard = WPT_PAPER_CARD;
  readonly misalign = WPT_MISALIGNMENT_PHOTO;
  readonly clipPlaying = signal(false);
  readonly sumoPlaying = signal(false);
  /** The paper viewer is only created while the dialog is open. */
  readonly paperOpen = signal(false);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private readonly photoDialog = viewChild.required<ElementRef<HTMLDialogElement>>('photoDlg');

  openPhoto() {
    this.photoDialog().nativeElement.showModal();
  }

  closePhoto() {
    this.photoDialog().nativeElement.close();
  }

  onPhotoClick(ev: MouseEvent) {
    if (ev.target === this.photoDialog().nativeElement) this.closePhoto();
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
}
