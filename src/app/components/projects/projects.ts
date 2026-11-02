import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS } from '../../data/projects';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="projects" class="sec">
      <h2 class="sec-title"><span>02</span> PROJECTS</h2>
      <div class="grid">
        @for (p of projects; track p.title) {
          <article class="card panel">
            <div class="img">
              @if (p.image) { <img [src]="p.image" [class.inv]="p.invert" alt="" loading="lazy" /> }
              @else { <div class="ph"><div>▶</div><span>{{ p.clipPlaceholder }}</span></div> }
            </div>
            <h4>{{ p.title }}</h4>
            <p>{{ p.text }}</p>
            <div class="k">{{ p.stack }}</div>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .card { overflow: hidden; }
    .img { height: 150px; overflow: hidden; background: #000; }
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
    img.inv { filter: invert(1) hue-rotate(180deg); }
    .ph { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
      background: repeating-linear-gradient(0deg, #0b0d14 0 2px, #06070b 2px 4px); color: var(--cyan); font-family: var(--f-vfd); font-size: 15px; }
    .ph div { font-size: 30px; }
    h4, p, .k { padding: 0 14px; }
    h4 { margin-top: 12px; font-size: 15px; color: #fff; font-family: var(--f-display); }
    p { font-size: 12.5px; line-height: 1.45; margin-top: 4px; }
    .k { font-size: 11px; margin: 8px 0 14px; color: var(--cyan); }
    @media (max-width: 1100px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .img { height: 180px; } p { font-size: 13.5px; } }
  `,
})
export class Projects {
  readonly projects = PROJECTS;
}
