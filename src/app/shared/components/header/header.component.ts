import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, UserMenuComponent, MainNavComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  curTitle = '';
  courseTitle = '';
  curQueryParams: Record<string, string | null> = {};

  ngOnInit() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.updateHeaderData();
    });
    this.updateHeaderData();
  }

  private updateHeaderData() {
    let route = this.route.firstChild;
    while (route?.firstChild) {
      route = route.firstChild;
    }

    this.curTitle = route?.snapshot.data['title'] ?? '';
    this.curQueryParams = route?.snapshot.queryParams || {};

    const course = this.curQueryParams['course'];
    const isHomePage = this.router.url === '/' || this.router.url.startsWith('/?');

    this.courseTitle = !isHomePage && course ? course : '';
  }
}
