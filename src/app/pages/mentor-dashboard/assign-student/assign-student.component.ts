import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { ScoreData } from '../../../core/models/dashboard.models';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-assign-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './assign-student.component.html',
  styleUrls: ['./assign-student.component.scss'],
})
export class AssignStudentComponent implements OnInit {
  @Input({ required: true }) courseAlias!: string;
  @Output() studentsAssigned = new EventEmitter<void>();

  private readonly courseService = inject(CourseService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  public unassignedStudents: WritableSignal<ScoreData[]> = signal([]);
  public studentsControl = new FormControl<ScoreData[]>([]);

  ngOnInit(): void {
    this.loadUnassignedStudents();
  }

  loadUnassignedStudents(): void {
    this.courseService
      .getUnassignedStudents(this.courseAlias)
      .subscribe((students) => this.unassignedStudents.set(students));
  }

  assignStudents(): void {
    const mentorId = this.authService.githubUsername$.value;
    if (!mentorId) {
      this.notificationService.showError('Mentor ID not found. Please log in again.');
      return;
    }

    const selectedStudents = this.studentsControl.value;
    if (!selectedStudents || selectedStudents.length === 0) {
      this.notificationService.showError('Please select at least one student to assign.');
      return;
    }

    const promises = selectedStudents.map((student) => {
      return this.courseService.assignMentorToStudent(this.courseAlias, mentorId, student.githubId);
    });

    Promise.all(promises)
      .then(() => {
        this.notificationService.showSuccess('Successfully assigned students!');
        this.loadUnassignedStudents();
        this.studentsControl.reset();
        this.studentsAssigned.emit();
      })
      .catch((err) => {
        console.error('Error assigning students:', err);
        this.notificationService.showError('Failed to assign students.');
      });
  }
}
