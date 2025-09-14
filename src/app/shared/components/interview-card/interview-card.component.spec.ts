import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewCardComponent } from './interview-card.component';

describe('InterviewCardComponent', () => {
  let component: InterviewCardComponent;
  let fixture: ComponentFixture<InterviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
