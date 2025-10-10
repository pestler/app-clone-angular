import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
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
  readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  userSig = this.store.selectSignal(selectUserView);

  readonly userAvatar = computed(() => {
    const githubId = this.userSig()?.githubId;
    return githubId ? `https://github.com/${githubId}.png` : '';
  });

  readonly userGithubUrl = computed(() => {
    const githubId = this.userSig()?.githubId;
    return githubId ? `https://github.com/${githubId}` : '';
  });

  Boolean = Boolean;

  openDialog() {
    const current = this.userSig() ?? {};

    const dialogRef = this.dialog.open(UserCardDialogComponent, {
      width: '500px',
      data: {
        displayName: current.displayName ?? '',
        englishLevel: current.englishLevel ?? '',
        countryName: current.countryName ?? '',
        cityName: current.cityName ?? '',
      } satisfies UserProfileCard,
    });

    dialogRef.afterClosed().subscribe((result: UserProfileCard | null) => {
      if (result) {
        this.store.dispatch(
          ProfileActions.updateUserDraft({
            patch: {
              ...result,
              githubId: this.userSig()?.githubId ?? '',
            },
          }),
        );
      }
    });
  }
}
