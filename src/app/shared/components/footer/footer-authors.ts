export interface FooterAuthor {
  name: string;
  githubUrl: string;
  iconPath: string;
  role: string;
}

export const FOOTER_AUTHORS: FooterAuthor[] = [
  {
    name: 'ALEH KUIS',
    githubUrl: 'https://github.com/pestler',
    iconPath: 'assets/icons/github.svg',
    role: 'Team Lead',
  },
  {
    name: 'Aliaksei Tokarau',
    githubUrl: 'https://github.com/aliakseitokarev',
    iconPath: 'assets/icons/github.svg',
    role: 'Developer',
  },
  {
    name: 'EKATERINA GORBACHEVA',
    githubUrl: 'https://github.com/Kavume',
    iconPath: 'assets/icons/github.svg',
    role: 'Developer',
  },
];
