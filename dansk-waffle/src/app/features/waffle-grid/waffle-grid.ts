// Fil: ./app/features/waffle-grid/waffle-grid.ts
import { Component, computed, effect, inject, signal, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDropListGroup, CdkDragDrop, CdkDragPlaceholder, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Puzzle } from '../../core/models/puzzle-model'; // Importer Puzzle type

export type TileStatus = 'correct' | 'present' | 'absent';
export type GameState = 'playing' | 'won' | 'lost';

@Component({
  selector: 'app-waffle-grid',
  standalone: true,
  imports: [ CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder],
  templateUrl: './waffle-grid.html',
  styleUrl: './waffle-grid.scss'
})
export class WaffleGrid implements OnChanges {
  // ÆNDRING: Modtager nu puslespil som Input fra en forælder-komponent.
  @Input({ required: true }) puzzle!: Puzzle;
  // ÆNDRING: Udsender en hændelse, når spillet er vundet, med stjerne-rating som værdi.
  @Output() puzzleWon = new EventEmitter<number>();

  // FJERNEDE de linjer, der selv hentede data fra PuzzleService.

  public layout = signal<(string | null)[][]>([]);
  public swapsRemaining = signal(15);
  public gameState = signal<GameState>('playing');
  public dragStartCoords = signal<{row: number, col: number} | null>(null);

  // ngOnChanges fanger ændringer i @Input-properties, f.eks. når et nyt puslespil ankommer.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['puzzle'] && this.puzzle) {
      this.resetGame();
    }
  }

  // Computeds forbliver de samme...
  public starRating = computed(() => {
    if (this.gameState() !== 'won') return 0;
    const swapsUsed = 15 - this.swapsRemaining();
    if (swapsUsed <= 10) return 5;
    if (swapsUsed === 11) return 4;
    if (swapsUsed === 12) return 3;
    if (swapsUsed === 13) return 2;
    return 1;
  });

  public stars = computed(() => Array(this.starRating()).fill(0));

  public tileStatuses = computed(() => {
    // ÆNDRING: Bruger this.puzzle direkte i stedet for et signal
    const p = this.puzzle;
    const currentLayout = this.layout();
    if (!p || currentLayout.length === 0) return [];
    const statuses: TileStatus[][] = Array(5).fill(null).map(() => Array(5).fill('absent'));
    const priority: Record<TileStatus, number> = { correct: 3, present: 2, absent: 1 };
    for (const solutionInfo of p.solutionWords) {
      const isHorizontal = solutionInfo.orientation === 'horizontal';
      const wordIndex = isHorizontal ? solutionInfo.row! : solutionInfo.col!;
      const userGuessArr: (string | null)[] = Array(5).fill(null).map((_, i) => isHorizontal ? currentLayout[wordIndex][i] : currentLayout[i][wordIndex]);
      if (userGuessArr.includes(null)) continue;
      const guess = userGuessArr as string[];
      const solution = solutionInfo.word.split('');
      const tempWordStatus: TileStatus[] = Array(5).fill('absent');
      const solutionCopy = [...solution];
      for (let i = 0; i < 5; i++) {
        if (guess[i] === solutionCopy[i]) {
          tempWordStatus[i] = 'correct';
          solutionCopy[i] = '$USED$';
        }
      }
      for (let i = 0; i < 5; i++) {
        if (tempWordStatus[i] !== 'correct') {
          const letterIndexInSolution = solutionCopy.indexOf(guess[i]);
          if (letterIndexInSolution !== -1) {
            tempWordStatus[i] = 'present';
            solutionCopy[letterIndexInSolution] = '$USED$';
          }
        }
      }
      for (let i = 0; i < 5; i++) {
        const r = isHorizontal ? wordIndex : i;
        const c = isHorizontal ? i : wordIndex;
        if (priority[tempWordStatus[i]] > priority[statuses[r][c]]) {
          statuses[r][c] = tempWordStatus[i];
        }
      }
    }
    return statuses;
  });

  // constructor() er nu tom. effect() er fjernet.

  onDragStarted(event: CdkDragStart): void {
    const [row, col] = event.source.dropContainer.data as number[];
    this.dragStartCoords.set({ row, col });
  }

  onDragEnded(): void {
    this.dragStartCoords.set(null);
  }

  isOriginCell(row: number, col: number): boolean {
    const coords = this.dragStartCoords();
    return !!coords && coords.row === row && coords.col === col;
  }

  public isDropAllowed = (drag: CdkDrag, drop: CdkDropList<number[]>) => {
    if (this.gameState() !== 'playing') return false;
    const [row, col] = drop.data;
    if ((row % 2 !== 0) && (col % 2 !== 0)) return false;
    const isLocked = this.tileStatuses()[row][col] === 'correct';
    return !isLocked;
  };

  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) return;
    const fromCoords = event.previousContainer.data;
    const toCoords = event.container.data;
    const newLayout = this.layout().map(row => [...row]);
    const fromValue = newLayout[fromCoords[0]][fromCoords[1]];
    const toValue = newLayout[toCoords[0]][toCoords[1]];
    newLayout[fromCoords[0]][fromCoords[1]] = toValue;
    newLayout[toCoords[0]][toCoords[1]] = fromValue;
    this.layout.set(newLayout);
    this.swapsRemaining.update(s => s - 1);
    this.checkGameState();
  }

  private checkGameState(): void {
    // ÆNDRING: Bruger this.puzzle
    const p = this.puzzle;
    if (!p) return;
    const initialLayout = p.shuffledLayout;
    const currentStatuses = this.tileStatuses();
    let isWon = true;

    for (let r = 0; r < initialLayout.length; r++) {
      for (let c = 0; c < initialLayout[r].length; c++) {
        if (initialLayout[r][c] !== null) {
          if (currentStatuses[r][c] !== 'correct') {
            isWon = false;
            break;
          }
        }
      }
      if (!isWon) {
        break;
      }
    }

    if (isWon) {
      this.gameState.set('won');
      this.puzzleWon.emit(this.starRating()); // <-- NYT: Udsend hændelse!
      return;
    }

    if (this.swapsRemaining() <= 0) {
      this.gameState.set('lost');
    }
  }

  public resetGame(): void {
    // ÆNDRING: Bruger this.puzzle
    if (this.puzzle) {
      this.layout.set(this.puzzle.shuffledLayout.map(row => [...row]));
    }
    this.swapsRemaining.set(15);
    this.gameState.set('playing');
  }
}
