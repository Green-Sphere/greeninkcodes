import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'GREENINK';
  tagline = 'Simplify your QR';

  // In your app.component.ts
  ngOnInit() {
    const dark = window.matchMedia('(prefers-color-scheme: dark)');
    if (dark.matches) {
      document.body.classList.add('dark-mode');
    }
    dark.addEventListener('change', (e) => {
      document.body.classList.toggle('dark-mode', e.matches);
    });
  }
}
