import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmptyStateType } from '../../models/empty-state.enum';
import { BaseCardComponent } from '../base-card/base-card.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';

@Component({
  selector: 'app-about-card',
  imports: [BaseCardComponent, EmptyStateComponent, MatDialogModule],
  templateUrl: './about-card.component.html',
})
export class AboutCardComponent {
  about = '';
  EmptyStateType = EmptyStateType;

  readonly dialog = inject(MatDialog);
  openDialog() {
    const dialogRef = this.dialog.open(AboutDialogComponent, {
      data: { about: this.about },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.about = result;
      }
    });
  }
}
