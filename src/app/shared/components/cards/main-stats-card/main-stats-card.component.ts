import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input() isActive = false;
  @Input() totalScore = 0;
  @Input() position = 0;
  @Input() maxCourseScore = 0;
  @Input() totalStudentsCount = 0;

  readonly DEFAULT_POSITION = 999999;
}
