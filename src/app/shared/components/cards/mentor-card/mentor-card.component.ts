import { Component } from '@angular/core';
import { mockMentorInfo } from '../../../../core/mocks/student-stats.mock';

@Component({
  selector: 'app-mentor-card',
  imports: [],
  templateUrl: './mentor-card.component.html',
  styleUrl: './mentor-card.component.scss',
})
export class MentorCardComponent {
  mentorInfo = mockMentorInfo;
}
