import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EDUCATION, JOBS, SKILLS } from '../../data/resume';
import { PROFILE } from '../../data/profile';
import { ViewerFrame } from '../../shared/viewer-frame/viewer-frame';

/**
 * Resume: timeline + skills on the left, an inline "document" on the right.
 * The document is rendered HTML (not the PDF) so the phone number in the PDF is never published.
 */
@Component({
  selector: 'app-resume',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewerFrame],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class Resume {
  readonly jobs = JOBS;
  readonly edu = EDUCATION;
  readonly skills = SKILLS;
  readonly p = PROFILE;
}
