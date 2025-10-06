import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LanguageNamePipe } from '../../../../shared/pipes/language-name-pipe';
import { EmptyStateType } from '../../models/empty-state.enum';
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
  lanquages: string[] = [];
  EmptyStateType = EmptyStateType;

  readonly dialog = inject(MatDialog);
  openDialog() {
    const dialogRef = this.dialog.open(LanguagesDialogComponent, {
      data: { languages: this.lanquages },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.lanquages = result;
      }
    });
  }
}
