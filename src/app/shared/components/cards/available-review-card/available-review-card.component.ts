import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { AvailableReview } from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-available-review-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './available-review-card.component.html',
  styleUrls: ['./available-review-card.component.scss'],
})
export class AvailableReviewCardComponent {
  @Input() availableReviews: AvailableReview[] = [];
  @Input() courseAlias = '';

  calculatePercent(item: AvailableReview): number {
    if (!item.checksCount) return 0;
    return (item.completedChecksCount / item.checksCount) * 100;
  }
}
