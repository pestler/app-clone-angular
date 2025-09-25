import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Layout } from './layout.component';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  const firestoreMock = {
    collection: () => ({
      valueChanges: () => of([]),
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: {} },
        { provide: Firestore, useValue: firestoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
