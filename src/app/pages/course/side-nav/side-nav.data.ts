import { APP_ROUTES as AR } from '../../../constants/app-routes.const';

export interface SideNavProps {
  path: string;
  label: string;
  icon: string;
  color: string;
}

/**
 * NOTE: These icons are temporary placeholders. They will be replaced later
 */

export const sideNavItems: SideNavProps[] = [
  { path: '', label: 'Dashboard', icon: 'dashboard', color: 'var(--icon-blue)' },
  {
    path: `${AR.COURSE}/${AR.STUDENT}/${AR.INTERVIEWS}`,
    label: 'IAPPnterviews',
    icon: 'mic',
    color: 'var(--icon-blue)',
  },
  { path: '', label: 'Score', icon: 'scoreboard', color: 'var(--icon-orange)' },
  { path: '', label: 'Schedule', icon: 'calendar_today', color: 'var(--icon-pink)' },
  { path: '', label: 'Cross-Check: Submit', icon: 'terminal', color: 'var(--icon-blue)' },
  { path: '', label: 'Cross-Check: Review', icon: 'check_circle', color: 'var(--icon-red)' },
  { path: '', label: 'Auto-Test', icon: 'play_circle', color: 'var(--icon-violet)' },
  { path: '', label: 'Team Distributions', icon: 'group', color: 'var(--icon-violet)' },
  { path: '', label: 'Course Statistics', icon: 'table_chart', color: 'var(--icon-blue)' },
];
