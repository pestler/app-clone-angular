import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseSelectComponent } from './course-select.component';

import { Firestore } from '@angular/fire/firestore';

describe('CourseSelectComponent', () => {
  let component: CourseSelectComponent;
  let fixture: ComponentFixture<CourseSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSelectComponent],

      providers: [{ provide: Firestore, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
