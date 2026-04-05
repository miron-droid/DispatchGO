import { apiFetch } from './client';

export interface DashboardStats {
  activeStudents: number;
  avgTestScore: number;
  pendingExams: number;
  passedExams: number;
}

export interface StudentAnalytics {
  id: string;
  name: string;
  chaptersCompleted: number;
  avgTestScore: number | null;
  lastExamDecision: string | null;
  lastActiveAt: string | null;
}

export interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  managerId: string | null;
  lastActiveAt: string | null;
  isActive: boolean;
  manager?: { firstName: string; lastName: string };
}

export const adminApi = {
  dashboard: () => apiFetch<DashboardStats>('/admin/dashboard'),
  students: () => apiFetch<StudentAnalytics[]>('/admin/analytics/students'),

  // Users
  listUsers: (role?: string) => apiFetch<UserItem[]>(`/users${role ? `?role=${role}` : ''}`),
  getUser: (id: string) => apiFetch<UserItem>(`/users/${id}`),
  createUser: (data: { email: string; password: string; firstName: string; lastName: string; role: string; managerId?: string }) =>
    apiFetch<UserItem>('/users', { method: 'POST', body: JSON.stringify(data) }),
  deactivateUser: (id: string) => apiFetch<void>(`/users/${id}`, { method: 'DELETE' }),
  resetPassword: (id: string, password: string) => apiFetch<void>(`/users/${id}/password`, { method: 'PATCH', body: JSON.stringify({ password }) }),
  resetProgress: (id: string) => apiFetch<{ reset: boolean }>(`/users/${id}/reset-progress`, { method: 'POST' }),
  myStudents: () => apiFetch<UserItem[]>('/users/my-students'),
};
