import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { studentMockInfo } from '../../../../core/mocks/student.mock';
import { UserProfileCard } from '../../models/profile.model';
import { ProfileActions } from '../../store/profile.actions';
import { selectUserView } from '../../store/profile.selectors';
import { UserCardDialogComponent } from './user-card-dialog/user-card-dialog.component';

@Component({
  selector: 'app-user-card',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  readonly userAvater = studentMockInfo.avatarUrl;
  readonly userGithubUrl = studentMockInfo.githubUrl;
  readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  userSig = this.store.selectSignal(selectUserView);

  location = `${this.userSig().cityName}, ${this.userSig().countryName}`;

  openDialog() {
    const current = this.userSig() ?? {};
    // const isLocation = this.userSig().cityName || this.userSig().countryName ? true : false;

    const dialogRef = this.dialog.open(UserCardDialogComponent, {
      width: '500px',
      data: {
        name: current.displayName,
        location,
      },
    });
    dialogRef.afterClosed().subscribe((result: UserProfileCard | null) => {
      if (result) {
        this.store.dispatch(ProfileActions.updateUserDraft({ patch: result }));
      }
    });
  }
}
