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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { ScoreSearchDialogComponent } from '../score-search-dialog/score-search-dialog.component';

function getColumns(tasks: Task[]): string[] {
  const basicColumns = ['rank', 'githubId', 'name', 'city', 'score'];
  const taskColumns = tasks.map((task) => `task-${task.id}`);
  return [...basicColumns, ...taskColumns];
}

@Component({
  selector: 'app-score-table',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
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
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [];
  public dataSource = new BehaviorSubject<ScoreStudentDto[]>([]);
  totalStudents = 0;
  pageSize = 100;
  currentPage = 0;
  sortField = 'rank';
  sortDirection: 'asc' | 'desc' | '' = 'asc';
  taskHeaderMap = new Map<string, string>();
  sortableColumns: string[] = ['rank', 'githubId', 'name', 'city', 'score'];
  activeFilters: ScoreTableFilters = {};

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
    if (changes['activeOnly'] || changes['course']) {
      this.loadData();
    }
  }

  openSearchDialog(event: MouseEvent, field: 'githubId' | 'name' | 'city'): void {
    const trigger = event.currentTarget as HTMLElement;
    const rect = trigger.getBoundingClientRect();

    const dialogRef = this.dialog.open(ScoreSearchDialogComponent, {
      width: '280px',
      position: {
        top: `${rect.bottom + 4}px`,
        left: `${rect.left - 120}px`,
      },
      hasBackdrop: true,
      backdropClass: 'mat-dialog-transparent-backdrop',
      panelClass: 'search-dialog-panel',
      data: {
        field: field,
        value: this.activeFilters[field] || '',
      },
    });

    dialogRef.afterClosed().subscribe((result: { field: string; value: string } | undefined) => {
      if (result) {
        this.activeFilters = {
          ...this.activeFilters,
          [result.field]: result.value,
        };
        this.currentPage = 0;
        this.loadData();
      }
    });
  }

  loadData(): void {
    if (!this.course) return;

    const pagination: IPaginationInfo = {
      current: this.currentPage + 1,
      pageSize: this.pageSize,
    };
    const filters: ScoreTableFilters = {
      activeOnly: this.activeOnly,
      ...this.activeFilters,
    };
    const order: ScoreOrder = {
      field: this.sortField,
      order: this.sortDirection === 'asc' ? 'ascend' : 'descend',
    };

    combineLatest([
      this.courseService.getCourseScore(this.course.alias, pagination, filters, order),
      this.courseService.getCourseTasks(this.course.alias),
    ]).subscribe({
      next: ([scoreData, tasks]) => {
        this.dataSource.next(scoreData.content);
        this.totalStudents = scoreData.pagination.total || 0;
        this.courseTasks.set(tasks);
        this.displayedColumns = getColumns(tasks);
        this.taskHeaderMap.clear();
        tasks.forEach((task) => {
          this.taskHeaderMap.set(`task-${task.id}`, task.name);
        });
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
    const headerMap: Record<string, string> = {
      rank: '#',
      githubId: 'Github',
      name: 'Name',
      city: 'City',
      score: 'Total',
    };
    return headerMap[column] || column;
  }

  isTaskColumn(column: string): boolean {
    return column.startsWith('task-');
  }

  isSortable(column: string): boolean {
    return this.sortableColumns.includes(column);
  }

  isFilterActive(field: string): boolean {
    return !!this.activeFilters[field as keyof ScoreTableFilters];
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
