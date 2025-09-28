import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { UserProfileCard, UserProfileContact } from '../models/profile.model';
import { ProfileState } from './profile.state.models';

export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Update User Draft': props<{ patch: Partial<UserProfileCard> }>(),
    'Update Contacts Draft': props<{ patch: Partial<UserProfileContact> }>(),
    'Update About Draft': props<{ about: string }>(),
    'Update Languages Draft': props<{ languages: string[] }>(),
    'Reset Drafts': emptyProps(),
    'Save Profile': emptyProps(),
    'Save Profile Success': props<{ saved: Partial<ProfileState['profile']> }>(),
    'Save Profile Failure': props<{ error: string }>(),
    'Load Profile': props<{ githubId: string }>(),
    'Load Profile Success': props<{ data: ProfileState['profile'] }>(),
    'Load Profile Failure': props<{ error: string }>(),
  },
});
