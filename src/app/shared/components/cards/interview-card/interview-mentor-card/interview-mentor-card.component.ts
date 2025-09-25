import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InterviewStateMentor, mockInterviewInfo } from '../../../../../core/mocks/interview.mock';
import { InterviewCardBaseComponent } from '../interview-card-base/interview-card-base.component';
import { NoInterviewCardComponent } from '../no-interview-card/no-interview-card.component';
import { RateDialogComponent } from './rate-dialog/rate-dialog.component';

@Component({
  selector: 'app-interview-mentor-card',
  imports: [NoInterviewCardComponent, MatIconModule, MatDialogModule, InterviewCardBaseComponent],
  templateUrl: './interview-mentor-card.component.html',
  styleUrl: './interview-mentor-card.component.scss',
})
export class InterviewMentorCardComponent {
  interviewInfo = mockInterviewInfo;
  private dialog = inject(MatDialog);

  interviewState = signal<InterviewStateMentor>({
    status: this.interviewInfo.status,
    rating: null,
  });

  openRatingDialog() {
    const dialogRef = this.dialog.open(RateDialogComponent, {
      width: '400px',
      data: { status: this.interviewState().status },
    });

    dialogRef.afterClosed().subscribe((result: number | undefined) => {
      if (result !== undefined) {
        this.interviewState.update((state) => ({
          ...state,
          status: 'Completed',
          rating: result,
        }));
      }
    });
  }
}
