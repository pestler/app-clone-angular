import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TaskSolution } from '../../../../app/core/models/solution.model'; // Import TaskSolution

@Component({
  selector: 'app-submitted-status',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './submitted-status.component.html',
  styleUrls: ['./submitted-status.component.scss'],
})
export class SubmittedStatusComponent {
  @Input() solution: TaskSolution | null = null; // Changed type
  @Input() deadlinePassed = false;
}
