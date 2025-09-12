import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-theme-menu',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './theme-menu.component.html',
  styleUrl: './theme-menu.component.scss',
})
export class ThemeMenuComponent {
  onClick(theme: string) {
    console.log(`${theme} theme`);
  }
}
