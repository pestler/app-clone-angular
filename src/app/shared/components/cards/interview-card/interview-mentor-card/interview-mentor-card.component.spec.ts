import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { InterviewMentorCardComponent } from './interview-mentor-card.component';

describe('InterviewMentorCardComponent', () => {
  let component: InterviewMentorCardComponent;
  let fixture: ComponentFixture<InterviewMentorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewMentorCardComponent],
      providers: [{ provide: Firestore, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewMentorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
