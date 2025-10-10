import { createSelector } from '@ngrx/store';
import { profileFeature } from './profile.reducer';

export const selectProfile = createSelector(profileFeature.selectProfileState, (s) => s.profile);
export const selectDrafts = createSelector(profileFeature.selectProfileState, (s) => s.drafts);
export const selectDirty = createSelector(profileFeature.selectProfileState, (s) => s.dirty);
export const selectLoading = createSelector(profileFeature.selectProfileState, (s) => s.loading);
export const selectError = createSelector(profileFeature.selectProfileState, (s) => s.error);

export const selectUserView = createSelector(selectProfile, selectDrafts, (profile, draft) => ({
  ...profile.user,
  ...(draft.user ?? {}),
}));

export const selectContactsView = createSelector(selectProfile, selectDrafts, (profile, draft) => ({
  ...profile.contacts,
  ...(draft.contacts ?? {}),
}));

export const selectAboutView = createSelector(
  selectProfile,
  selectDrafts,
  (profile, draft) => draft.about ?? profile.about,
);
export const selectLanguagesView = createSelector(
  selectProfile,
  selectDrafts,
  (profile, draft) => draft.languages ?? profile.languages,
);

export const selectIsDirty = createSelector(
  selectDirty,
  (dirty) => dirty.user || dirty.contacts || dirty.about || dirty.languages,
);
