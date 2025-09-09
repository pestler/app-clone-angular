export interface FooterLink {
  label: string;
  url: string;
  icon?: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Help',
    links: [
      { label: 'Docs', url: 'https://docs.rs.school/', icon: '📗' },
      {
        label: 'Report a bug',
        url: 'https://github.com/rolling-scopes/rsschool-app/issues/new?assignees=apalchys&labels=&template=bug-report.md',
        icon: '🐞',
      },
      {
        label: 'Report a data issue',
        url: 'https://github.com/rolling-scopes/rsschool-app/issues/new?assignees=apalchys&labels=&template=data-issue-report.md&title=',
        icon: '📄',
      },
    ],
  },
  {
    title: 'Feedback',
    links: [
      {
        label: 'Say Thank you (Discord >> #gratitude)',
        url: 'https://app.rs.school/gratitude',
        icon: '👍',
      },
      { label: 'Heroes page', url: 'https://app.rs.school/heroes', icon: '🏆' },
      {
        label: 'Feedback on RS School',
        url: 'https://docs.google.com/forms/d/1F4NeS0oBq-CY805aqiPVp6CIrl4_nIYJ7Z_vUcMOFrQ/viewform',
        icon: '💗',
      },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com/rolling-scopes/rsschool-app', icon: '' },
  { label: 'YouTube', url: 'https://www.youtube.com/c/rollingscopesschool', icon: '' },
  { label: 'Discord', url: 'https://discord.gg/PRADsJB', icon: '' },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/the-rolling-scopes-school/',
    icon: '',
  },
];
