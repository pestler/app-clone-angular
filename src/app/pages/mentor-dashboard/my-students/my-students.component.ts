import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ScoreData } from '../../../core/models/dashboard.models';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course';

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule],
  templateUrl: './my-students.component.html',
  styleUrls: ['./my-students.component.scss'],
})
export class MyStudentsComponent implements OnInit {
  @Input({ required: true }) courseAlias!: string;

  private readonly courseService = inject(CourseService);
  private readonly authService = inject(AuthService);

  public myStudents: WritableSignal<ScoreData[]> = signal([]);

  ngOnInit(): void {
    this.loadMyStudents();
  }

  loadMyStudents(): void {
    const mentorId = this.authService.githubUsername$.value;
    if (!mentorId) {
      this.myStudents.set([]);
      return;
    }

    this.courseService
      .getMentorStudents(this.courseAlias, mentorId)
      .subscribe((students) => this.myStudents.set(students));
  }
}
