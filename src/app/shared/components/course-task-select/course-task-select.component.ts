import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-course-task-select',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './course-task-select.component.html',
  styleUrls: ['./course-task-select.component.scss']
})
export class CourseTaskSelectComponent {
  @Input() tasks: Task[] = [];
  @Input() groupBy = 'deadline';
  @Input() selectedTaskId: number | null = null;
  @Output() taskSelected = new EventEmitter<number>();

  groupedTasks = computed<[string, Task[]][]>(() => {
    if (this.groupBy === 'deadline') {
      const groups = this.tasks.reduce((acc, task) => {
        let deadline = 'No deadline';
        if (task.phases) {
          const submitPhase = task.phases.find(p => p.phase === 'submit');
          if (submitPhase?.endDate) {
            deadline = new Date(submitPhase.endDate).toLocaleDateString();
          }
        }

        if (!acc[deadline]) {
          acc[deadline] = [];
        }
        acc[deadline].push(task);
        return acc;
      }, {} as Record<string, Task[]>);
      return Object.entries(groups);
    }
    return [['All tasks', this.tasks]];
  });
}