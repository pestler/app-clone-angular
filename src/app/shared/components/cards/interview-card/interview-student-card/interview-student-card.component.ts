import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InterviewInfo } from '../../../../../core/models/interview.model';
import { InterviewCardBaseComponent } from '../interview-card-base/interview-card-base.component';

@Component({
  selector: 'app-interview-student-card',
  imports: [MatIconModule, InterviewCardBaseComponent],
  templateUrl: './interview-student-card.component.html',
  styleUrl: './interview-student-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewStudentCardComponent {
  @Input({ required: true }) interviewInfo!: InterviewInfo;
}
