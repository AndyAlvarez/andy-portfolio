import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Featured } from './components/featured/featured';
import { Resume } from './components/resume/resume';
import { Contact } from './components/contact/contact';

/** Home page: hero → work → experience/resume → contact. */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Header, Hero, Featured, Resume, Contact],
  templateUrl: './app.html',
})
export class App {}
