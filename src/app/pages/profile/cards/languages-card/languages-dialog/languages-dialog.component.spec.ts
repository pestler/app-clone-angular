import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LanguagesDialogComponent } from './languages-dialog.component';

describe('LanguagesDialogComponent', () => {
  let component: LanguagesDialogComponent;
  let fixture: ComponentFixture<LanguagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguagesDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { languages: [] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
