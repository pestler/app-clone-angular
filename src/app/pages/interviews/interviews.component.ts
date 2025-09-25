import { Component } from '@angular/core';
import { InterviewMentorCardComponent } from '../../shared/components/cards/interview-card/interview-mentor-card/interview-mentor-card.component';
import { InterviewStudentCardComponent } from '../../shared/components/cards/interview-card/interview-student-card/interview-student-card.component';

@Component({
  selector: 'app-interviews',
  imports: [InterviewMentorCardComponent, InterviewStudentCardComponent],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.scss',
})
export class InterviewsComponent {
  role = 'mentor';
}
