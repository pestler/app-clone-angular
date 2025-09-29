import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { GITHUB_USERNAME_KEY } from '../../token';
import { AboutCardComponent } from './cards/about-card/about-card.component';
import { ContactsCardComponent } from './cards/contacts-card/contacts-card.component';
import { LanguagesCardComponent } from './cards/languages-card/languages-card.component';
import { UserCardComponent } from './cards/user-card/user-card.component';
import { ProfileActions } from './store/profile.actions';
import { selectIsDirty, selectLoading } from './store/profile.selectors';
@Component({
  selector: 'app-profile',
  imports: [
    LanguagesCardComponent,
    AboutCardComponent,
    UserCardComponent,
    ContactsCardComponent,
    AsyncPipe,
    MatButtonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly githubUsernameKey = inject(GITHUB_USERNAME_KEY);

  loading$ = this.store.select(selectLoading);
  readonly dirtySig = this.store.selectSignal(selectIsDirty);

  ngOnInit() {
    const githubId = localStorage.getItem(this.githubUsernameKey);
    if (githubId) {
      this.store.dispatch(ProfileActions.loadProfile({ githubId }));
    }
  }

  saveProfile(): void {
    this.store.dispatch(ProfileActions.saveProfile());
  }
}
