export interface UserProfile {
  name: string;
  github: string;
  githubUrl: string;
  avatarUrl: string;
  location: string;
}

export const studentMockInfo: UserProfile = {
  name: 'Jone Smith',
  github: 'github-smith',
  githubUrl: 'https://github.com/rolling-scopes-school',
  avatarUrl: '../assets/svg/im-fine.svg',
  location: 'NY, USA',
};
