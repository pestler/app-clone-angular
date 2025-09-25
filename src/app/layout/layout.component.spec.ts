import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout } from './layout.component';

import { Firestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: [{ provide: Firestore, useValue: {} }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
