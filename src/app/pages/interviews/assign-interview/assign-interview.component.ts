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
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { ScoreData } from '../../../core/models/dashboard.models';
import { InterviewInfo } from '../../../core/models/interview.model';
import { InterviewService } from '../../../core/services/interview.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-assign-interview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './assign-interview.component.html',
  styleUrls: ['./assign-interview.component.scss'],
})
export class AssignInterviewComponent implements OnInit {
  @Input({ required: true }) courseAlias!: string;
  @Input({ required: true }) mentorId!: string;
  @Output() interviewAssigned = new EventEmitter<void>();

  private readonly interviewService = inject(InterviewService);
  private readonly notificationService = inject(NotificationService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  public studentsWithoutInterview: WritableSignal<ScoreData[]> = signal([]);

  public interviewForm = new FormGroup({
    student: new FormControl<ScoreData | null>(null, Validators.required),
    title: new FormControl<string>('', Validators.required),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.refresh$
      .pipe(
        switchMap(() => this.interviewService.getStudentsWithoutInterview(this.courseAlias)),
        map((students) => students.filter((student) => !student.hasInterview)),
      )
      .subscribe((students) => this.studentsWithoutInterview.set(students));
  }

  async onSubmit(): Promise<void> {
    if (this.interviewForm.invalid) {
      this.notificationService.showError('Please fill in all required fields.');
      return;
    }

    const formValue = this.interviewForm.value;
    const selectedStudent = formValue.student;

    if (!selectedStudent || !formValue.title || !formValue.startDate || !formValue.endDate) {
      this.notificationService.showError('Missing required interview details.');
      return;
    }

    const interviewData: Partial<InterviewInfo> = {
      title: formValue.title,
      period: {
        start: formValue.startDate.toISOString().split('T')[0],
        end: formValue.endDate.toISOString().split('T')[0],
      },
      status: 'Not Completed',
      result: null,
      interviewer: {
        name: 'Mentor Name',
        github: this.mentorId,
        url: `https://github.com/${this.mentorId}`,
        email: 'mentor@example.com',
        telegram: '@mentor',
        src: '../assets/svg/im-fine.svg',
      },
    };

    try {
      await this.interviewService.createInterview(
        this.courseAlias,
        selectedStudent.githubId,
        this.mentorId,
        interviewData,
      );
      this.notificationService.showSuccess('Interview assigned successfully!');
      this.interviewForm.reset();
      this.refresh$.next();
      this.interviewAssigned.emit();
    } catch (error) {
      console.error('Error assigning interview:', error);
      this.notificationService.showError('Failed to assign interview.');
    }
  }
}
