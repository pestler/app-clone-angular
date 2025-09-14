import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { mockInterviewInfo } from '../../../core/mocks/interview.mock';

@Component({
  selector: 'app-interview-card',
  imports: [DatePipe, MatIconModule],
  templateUrl: './interview-card.component.html',
  styleUrl: './interview-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewCardComponent {
  interviewInfo = mockInterviewInfo;
}
