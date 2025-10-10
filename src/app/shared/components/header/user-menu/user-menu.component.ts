import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MenuItem, menuItems } from './user-menu.data';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent implements OnInit {
  @Input() matMenuItems: MenuItem[] = menuItems;
  private authService = inject(AuthService);

  private route = inject(ActivatedRoute);
  curQueryParams: Record<string, string | null> = {};

  handleAction(action?: string): void {
    if (action === 'logout') {
      this.authService.signOut();
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.curQueryParams = params;
    });
  }
}
