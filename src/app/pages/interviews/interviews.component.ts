import { Component, inject, OnInit } from '@angular/core';
import { UserRole } from '../../core/services/user-role';
import { InterviewMentorCardComponent } from '../../shared/components/cards/interview-card/interview-mentor-card/interview-mentor-card.component';
import { InterviewStudentCardComponent } from '../../shared/components/cards/interview-card/interview-student-card/interview-student-card.component';

@Component({
  selector: 'app-interviews',
  imports: [InterviewMentorCardComponent, InterviewStudentCardComponent],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.scss',
})
export class InterviewsComponent implements OnInit {
  private userRole = inject(UserRole);
  role: string | null = null;

  ngOnInit(): void {
    this.role = this.userRole.getActiveRole();
  }
}
