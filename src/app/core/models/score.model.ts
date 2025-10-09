export interface ScoreStudentDto {
  githubId: string;
  name: string;
  city?: string;
  score: number;
  rank: number;
  isActive: boolean;
  [key: string]: string | number | boolean | undefined | null;
}

export interface CourseTaskDto {
  id: number;
  name: string;
  studentEndDate: string;
}

export interface IPaginationInfo {
  current: number;
  pageSize: number;
  total?: number;
  totalPages?: number;
}

export interface ScoreOrder {
  field: string;
  order: 'ascend' | 'descend';
}

export interface ScoreTableFilters {
  activeOnly?: boolean;
  cityName?: string;
  mentorGithubId?: string;
  githubId?: string;
  name?: string;
  city?: string;
}
