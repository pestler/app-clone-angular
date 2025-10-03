import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TaskSolution } from '../../../../app/core/models/solution.model';

@Component({
  selector: 'app-submitted-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './submitted-status.component.html',
  styleUrls: ['./submitted-status.component.scss'],
})
export class SubmittedStatusComponent {
  @Input() solution: TaskSolution | null = null;
  @Input() deadlinePassed = false;
}
