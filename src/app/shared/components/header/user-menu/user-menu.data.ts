export interface MenuItem {
  icon: string;
  label: string;
  route?: string;
  url?: string;
  external?: boolean;
  action?: () => void;
}

export const menuItems: MenuItem[] = [
  { icon: 'visibility', label: 'Profile', route: '/profile' },
  { icon: 'notifications', label: 'Notifications', route: '/notifications' },
  { icon: 'description', label: 'My CV', route: '/cv' },
  {
    icon: 'help_outline',
    label: 'Help',
    url: 'https://rs.school/docs/en',
    external: true,
  },
  { icon: 'logout', label: 'Logout', action: () => console.log('Log out') },
];
