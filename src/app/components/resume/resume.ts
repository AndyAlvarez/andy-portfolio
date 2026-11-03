import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EDUCATION, JOBS, SKILLS } from '../../data/resume';
import { RESUME_PDF } from '../../data/media';
import { PdfViewer } from '../../shared/pdf-viewer/pdf-viewer';
import { scrollToSection } from '../../scroll';

/**
 * Experience: timeline + skills on the left, my resume PDF on the right in the inline pdf.js
 * viewer (canvas only, no download / print). The served copy has the phone number removed from the file itself.
 */
@Component({
  selector: 'app-resume',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PdfViewer],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class Resume {
  readonly jobs = JOBS;
  readonly edu = EDUCATION;
  readonly skills = SKILLS;
  readonly pdf = RESUME_PDF;

  showPdf(ev: Event) {
    ev.preventDefault();
    scrollToSection('resume-doc');
  }
}
