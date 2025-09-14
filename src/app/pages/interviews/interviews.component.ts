import { Component } from '@angular/core';
import { InterviewCardComponent } from '../../shared/components/interview-card/interview-card.component';

@Component({
  selector: 'app-interviews',
  imports: [InterviewCardComponent],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.scss',
})
export class InterviewsComponent {}
