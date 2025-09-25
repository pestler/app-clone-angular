import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RateDialogComponent } from './rate-dialog.component';

describe('RateDialogComponent', () => {
  let component: RateDialogComponent;
  let fixture: ComponentFixture<RateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { rating: null } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
