export interface CourseSelectProps {
  src: string;
  alt: string;
  name: string;
  isArchived: boolean;
}

export const courseSelectOptions: CourseSelectProps[] = [
  { src: 'assets/svg/angular.svg', alt: 'Angular Icon', name: 'Angular 2025Q3', isArchived: false },
  {
    src: 'assets/svg/reactjs-archived.svg',
    name: 'React 2025Q3 (Archived)',
    alt: 'React Icon',
    isArchived: true,
  },
  {
    src: 'assets/svg/reactjs-archived.svg',
    name: 'Angular 2025Q2 (Archived)',
    alt: 'React Icon',
    isArchived: true,
  },
];
