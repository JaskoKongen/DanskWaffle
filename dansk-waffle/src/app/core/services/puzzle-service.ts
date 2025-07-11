// src/app/core/services/puzzle.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puzzle } from '../models/puzzle-model';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  private http = inject(HttpClient);
  private apiUrl = 'api/puzzle'; // Opdateret base URL

  // Henter dagens puslespil (cached på serveren)
  getDailyPuzzle(): Observable<Puzzle> {
    return this.http.get<Puzzle>(`${this.apiUrl}/daily`);
  }

  // Henter et helt nyt, tilfældigt puslespil
  getNewPuzzle(): Observable<Puzzle> {
    return this.http.get<Puzzle>(`${this.apiUrl}/random`);
  }
}
