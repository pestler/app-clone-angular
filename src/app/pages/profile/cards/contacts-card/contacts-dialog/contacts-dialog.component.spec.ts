import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ContactsDialogComponent } from './contacts-dialog.component';

describe('ContactsDialogComponent', () => {
  let component: ContactsDialogComponent;
  let fixture: ComponentFixture<ContactsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { about: '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
