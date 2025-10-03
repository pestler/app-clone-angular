export interface DonatorModel {
  id: number;
  profileUrl: string;
  avatarUrl: string;
  initials: string;
}
type Donator = Partial<DonatorModel>;

const OC_BASE = 'https://opencollective.com';

export const donatorsMock: Donator[] = [
  {
    id: 1,
    profileUrl: 'https://x.com/dm_ignatovich',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1211760742678089728/t6ju3flM_400x400.jpg',
  },
  {
    id: 2,
    profileUrl: `${OC_BASE}/alexander-voytekhovich`,
    avatarUrl: `${OC_BASE}/alexander-voytekhovich/avatar.png`,
  },
  {
    id: 3,
    profileUrl: `${OC_BASE}//korevo`,
    avatarUrl: `${OC_BASE}/korevo/avatar.png`,
  },
  {
    id: 4,
    profileUrl: `${OC_BASE}/spanb4`,
    avatarUrl: `${OC_BASE}/spanb4/avatar.png`,
  },
  {
    id: 5,
    profileUrl: `${OC_BASE}/guest-b4cc6ed4`,
    avatarUrl: undefined,
    initials: 'OL',
  },
  {
    id: 6,
    profileUrl: `${OC_BASE}/aliaksandr-pletsiazhou`,
    avatarUrl: `${OC_BASE}/aliaksandr-pletsiazhou/avatar.png`,
  },
  {
    id: 7,
    profileUrl: `${OC_BASE}/guest-a3ddedbc`,
    avatarUrl: undefined,
    initials: 'PA',
  },
  {
    id: 8,
    profileUrl: `${OC_BASE}/lilith`,
    avatarUrl: `${OC_BASE}/lilith/avatar.png`,
  },
  {
    id: 9,
    profileUrl: `${OC_BASE}/lizaveta-dondysh`,
    avatarUrl: `${OC_BASE}/lizaveta-dondysh/avatar.png`,
  },
  {
    id: 10,
    profileUrl: `${OC_BASE}/valery-dluski`,
    avatarUrl: `${OC_BASE}/valery-dluski/avatar.png`,
  },
];
