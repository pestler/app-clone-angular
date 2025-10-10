import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InterviewInfo, InterviewStateMentor } from '../../../../../core/models/interview.model';
import { InterviewService } from '../../../../../core/services/interview.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { InterviewCardBaseComponent } from '../interview-card-base/interview-card-base.component';
import { RateDialogComponent } from './rate-dialog/rate-dialog.component';

@Component({
  selector: 'app-interview-mentor-card',
  imports: [MatIconModule, MatDialogModule, InterviewCardBaseComponent],
  templateUrl: './interview-mentor-card.component.html',
  styleUrl: './interview-mentor-card.component.scss',
})
export class InterviewMentorCardComponent implements OnChanges {
  @Input({ required: true }) interviewInfo!: InterviewInfo;
  private dialog = inject(MatDialog);
  private interviewService = inject(InterviewService);
  private notificationService = inject(NotificationService);

  interviewState = signal<InterviewStateMentor>({
    status: 'No Interview',
    rating: null,
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['interviewInfo'] && this.interviewInfo) {
      this.interviewState.set({
        status: this.interviewInfo.status,
        rating: this.interviewInfo.result,
      });
    }
  }

  openRatingDialog() {
    const dialogRef = this.dialog.open(RateDialogComponent, {
      width: '400px',
      data: { status: this.interviewState().status },
    });

    dialogRef.afterClosed().subscribe(async (result: number | undefined) => {
      if (result !== undefined) {
        const updatedData = {
          status: 'Completed' as const,
          result: result,
        };

        if (
          !this.interviewInfo.courseAlias ||
          !this.interviewInfo.studentId ||
          !this.interviewInfo.id
        ) {
          this.notificationService.showError(
            'Cannot update interview: course, student, or interview ID is missing.',
          );
          return;
        }

        try {
          await this.interviewService.updateInterview(
            this.interviewInfo.courseAlias,
            this.interviewInfo.studentId,
            this.interviewInfo.id,
            updatedData,
          );
          this.interviewState.update((state) => ({
            ...state,
            ...updatedData,
          }));
          this.notificationService.showSuccess('Interview rated successfully!');
        } catch (error) {
          console.error('Error updating interview:', error);
          this.notificationService.showError('Failed to rate interview.');
        }
      }
    });
  }
}
