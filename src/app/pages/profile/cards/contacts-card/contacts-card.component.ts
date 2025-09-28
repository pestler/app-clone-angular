import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmptyStateType } from '../../models/empty-state.enum';
import { Contact } from '../../models/profile.model';
import { BaseCardComponent } from '../base-card/base-card.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ContactsDialogComponent } from './contacts-dialog/contacts-dialog.component';

@Component({
  selector: 'app-contacts-card',
  imports: [BaseCardComponent, EmptyStateComponent, TitleCasePipe, KeyValuePipe],
  templateUrl: './contacts-card.component.html',
  styleUrl: './contacts-card.component.scss',
})
export class ContactsCardComponent {
  contacts: Contact = {
    email: 'example@ex.com',
    telegram: '@smith-mentor',
  };
  EmptyStateType = EmptyStateType;

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ContactsDialogComponent, {
      width: '500px',
      data: { ...this.contacts },
    });

    dialogRef.afterClosed().subscribe((result: Contact | undefined) => {
      if (result) {
        this.contacts = result;
      }
    });
  }

  hasContacts(): boolean {
    return Object.values(this.contacts).some((v) => v != null && v.toString().trim() !== '');
  }
}
