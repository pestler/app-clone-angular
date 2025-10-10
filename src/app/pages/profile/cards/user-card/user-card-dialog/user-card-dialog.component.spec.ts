import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UserCardDialogComponent } from './user-card-dialog.component';

describe('UserCardDialogComponent', () => {
  let component: UserCardDialogComponent;
  let fixture: ComponentFixture<UserCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { about: '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
