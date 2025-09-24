import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ScoreData } from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-student-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-stats-card.component.html',
  styleUrl: './student-stats-card.component.scss',
})
export class StudentStatsCardComponent {
  @Input() studentData: ScoreData | null | undefined = null;
  @Input() isActive = false;
  @Input() completedTasksCount = 0;
  @Input() totalTasksCount = 0;
}
