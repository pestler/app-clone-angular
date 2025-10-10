import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, defer, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { UserProfile } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/services/user';
import { GITHUB_USERNAME_KEY } from '../../../token';
import { UserProfileContact } from '../models/profile.model';
import { ProfileActions } from './profile.actions';
import { selectDirty, selectDrafts, selectProfile } from './profile.selectors';
import { ProfileState } from './profile.state.models';

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private api = inject(User);
  private notification = inject(NotificationService);
  private readonly githubUsernameKey = inject(GITHUB_USERNAME_KEY);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      exhaustMap(({ githubId }) =>
        this.api.getUserProfile(githubId).pipe(
          map((data) => {
            if (!data) {
              const message = 'Profile not found';
              return ProfileActions.loadProfileFailure({ error: message });
            }

            const profileData: ProfileState['profile'] = {
              user: data
                ? {
                    githubId: data.githubId,
                    displayName: data.displayName,
                    englishLevel: data.generalInfo.englishLevel,
                    countryName: data.generalInfo.location.countryName,
                    cityName: data.generalInfo.location.cityName,
                  }
                : null,
              contacts: data
                ? {
                    phone: data.contacts?.phone,
                    email: data.contacts?.email,
                    epamEmail: data.contacts?.epamEmail,
                    telegram: data.contacts?.telegram,
                    whatsapp: data.contacts?.whatsapp,
                    notes: data.contacts?.notes,
                  }
                : null,
              about: data?.about ?? null,
              languages: data?.languages ?? null,
            };
            return ProfileActions.loadProfileSuccess({ data: profileData });
          }),
          catchError((error) => {
            const message = error?.message ?? 'Load failed';
            this.notification.showError(message);

            return of(ProfileActions.loadProfileFailure({ error: message }));
          }),
        ),
      ),
    ),
  );

  save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.saveProfile),
      withLatestFrom(
        this.store.select(selectProfile),
        this.store.select(selectDrafts),
        this.store.select(selectDirty),
      ),
      exhaustMap(([_, profile, drafts, dirty]) => {
        const payload: Partial<UserProfile> = {};

        if (dirty.user) {
          const resultUser = { ...profile.user, ...drafts.user };
          payload.displayName = resultUser.displayName;

          payload.generalInfo = {
            englishLevel: profile.user?.englishLevel || '',
            location: {
              countryName: resultUser.countryName,
              cityName: resultUser.cityName,
            },
          };
        }

        if (dirty.contacts) {
          payload.contacts = {
            ...(profile.contacts || {}),
            ...(drafts.contacts || {}),
          } as UserProfileContact;
        }
        if (dirty.about) payload.about = drafts.about ?? profile.about;
        if (dirty.languages) payload.languages = drafts.languages ?? profile.languages;

        if (!Object.keys(payload).length)
          return of(ProfileActions.saveProfileSuccess({ saved: profile }));

        const githubId = localStorage.getItem(this.githubUsernameKey) || '';
        return defer(() => this.api.saveUserProfile(githubId, payload)).pipe(
          map((updatedUserProfile) => {
            const successMessage = 'Your data has been successfully saved';
            this.notification.showSuccess(successMessage);
            return ProfileActions.saveProfileSuccess({ saved: updatedUserProfile });
          }),
          catchError((error) => {
            const message = error?.message ?? 'Load failed';
            this.notification.showError(message);

            return of(ProfileActions.saveProfileFailure({ error: message }));
          }),
        );
      }),
    ),
  );
}
