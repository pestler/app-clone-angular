import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { EmptyStateType } from '../../models/empty-state.enum';
import { ProfileActions } from '../../store/profile.actions';
import { selectAboutView } from '../../store/profile.selectors';
import { BaseCardComponent } from '../base-card/base-card.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';

@Component({
  selector: 'app-about-card',
  imports: [BaseCardComponent, EmptyStateComponent, MatDialogModule],
  templateUrl: './about-card.component.html',
})
export class AboutCardComponent {
  EmptyStateType = EmptyStateType;
  private readonly store = inject(Store);
  readonly dialog = inject(MatDialog);

  aboutSig = toSignal(this.store.select(selectAboutView), { initialValue: null });

  openDialog() {
    const dialogRef = this.dialog.open(AboutDialogComponent, {
      data: { about: this.aboutSig() },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        this.store.dispatch(ProfileActions.updateAboutDraft({ about: result }));
      }
    });
  }
}
