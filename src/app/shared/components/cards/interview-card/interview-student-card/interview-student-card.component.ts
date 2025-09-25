import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { mockInterviewInfo } from '../../../../../core/mocks/interview.mock';
import { InterviewCardBaseComponent } from '../interview-card-base/interview-card-base.component';
import { NoInterviewCardComponent } from '../no-interview-card/no-interview-card.component';

@Component({
  selector: 'app-interview-student-card',
  imports: [MatIconModule, NoInterviewCardComponent, InterviewCardBaseComponent],
  templateUrl: './interview-student-card.component.html',
  styleUrl: './interview-student-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewStudentCardComponent {
  interviewInfo = mockInterviewInfo;
}
