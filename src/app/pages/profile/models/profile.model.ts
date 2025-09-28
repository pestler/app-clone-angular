import { UserProfile } from '../../../core/models/user.model';

export type ContactModal = UserProfile['contacts'];
export type Contact = Partial<ContactModal>;

export type UserProfileContact = Partial<ContactModal>;

export type UserProfileCard = Pick<UserProfile, 'githubId'> &
  UserProfile['generalInfo']['location'];
