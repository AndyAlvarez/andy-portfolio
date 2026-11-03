import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconName, PROFILE } from '../../data/profile';
import { Icon } from '../../shared/icon/icon';

/** Contact: email, LinkedIn, GitHub and location only (no phone / street address). */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section id="contact" class="contact">
      <div class="cbox panel cut">
        <div>
          <h3 class="chrome">Let's build something real-time.</h3>
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
    <footer class="fine"><span>© {{ year }} {{ p.name.first }} {{ p.name.last }} · {{ p.location }}</span><span>Built with Angular</span></footer>
  `,
  styles: `
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
  `,
})
export class Contact {
  readonly p = PROFILE;
  readonly year = new Date().getFullYear();
  readonly links: { icon: IconName; text: string; tag: string; href: string; external: boolean }[] = [
    { icon: 'mail', text: PROFILE.email, tag: 'EMAIL', href: `mailto:${PROFILE.email}`, external: false },
    { icon: 'linkedin', text: PROFILE.linkedin, tag: 'LINKEDIN', href: `https://www.${PROFILE.linkedin}/`, external: true },
    { icon: 'github', text: PROFILE.github, tag: 'GITHUB', href: `https://${PROFILE.github}`, external: true },
  ];
}
