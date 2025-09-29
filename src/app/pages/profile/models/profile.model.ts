import { UserProfile } from '../../../core/models/user.model';

export type ContactModal = UserProfile['contacts'];
export type Contact = Partial<ContactModal>;

export type UserProfileContact = Partial<ContactModal>;

export type UserProfileCard = Pick<UserProfile, 'displayName'> &
  UserProfile['generalInfo']['location'] &
  Pick<UserProfile['generalInfo'], 'englishLevel'>;

export type UserProfileCardWithGithub = UserProfileCard & { githubId?: string };
