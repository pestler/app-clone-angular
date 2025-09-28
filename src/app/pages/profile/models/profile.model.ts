import { UserProfile } from '../../../core/models/user.model';

export type ContactModal = UserProfile['contacts'];
export type Contact = Partial<ContactModal>;

export type UserProfileContact = Partial<ContactModal>;

export type UserProfileCard = Pick<UserProfile, 'githubId' | 'displayName'> &
  UserProfile['generalInfo']['location'];

export interface UserProfileCardModal {
  displayName: string | undefined;
  countryName: string | undefined;
  cityName: string | undefined;
}
