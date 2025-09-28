import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AboutCardComponent } from './cards/about-card/about-card.component';
import { ContactsCardComponent } from './cards/contacts-card/contacts-card.component';
import { LanguagesCardComponent } from './cards/languages-card/languages-card.component';
import { UserCardComponent } from './cards/user-card/user-card.component';
import { ProfileActions } from './store/profile.actions';
import { selectLoading } from './store/profile.selectors';
const GITHUB_USERNAME_KEY = 'githubUsername';
@Component({
  selector: 'app-profile',
  imports: [
    LanguagesCardComponent,
    AboutCardComponent,
    UserCardComponent,
    ContactsCardComponent,
    AsyncPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly store = inject(Store);
  loading$ = this.store.select(selectLoading);

  ngOnInit() {
    const githubId = localStorage.getItem(GITHUB_USERNAME_KEY);
    if (githubId) {
      this.store.dispatch(ProfileActions.loadProfile({ githubId }));
    }
  }
}
