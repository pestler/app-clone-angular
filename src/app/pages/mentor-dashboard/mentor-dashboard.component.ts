import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AssignStudentComponent } from './assign-student/assign-student.component';
import { MyStudentsComponent } from './my-students/my-students.component';

@Component({
  selector: 'app-mentor-dashboard',
  standalone: true,
  imports: [CommonModule, AssignStudentComponent, MyStudentsComponent],
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.scss'],
})
export class MentorDashboardComponent {
  @ViewChild(MyStudentsComponent) myStudentsComponent!: MyStudentsComponent;

  private readonly route = inject(ActivatedRoute);
  public courseAlias: WritableSignal<string | null> = signal(null);

  constructor() {
    this.route.queryParams
      .pipe(map((params) => params['course']))
      .subscribe((alias) => this.courseAlias.set(alias));
  }

  onStudentsAssigned(): void {
    this.myStudentsComponent.loadMyStudents();
  }
}
