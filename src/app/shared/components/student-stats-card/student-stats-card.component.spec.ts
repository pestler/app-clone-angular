import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStatsCardComponent } from './student-stats-card.component';

describe('StudentStatsCardComponent', () => {
  let component: StudentStatsCardComponent;
  let fixture: ComponentFixture<StudentStatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentStatsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentStatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
