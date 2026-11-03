import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { FEATURED, FeaturedCard, WPT_PAPER_CARD } from '../../data/home';
import { videosFor } from '../../data/videos';
import { IEEE_PAPER, WPT_CARD_CLIP, WPT_MISALIGNMENT_PHOTO } from '../../data/media';
import { YtEmbed } from '../../shared/yt-embed/yt-embed';
import { InlineVideo } from '../../shared/inline-video/inline-video';
import { PdfViewer } from '../../shared/pdf-viewer/pdf-viewer';
import { DbDiagram } from '../db-diagram/db-diagram';

/** "01 Featured projects": four cards in a 2×2 grid. Copy lives in data/home.ts. */
@Component({
  selector: 'app-featured',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [YtEmbed, InlineVideo, PdfViewer, DbDiagram],
  templateUrl: './featured.html',
  styleUrl: './featured.scss',
})
export class Featured {
  readonly cards: FeaturedCard[] = FEATURED;
  readonly pcmVideo = videosFor('pcm')[0];
  readonly clip = WPT_CARD_CLIP;
  readonly paper = IEEE_PAPER;
  readonly paperCard = WPT_PAPER_CARD;
  readonly misalign = WPT_MISALIGNMENT_PHOTO;
  /** The card shows the misalignment photo until the visitor asks for the robot clip. */
  readonly showClip = signal(false);
  readonly clipPlaying = signal(false);
  /** The paper viewer is only created while the dialog is open. */
  readonly paperOpen = signal(false);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

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
