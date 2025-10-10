import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedStatusComponent } from './submitted-status.component';

describe('SubmittedStatusComponent', () => {
  let component: SubmittedStatusComponent;
  let fixture: ComponentFixture<SubmittedStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmittedStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmittedStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
