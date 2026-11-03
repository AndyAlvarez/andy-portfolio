import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EDUCATION, JOBS, SKILLS } from '../../data/resume';
import { PROFILE } from '../../data/profile';
import { scrollToSection } from '../../scroll';

/**
 * "02 Experience · Resume": timeline + skills on the left, a resume preview on the right.
 * The preview is rendered HTML (not the PDF) so the phone number in the PDF is never published,
 * and there is deliberately no download / save button.
 */
@Component({
  selector: 'app-resume',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class Resume {
  readonly jobs = JOBS;
  readonly edu = EDUCATION;
  readonly skills = SKILLS;
  readonly p = PROFILE;
  readonly open = signal(false);

  toggle() {
    const wasOpen = this.open();
    this.open.set(!wasOpen);
    if (wasOpen) scrollToSection('resume');
  }
}
