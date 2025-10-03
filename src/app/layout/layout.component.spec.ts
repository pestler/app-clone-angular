/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout } from './layout.component';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

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
        { provide: Firestore, useValue: firestoreMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */
