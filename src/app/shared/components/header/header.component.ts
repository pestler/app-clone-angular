import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { ThemeMenuComponent } from './theme-menu/theme-menu.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    UserMenuComponent,
    ThemeMenuComponent,
    MainNavComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
