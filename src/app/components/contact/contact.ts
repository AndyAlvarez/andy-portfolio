import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE } from '../../data/profile';

/** Contact: email, LinkedIn, GitHub and location only (no phone / street address). */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer id="contact" class="sec foot">
      <div>
        <h2 class="sec-title plain"><span>05</span> CONTACT</h2>
        <p>{{ p.location }} · {{ p.availability }}</p>
      </div>
      <div class="links">
        <a class="hot" [href]="'mailto:' + p.email">✉ {{ p.email }}</a>
        <a [href]="'https://www.' + p.linkedin + '/'" target="_blank" rel="noopener">in {{ p.linkedin }}</a>
        <a [href]="'https://' + p.github" target="_blank" rel="noopener">⌥ {{ p.github }}</a>
      </div>
    </footer>
  `,
  styles: `
    .foot { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding-bottom: 50px; flex-wrap: wrap; }
    .sec-title.plain::after { display: none; }
    .links { display: flex; flex-wrap: wrap; gap: 16px; }
    .links a { padding: 12px 18px; font-size: 14px; border: 1px solid #c0c6cf55; background: linear-gradient(#1c1e27, #0f1017); transition: border-color .15s, box-shadow .15s; }
    .links a:hover, .links a.hot { border-color: var(--blue); box-shadow: 0 0 14px #1f51ff66; }
    @media (max-width: 600px) { .links { flex-direction: column; width: 100%; } .links a { text-align: center; } }
  `,
})
export class Contact {
  readonly p = PROFILE;
}
