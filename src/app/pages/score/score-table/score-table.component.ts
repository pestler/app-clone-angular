import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  Signal,
  SimpleChanges,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, combineLatest, of, switchMap } from 'rxjs';

import { Course } from '../../../core/models/dashboard.models';
import {
  IPaginationInfo,
  ScoreOrder,
  ScoreStudentDto,
  ScoreTableFilters,
} from '../../../core/models/score.model';
import { Task } from '../../../core/models/task.model';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course';

function getColumns(tasks: Task[]): string[] {
  const basicColumns = ['rank', 'githubId', 'name', 'score'];
  const taskColumns = tasks.map((task) => `task-${task.id}`);
  return [...basicColumns, ...taskColumns];
}

@Component({
  selector: 'app-score-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss'],
})
export class ScoreTableComponent implements OnInit, OnChanges {
  @Input() course: Course | undefined;
  @Input() activeOnly = true;
  @Input() isLoading = false;

  private readonly courseService = inject(CourseService);
  private readonly authService = inject(AuthService);

  displayedColumns: string[] = [];
  dataSource = new BehaviorSubject<ScoreStudentDto[]>([]);
  totalStudents = 0;
  pageSize = 100;
  currentPage = 0;
  sortField = 'rank';
  sortDirection: 'asc' | 'desc' | '' = 'asc';
  taskHeaderMap = new Map<string, string>();
  sortableColumns: string[] = ['rank', 'githubId', 'name', 'score'];

  private githubId$ = this.authService.githubUsername$;
  private currentStudentScore: Signal<ScoreStudentDto | undefined> = toSignal(
    this.githubId$.pipe(
      switchMap((githubId) =>
        githubId
          ? this.courseService.getStudentCourseScore(this.course?.alias || '', githubId)
          : of(undefined),
      ),
    ),
  );

  private courseTasks = signal<Task[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeOnly']) {
      console.log(
        'ScoreTableComponent: ngOnChanges detected activeOnly change:',
        changes['activeOnly'].currentValue,
      );
    }
    if (changes['activeOnly'] || changes['course']) {
      this.loadData();
    }
  }

  loadData(): void {
    if (!this.course) return;

    console.log('ScoreTable: Loading data...');

    const pagination: IPaginationInfo = {
      current: this.currentPage + 1,
      pageSize: this.pageSize,
    };
    const filters: ScoreTableFilters = {
      activeOnly: this.activeOnly,
    };
    console.log('ScoreTableComponent: loading data with filters:', filters);
    const order: ScoreOrder = {
      field: this.sortField,
      order: this.sortDirection === 'asc' ? 'ascend' : 'descend',
    };

    combineLatest([
      this.courseService.getCourseScore(this.course.alias, pagination, filters, order),
      this.courseService.getCourseTasks(this.course.alias),
    ]).subscribe({
      next: ([scoreData, tasks]) => {
        console.log('ScoreTable: Received scoreData:', scoreData);
        console.log('ScoreTable: Received tasks:', tasks);
        this.dataSource.next(scoreData.content);
        this.totalStudents = scoreData.pagination.total || 0;
        this.courseTasks.set(tasks);
        this.displayedColumns = getColumns(tasks);

        this.taskHeaderMap.clear();
        tasks.forEach((task) => {
          this.taskHeaderMap.set(`task-${task.id}`, task.name);
        });

        console.log('ScoreTable: Final dataSource:', this.dataSource.getValue());
      },
      error: (err) => {
        console.error('ScoreTable: Error loading score data:', err);
      },
    });
  }

  getColumnHeader(column: string): string {
    if (this.taskHeaderMap.has(column)) {
      return this.taskHeaderMap.get(column)!;
    }
    return column;
  }

  isTaskColumn(column: string): boolean {
    return column.startsWith('task-');
  }

  isSortable(column: string): boolean {
    return this.sortableColumns.includes(column);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  handleSortChange(sort: Sort): void {
    this.sortField = sort.active;
    this.sortDirection = sort.direction;
    this.loadData();
  }
}
