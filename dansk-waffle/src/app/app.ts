import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- Importer RouterOutlet
import { NavBarComponent } from './features/navigation/navigation'; // <-- Importer NavBar

@Component({
  selector: 'app-root',
  standalone: true,
  // Opdater imports til at indeholde de nye komponenter
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
