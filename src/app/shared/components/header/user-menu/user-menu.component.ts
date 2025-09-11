import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MenuItem, menuItems } from './user-menu.data';

@Component({
  selector: 'app-user-menu',
  imports: [MatMenuModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
  @Input() matMenuItems: MenuItem[] = menuItems;
}
