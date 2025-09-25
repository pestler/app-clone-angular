import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewCardBaseComponent } from './interview-card-base.component';

describe('InterviewCardBaseComponent', () => {
  let component: InterviewCardBaseComponent;
  let fixture: ComponentFixture<InterviewCardBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewCardBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewCardBaseComponent);
    component = fixture.componentInstance;

    component.title = 'Angular interview';
    component.period = {
      start: '2025-09-08',
      end: '2025-09-29',
    };
    component.status = 'Not Completed';
    component.result = null;
    component.notCompletedMessage = "You're all set! Prepare for your upcoming interview.";
    component.completedMessage = 'Interview completed — time to relax!';
    component.notCompletedImage =
      'https://cdn.rs.school/sloths/stickers/interview-with-mentor/image.svg';
    component.completedImage = 'https://cdn.rs.school/sloths/stickers/congratulations/image.svg';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
