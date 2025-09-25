import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CourseSelectComponent } from './course-select.component';

describe('CourseSelectComponent', () => {
  let component: CourseSelectComponent;
  let fixture: ComponentFixture<CourseSelectComponent>;

  const firestoreMock = {
    collection: () => ({
      valueChanges: () => of([]),
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSelectComponent],
      providers: [
        { provide: Auth, useValue: {} },
        { provide: Firestore, useValue: firestoreMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
