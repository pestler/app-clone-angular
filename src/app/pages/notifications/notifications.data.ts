export interface NotificationModel {
  label: string;
  email: boolean;
  telegram: boolean;
}

export const NOTIFICATIONS: NotificationModel[] = [
  { label: 'Changes in a course schedule', email: true, telegram: true },
  { label: 'Course certificate', email: true, telegram: true },
  { label: 'Interviewer assigned', email: true, telegram: true },
  { label: 'Mentor (assigned, registration)', email: true, telegram: true },
  { label: 'Messaging', email: true, telegram: true },
  { label: 'Task deadline', email: true, telegram: true },
  { label: 'Task grade received', email: true, telegram: true },
];
