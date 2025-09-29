import { createFeature, createReducer, on } from '@ngrx/store';
import { ProfileActions } from './profile.actions';
import { initialProfileState } from './profile.state.models';

const reducer = createReducer(
  initialProfileState,
  on(ProfileActions.updateUserDraft, (state, { patch }) => ({
    ...state,
    drafts: { ...state.drafts, user: { ...(state.drafts.user ?? {}), ...patch } },
    dirty: { ...state.dirty, user: true },
  })),
  on(ProfileActions.updateContactsDraft, (state, { patch }) => ({
    ...state,
    drafts: { ...state.drafts, contacts: { ...(state.drafts.contacts ?? {}), ...patch } },
    dirty: { ...state.dirty, contacts: true },
  })),
  on(ProfileActions.updateAboutDraft, (state, { about }) => ({
    ...state,
    drafts: { ...state.drafts, about },
    dirty: { ...state.dirty, about: true },
  })),
  on(ProfileActions.updateLanguagesDraft, (state, { languages }) => ({
    ...state,
    drafts: { ...state.drafts, languages },
    dirty: { ...state.dirty, languages: true },
  })),

  on(ProfileActions.resetDrafts, (state) => ({
    ...state,
    drafts: {},
    dirty: { user: false, contacts: false, about: false, languages: false },
  })),
  on(ProfileActions.saveProfile, (state) => ({ ...state, loading: true, error: null })),
  on(ProfileActions.saveProfileSuccess, (state, { saved }) => ({
    ...state,
    profile: {
      user: {
        githubId: saved.user?.githubId ?? '',
        displayName: saved.user?.displayName ?? '',
        englishLevel: saved.user?.englishLevel ?? '',
        countryName: saved.user?.countryName ?? '',
        cityName: saved.user?.cityName ?? '',
      },
      contacts: {
        phone: saved.contacts?.phone ?? '',
        email: saved.contacts?.email ?? '',
        epamEmail: saved.contacts?.epamEmail,
        telegram: saved.contacts?.telegram ?? '',
        whatsapp: saved.contacts?.whatsapp ?? '',
        notes: saved.contacts?.notes ?? '',
      },
      about: saved.about ?? null,
      languages: saved.languages ?? null,
    },
    drafts: initialProfileState.drafts,
    dirty: { user: false, contacts: false, about: false, languages: false },
    loading: false,
    error: null,
  })),
  on(ProfileActions.saveProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProfileActions.loadProfile, (state) => ({ ...state, loading: true, error: null })),
  on(ProfileActions.loadProfileSuccess, (state, { data }) => ({
    ...state,
    profile: data,
    drafts: {},
    dirty: { user: false, contacts: false, about: false, languages: false },
    loading: false,
    error: null,
  })),
  on(ProfileActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const profileFeature = createFeature({
  name: 'profile',
  reducer,
});

export const { name, reducer: profileReducer, selectProfileState } = profileFeature;
