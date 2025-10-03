export interface MenuItem {
  icon: string;
  label: string;
  route?: string;
  url?: string;
  external?: boolean;
  action?: string;
}

export const menuItems: MenuItem[] = [
  { icon: 'visibility', label: 'Profile', route: '/profile' },
  { icon: 'notifications', label: 'Notifications', route: '/notifications' },
  {
    icon: 'help_outline',
    label: 'Help',
    url: 'https://rs.school/docs/en',
    external: true,
  },

  { icon: 'logout', label: 'Logout', action: 'logout' },
];
