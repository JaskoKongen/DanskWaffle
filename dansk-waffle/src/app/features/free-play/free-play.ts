// Fil: ./app/features/free-play/free-play.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuzzleService } from '../../core/services/puzzle-service';
import { WaffleGrid } from '../waffle-grid/waffle-grid';
import { Puzzle } from '../../core/models/puzzle-model';

@Component({
  selector: 'app-free-play',
  standalone: true,
  imports: [CommonModule, WaffleGrid],
  templateUrl: './free-play.html'
})
export class FreePlayComponent {
  private puzzleService = inject(PuzzleService);
  public puzzle = signal<Puzzle | null>(null);

  constructor() {
    this.fetchNewPuzzle();
  }

  fetchNewPuzzle(): void {
    // Sæt til null for at vise loading-state kort
    this.puzzle.set(null);
    this.puzzleService.getNewPuzzle().subscribe(p => {
      this.puzzle.set(p);
    });
  }
}
