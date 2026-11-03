import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconName, PROFILE } from '../../data/profile';
import { Icon } from '../../shared/icon/icon';
import { ThemeService } from '../../shared/theme/theme.service';

/** Contact: email, LinkedIn, GitHub and location only (no phone / street address). */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section id="contact" class="contact">
      @if (!theme.atomic()) {
        <h2 class="sec-title"><span class="st">Contact</span><i class="sr" aria-hidden="true"></i><i class="tk" aria-hidden="true"></i></h2>
      }
      <div class="cbox panel cut">
        <div>
          <h3 class="chrome">Let's build something!</h3>
          <p class="lede">Email is the fastest way to reach me.</p>
        </div>
        <div class="clinks">
          @for (l of links; track l.tag) {
            <a [href]="l.href" [attr.target]="l.external ? '_blank' : null" [attr.rel]="l.external ? 'noopener' : null">
              <app-icon class="ico" [name]="l.icon" [size]="20" /><span>{{ l.text }}</span><b>{{ l.tag }}</b>
            </a>
          }
        </div>
      </div>
    </section>
    <footer class="fine"><span>© {{ year }} {{ p.name.first }} {{ p.name.last }} · {{ p.location }}</span></footer>
  `,
  styles: `
    .cbox { display: grid; align-items: center; }
    .clinks { display: grid; gap: 10px; }
    .clinks a { display: flex; align-items: center; gap: 14px; overflow-wrap: anywhere; }
    .clinks a span { flex: 1; }
    .fine { display: flex; justify-content: space-between; gap: 6px; }
    :host-context([data-ui='atomic']) {
      .contact { max-width: var(--max); margin: 64px auto 0; padding: 0 var(--pad) 56px; }
      .cbox { display: grid; grid-template-columns: 1.2fr 1fr; gap: 30px; align-items: center; padding: 34px 36px; }
      h3 { font-family: var(--f-display); font-size: 34px; font-weight: 900; line-height: 1.05; margin-bottom: 10px; }
      .lede { font-size: 16px; line-height: 1.55; color: #d5d9df; }
      .clinks { display: grid; gap: 10px; }
      .clinks a {
        display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: #05060a; border: 1px solid #1f51ff66;
        font-size: 15px; transition: border-color .15s, box-shadow .15s; overflow-wrap: anywhere;
      }
      .clinks a:hover, .clinks a:focus-visible { border-color: var(--cyan); box-shadow: 0 0 14px #1f51ff66; }
      .clinks .ico { color: var(--cyan); filter: drop-shadow(0 0 6px #00e5ff88); }
      .clinks a span { flex: 1; }
      .clinks b { font-family: var(--f-vfd); font-weight: 400; font-size: 18px; color: var(--cyan); letter-spacing: 2px; }
      .fine { max-width: var(--max); margin: 0 auto; padding: 18px var(--pad) 30px; border-top: 1px solid #c0c6cf1f; display: flex; justify-content: space-between; gap: 6px; font-size: 12px; color: #5d6a7d; }
      @media (max-width: 800px) {
        .cbox { grid-template-columns: 1fr; padding: 22px; }
        h3 { font-size: 26px; }
        .clinks a { font-size: 13.5px; padding: 12px 14px; }
        .clinks b { display: none; }
        .fine { flex-direction: column; }
      }
    }
    :host-context([data-ui='pro']) {
      .contact { max-width: var(--wrap); margin: 0 auto; padding: 76px var(--gut) 0; }
      .cbox { grid-template-columns: 1fr 1fr; gap: 32px; padding: 34px; border: 1px solid var(--line); border-radius: var(--r3); background: var(--surf); }
      h3 { font-family: var(--f-head); font-size: 34px; font-weight: 650; letter-spacing: -.025em; line-height: 1.1; margin-bottom: 10px; color: var(--tx); }
      .lede { font-size: 18.5px; line-height: 1.6; color: var(--tx2); }
      .clinks a { padding: 14px 16px; border: 1px solid var(--line2); border-radius: var(--r); font-size: 15px; color: var(--tx); transition: border-color .15s; }
      .clinks a:hover { border-color: var(--accent); }
      .clinks .ico { color: var(--accent-t); flex: none; }
      .clinks b { font: 400 11.5px var(--f-mono); text-transform: uppercase; letter-spacing: .06em; color: var(--mut); }
      .fine { max-width: var(--wrap); margin: 0 auto; padding: 40px var(--gut); font-size: 13px; color: var(--mut); }
      @media (max-width: 800px) {
        .contact { padding-top: 48px; }
        .cbox { grid-template-columns: 1fr; padding: 22px; }
        h3 { font-size: 26px; }
        .lede { font-size: 16.5px; }
        .clinks a { font-size: 14px; }
        .clinks b { display: none; }
        .fine { flex-direction: column; }
      }
    }
  `,
})
export class Contact {
  readonly p = PROFILE;
  readonly theme = inject(ThemeService);
  readonly year = new Date().getFullYear();
  readonly links: { icon: IconName; text: string; tag: string; href: string; external: boolean }[] = [
    { icon: 'mail', text: PROFILE.email, tag: 'EMAIL', href: `mailto:${PROFILE.email}`, external: false },
    { icon: 'linkedin', text: PROFILE.linkedin, tag: 'LINKEDIN', href: `https://www.${PROFILE.linkedin}/`, external: true },
    { icon: 'github', text: PROFILE.github, tag: 'GITHUB', href: `https://${PROFILE.github}`, external: true },
  ];
}
