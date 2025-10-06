import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-stats-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatDividerModule],
  templateUrl: './main-stats-card.component.html',
  styleUrls: ['./main-stats-card.component.scss'],
})
export class MainStatsCardComponent {
  isActive = input(false);
  totalScore = input(0);
  position = input(0);
  maxCourseScore = input(0);
  totalStudentsCount = input(0);

  readonly DEFAULT_POSITION = 999999;
}
