import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { DonatorsComponent } from './donators.component';

describe('DonatorsComponent', () => {
  let component: DonatorsComponent;
  let fixture: ComponentFixture<DonatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonatorsComponent],
      providers: [{ provide: Firestore, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(DonatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
