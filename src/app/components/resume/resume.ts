import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RESUME_PDF } from '../../data/media';
import { PdfViewer } from '../../shared/pdf-viewer/pdf-viewer';

/**
 * "02 Experience · Resume": Andy's own resume PDF in the inline pdf.js viewer (canvas only, no download / print).
 * The served copy has the phone number redacted out of the file itself.
 */
@Component({
  selector: 'app-resume',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PdfViewer],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class Resume {
  readonly pdf = RESUME_PDF;
}
