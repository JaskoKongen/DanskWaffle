import { Routes } from '@angular/router';
import { DailyWaffleComponent } from './features/daily-waffle/daily-waffle';
import { FreePlayComponent } from './features/free-play/free-play';

export const routes: Routes = [
  // Omdiriger roden til dagens waffle som standard
  { path: '', redirectTo: 'daily', pathMatch: 'full' },

  // Ruten til dagens waffle
  { path: 'daily', component: DailyWaffleComponent, title: 'Dagens Waffle' },

  // Ruten til fri leg
  { path: 'free-play', component: FreePlayComponent, title: 'Fri Leg - Waffle' },

  // Wildcard rute, hvis en ukendt URL indtastes
  { path: '**', redirectTo: 'daily' }
];
