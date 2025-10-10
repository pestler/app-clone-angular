import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewStudentCardComponent } from './interview-student-card.component';

describe('InterviewCardComponent', () => {
  let component: InterviewStudentCardComponent;
  let fixture: ComponentFixture<InterviewStudentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(InterviewStudentCardComponent);
    component = fixture.componentInstance;
    component.interviewInfo = {
      title: 'Angular interview',
      period: {
        start: '2025-09-08',
        end: '2025-09-29',
      },
      status: 'Not Completed',
      result: null,
      interviewer: {
        name: 'Mentor Name',
        github: 'mentor-github',
        url: '',
        email: '',
        telegram: '',
        src: '',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
