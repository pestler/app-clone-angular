import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogButtonComponent } from '../../../../../shared/components/dialog-button/dialog-button.component';
import { Contact } from '../../../models/contacts.model';

@Component({
  selector: 'app-contacts-dialog',
  imports: [FormsModule, DialogButtonComponent, MatDialogModule],
  templateUrl: './contacts-dialog.component.html',
  styleUrl: './contacts-dialog.component.scss',
})
export class ContactsDialogComponent {
  private dialogRef = inject(MatDialogRef<ContactsDialogComponent>);
  private injectedData = inject<Contact>(MAT_DIALOG_DATA);

  data: Contact = { ...this.injectedData };
  originalData: Contact = { ...this.injectedData };

  get isChanged(): boolean {
    return JSON.stringify(this.data) !== JSON.stringify(this.originalData);
  }

  save = () => this.dialogRef.close(this.data);

  cancel = () => this.dialogRef.close();
}
