import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewStudentCardComponent } from './interview-student-card.component';

describe('InterviewCardComponent', () => {
  let component: InterviewStudentCardComponent;
  let fixture: ComponentFixture<InterviewStudentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewStudentCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewStudentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
