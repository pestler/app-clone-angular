import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { InterviewMentorCardComponent } from './interview-mentor-card.component';

describe('InterviewMentorCardComponent', () => {
  let component: InterviewMentorCardComponent;
  let fixture: ComponentFixture<InterviewMentorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewMentorCardComponent],
      providers: [{ provide: Firestore, useValue: { collection: () => [] } }],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewMentorCardComponent);
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
