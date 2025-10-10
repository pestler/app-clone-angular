import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoInterviewCardComponent } from './no-interview-card.component';

describe('NoInterviewCardComponent', () => {
  let component: NoInterviewCardComponent;
  let fixture: ComponentFixture<NoInterviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoInterviewCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoInterviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
