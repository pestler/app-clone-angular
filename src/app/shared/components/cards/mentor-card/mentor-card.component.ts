import { Component, Input } from '@angular/core';
import { mockMentorInfo } from '../../../../core/mocks/student-stats.mock';
import { Mentor } from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-mentor-card',
  imports: [],
  templateUrl: './mentor-card.component.html',
  styleUrl: './mentor-card.component.scss',
})
export class MentorCardComponent {
  mentorInfo = mockMentorInfo;
  @Input() mentor?: Mentor;
}
