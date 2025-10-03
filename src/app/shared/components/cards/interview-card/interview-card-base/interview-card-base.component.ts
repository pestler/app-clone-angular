import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-interview-card-base',
  imports: [DatePipe, MatIconModule],
  templateUrl: './interview-card-base.component.html',
  styleUrl: './interview-card-base.component.scss',
})
export class InterviewCardBaseComponent {
  @Input() title!: string;
  @Input() period!: { start: string; end: string };
  @Input() status!: 'No Interview' | 'Not Completed' | 'Completed';
  @Input() result!: number | null;
  @Input() notCompletedMessage!: string;
  @Input() completedMessage!: string;
  @Input() notCompletedImage!: string;
  @Input() completedImage!: string;
  @Input() taskUrl =
    'https://github.com/rolling-scopes-school/tasks/blob/master/angular/modules/interview/README.md';
}
