import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Task, TaskStatus } from '../../../../core/models/dashboard.models';

export interface ChartItem {
  name: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-tasks-stats-card',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatCardModule],
  templateUrl: './tasks-stats-card.component.html',
  styleUrls: ['./tasks-stats-card.component.scss'],
})
export class TasksStatsCardComponent implements OnChanges {
  @Input() tasksByStatus: Record<TaskStatus, Task[]> = {} as Record<TaskStatus, Task[]>;

  chartData: ChartItem[] = [];

  customColors: { name: string; value: string }[] = [];
  totalTasks = 0;

  statusColors: Record<string, string> = {
    [TaskStatus.Checked]: '#52c41a',
    [TaskStatus.InProgress]: '#1890ff',
    [TaskStatus.ToDo]: '#faad14',
    [TaskStatus.Checking]: '#f5222d',
  };

  ngOnChanges(): void {
    let total = 0;
    this.chartData = Object.entries(this.tasksByStatus).map(([status, tasks]) => {
      total += tasks.length;
      return {
        name: status,
        value: tasks.length,
      };
    });

    this.totalTasks = total;

    this.customColors = this.chartData.map((item) => ({
      name: item.name,
      value: this.statusColors[item.name] || '#888',
    }));
  }
}
