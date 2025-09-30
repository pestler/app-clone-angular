export interface FooterAuthor {
  name: string;
  githubUrl: string;
  iconPath: string;
  role: string;
  badgeUrl: string;
  avatarUrl: string;
}

export const FOOTER_AUTHORS: FooterAuthor[] = [
  {
    name: 'ALEH KUIS',
    githubUrl: 'https://github.com/pestler',
    iconPath: 'assets/icons/github.svg',
    role: 'Team Lead',
    badgeUrl: 'https://img.shields.io/github/followers/pestler?style=social',
    avatarUrl: 'https://avatars.githubusercontent.com/u/28656604?v=4',
  },
  {
    name: 'Aliaksei Tokarau',
    githubUrl: 'https://github.com/aliakseitokarev',
    iconPath: 'assets/icons/github.svg',
    role: 'Developer',
    badgeUrl: 'https://img.shields.io/github/followers/aliakseitokarev?style=social',
    avatarUrl: 'https://avatars.githubusercontent.com/u/37328596?v=4',
  },
  {
    name: 'EKATERINA GORBACHEVA',
    githubUrl: 'https://github.com/Kavume',
    iconPath: 'assets/icons/github.svg',
    role: 'Developer',
    badgeUrl: 'https://img.shields.io/github/followers/Kavume?style=social',
    avatarUrl: 'https://avatars.githubusercontent.com/u/108616376?v=4',
  },
];
