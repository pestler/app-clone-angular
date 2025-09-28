import {
  UserProfileCard,
  UserProfileCardWithGithub,
  UserProfileContact,
} from '../models/profile.model';

export interface ProfileState {
  profile: {
    user: UserProfileCardWithGithub | null;
    contacts: UserProfileContact | null;
    about: string | null;
    languages: string[] | null;
  };
  drafts: {
    user?: Partial<UserProfileCard>;
    contacts?: Partial<UserProfileContact>;
    about?: string;
    languages?: string[];
  };
  dirty: {
    user: boolean;
    contacts: boolean;
    about: boolean;
    languages: boolean;
  };
  loading: boolean;
  error: string | null;
}

export const initialProfileState: ProfileState = {
  profile: { user: null, contacts: null, about: null, languages: null },
  drafts: {},
  dirty: { user: false, contacts: false, about: false, languages: false },
  loading: false,
  error: null,
};
