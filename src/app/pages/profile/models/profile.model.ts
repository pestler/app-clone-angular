import { UserProfile } from '../../../core/models/user.model';

export type ContactModal = UserProfile['contacts'];
export type Contact = Partial<ContactModal>;

export type UserProfileContact = Partial<ContactModal>;

export type UserProfileCard = Pick<UserProfile, 'displayName'> &
  UserProfile['generalInfo']['location'];

export type UserProfileCardWithGithub = UserProfileCard & { githubId?: string };
