import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonatorsComponent } from './donators.component';

describe('DonatorsComponent', () => {
  let component: DonatorsComponent;
  let fixture: ComponentFixture<DonatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonatorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
