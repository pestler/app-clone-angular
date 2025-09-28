import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/services/user';
import { ProfileActions } from './profile.actions';
import { ProfileState } from './profile.state.models';

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private api = inject(User);
  private notification = inject(NotificationService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      exhaustMap(({ githubId }) =>
        this.api.getUserProfile(githubId).pipe(
          map((data) => {
            if (!data) {
              const message = 'Profile not found';
              this.notification.showError(message);
              throw new Error(message);
            }

            const profileData: ProfileState['profile'] = {
              user: data
                ? {
                    githubId: data.githubId,
                    displayName: data.displayName,
                    countryName: data.generalInfo.location.countryName,
                    cityName: data.generalInfo.location.cityName,
                  }
                : null,
              contacts: data
                ? {
                    phone: data.contacts.phone,
                    email: data.contacts.email,
                    epamEmail: data.contacts.epamEmail,
                    telegram: data.contacts.telegram,
                    whatsapp: data.contacts.whatsapp,
                    notes: data.contacts.notes,
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

  // save$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ProfileActions.saveProfile),
  //     withLatestFrom(
  //       this.store.select(selectProfile),
  //       this.store.select(selectDrafts),
  //       this.store.select(selectDirty),
  //     ),
  //     exhaustMap(([_, profile, drafts, dirty]) => {
  //       const payload: Partial<UserProfile> = {};

  //       if (dirty.user) {
  //         const resultUser = { ...profile.user, ...drafts.user };
  //         payload.displayName = resultUser.displayName;
  //         payload.generalInfo.location.countryName = resultUser.countryName;
  //         payload.generalInfo.location.cityName = resultUser.cityName;
  //       }

  //       if (dirty.contacts) payload.contacts = { ...profile.contacts, ...drafts.contacts };
  //       if (dirty.about) payload.about = drafts.about ?? profile.about;
  //       if (dirty.languages) payload.languages = { ...profile.languages, ...drafts.languages };
  //       if (!Object.keys(payload).length)
  //         return of(ProfileActions.saveProfileSuccess({ saved: {} }));

  //       return this.api.saveUserProfile(githubId, payload).pipe(
  //         map((saved) => ProfileActions.saveProfileSuccess({ saved })),
  //         catchError((error) => {
  //           const message = error?.message ?? 'Load failed';
  //           this.notification.showError(message);

  //           return of(ProfileActions.saveProfileFailure({ error: message }));
  //         }),
  //       );
  //     }),
  //   ),
  // );
}
