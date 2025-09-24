import { Component, Input } from '@angular/core';
import { Mentor } from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-mentor-card',
  imports: [],
  templateUrl: './mentor-card.component.html',
  styleUrl: './mentor-card.component.scss',
})
export class MentorCardComponent {
  @Input() mentor?: Mentor;
}
