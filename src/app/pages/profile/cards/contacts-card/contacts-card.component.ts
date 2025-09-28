import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { EmptyStateType } from '../../models/empty-state.enum';
import { UserProfileContact } from '../../models/profile.model';
import { ProfileActions } from '../../store/profile.actions';
import { selectContactsView } from '../../store/profile.selectors';
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
  EmptyStateType = EmptyStateType;
  private readonly store = inject(Store);
  readonly dialog = inject(MatDialog);

  contactsSig = this.store.selectSignal(selectContactsView);

  openDialog() {
    const current = this.contactsSig() ?? {};
    const dialogRef = this.dialog.open(ContactsDialogComponent, {
      width: '500px',
      data: { ...current },
    });

    dialogRef.afterClosed().subscribe((result: UserProfileContact | null) => {
      if (result) {
        this.store.dispatch(ProfileActions.updateContactsDraft({ patch: result }));
      }
    });
  }

  hasContacts = computed(() => {
    const c = this.contactsSig() ?? {};
    return Object.values(c).some((v) => v != null && String(v).trim() !== '');
  });
}
