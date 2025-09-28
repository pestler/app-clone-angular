import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { LanguageNamePipe } from '../../../../shared/pipes/language-name-pipe';
import { EmptyStateType } from '../../models/empty-state.enum';
import { ProfileActions } from '../../store/profile.actions';
import { selectLanguagesView } from '../../store/profile.selectors';
import { BaseCardComponent } from '../base-card/base-card.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { LanguagesDialogComponent } from './languages-dialog/languages-dialog.component';

@Component({
  selector: 'app-languages-card',
  imports: [BaseCardComponent, EmptyStateComponent, MatDialogModule, LanguageNamePipe],
  templateUrl: './languages-card.component.html',
  styleUrl: './languages-card.component.scss',
})
export class LanguagesCardComponent {
  EmptyStateType = EmptyStateType;
  private readonly store = inject(Store);
  readonly dialog = inject(MatDialog);

  languagesSig = this.store.selectSignal(selectLanguagesView);

  openDialog() {
    const dialogRef = this.dialog.open(LanguagesDialogComponent, {
      data: { languages: this.languagesSig() },
    });
    dialogRef.afterClosed().subscribe((languages) => {
      if (Array.isArray(languages)) {
        this.store.dispatch(ProfileActions.updateLanguagesDraft({ languages })); //need to check shorthand
      }
    });
  }
}
