// Fil: ./app/features/daily-waffle/daily-waffle.ts
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Nødvendig for ngIf etc.

import { PuzzleService } from '../../core/services/puzzle-service';
import { WaffleGrid } from '../waffle-grid/waffle-grid';

@Component({
  selector: 'app-daily-waffle',
  standalone: true,
  imports: [CommonModule, WaffleGrid],
  templateUrl: './daily-waffle.html'
})
export class DailyWaffleComponent {
  private puzzleService = inject(PuzzleService);
  private router = inject(Router);

  public puzzle = toSignal(this.puzzleService.getDailyPuzzle());
  public showAlreadySolvedPopup = signal(false);

  private readonly storageKey = 'dailyWaffleSolvedDate';

  constructor() {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const solvedDate = localStorage.getItem(this.storageKey);

    if (solvedDate === today) {
      this.showAlreadySolvedPopup.set(true);
    }
  }

  handlePuzzleWon(): void {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(this.storageKey, today);
  }

  navigateToFreePlay(): void {
    this.router.navigate(['/free-play']);
  }
}
