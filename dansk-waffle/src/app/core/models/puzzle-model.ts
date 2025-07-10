export interface SolutionWord {
  word: string;
  orientation: 'horizontal' | 'vertical';
  row?: number;
  col?: number;
}

export interface Puzzle {
  solutionWords: SolutionWord[];
  shuffledLayout: (string | null)[][];
}
