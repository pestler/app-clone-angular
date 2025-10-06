import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { studentMockInfo } from '../../../../core/mocks/student.mock';
import { UserCardDialogComponent } from './user-card-dialog/user-card-dialog.component';

@Component({
  selector: 'app-user-card',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  user = studentMockInfo;
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(UserCardDialogComponent, {
      width: '500px',
      data: {
        name: this.user.name,
        location: this.user.location,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user = {
          ...this.user,
          name: result.nameCtrl,
          location: result.locationCtrl,
        };
      }
    });
  }
}
