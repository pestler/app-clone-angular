import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { mockStudentStats } from '../../../core/mocks/student-stats.mock';

@Component({
  selector: 'app-student-stats-card',
  imports: [],
  templateUrl: './student-stats-card.component.html',
  styleUrl: './student-stats-card.component.scss',
})
export class StudentStatsCardComponent {
  studentStats = mockStudentStats;
  router = inject(Router);
}
