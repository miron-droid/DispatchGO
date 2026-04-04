'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useLang } from '@/lib/i18n/lang-context';
import Link from 'next/link';
import { Users, GraduationCap, BarChart2, Clock } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

async function fetchWithAuth(url: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${API}${url}`, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  return json.data ?? json;
}

export default function ManagerDashboard() {
  const { lang } = useLang();
  const user = useAuthStore(s => s.user);

  const { data: dashboard } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => fetchWithAuth('/admin/dashboard'),
  });

  const { data: students } = useQuery({
    queryKey: ['admin-students'],
    queryFn: () => fetchWithAuth('/admin/analytics/students'),
  });

  const { data: pendingExams } = useQuery({
    queryKey: ['pending-exams'],
    queryFn: () => fetchWithAuth('/exams/pending'),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">
            {lang === 'ru' ? 'Панель управления' : 'Dashboard'}
          </h1>
          <p className="text-sm text-gray-500">
            {lang === 'ru' ? 'Привет' : 'Hello'}, {user?.firstName}
          </p>
        </div>
        <Link
          href="/manager/exams"
          className="btn-primary w-auto flex items-center gap-2 px-4"
        >
          <GraduationCap className="w-4 h-4" />
          {lang === 'ru' ? 'Экзамены' : 'Exams'}
          {Array.isArray(pendingExams) && pendingExams.length > 0 && (
            <span className="bg-white text-brand-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {pendingExams.length}
            </span>
          )}
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4 text-center">
          <Users className="w-6 h-6 text-brand-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{dashboard?.activeStudents ?? '—'}</p>
          <p className="text-xs text-gray-400">{lang === 'ru' ? 'студентов' : 'students'}</p>
        </div>
        <div className="card p-4 text-center">
          <BarChart2 className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{dashboard?.avgTestScore ?? '—'}%</p>
          <p className="text-xs text-gray-400">{lang === 'ru' ? 'ср. балл' : 'avg score'}</p>
        </div>
        <div className="card p-4 text-center">
          <Clock className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{dashboard?.pendingExams ?? '—'}</p>
          <p className="text-xs text-gray-400">{lang === 'ru' ? 'ожидают проверки' : 'pending exams'}</p>
        </div>
        <div className="card p-4 text-center">
          <GraduationCap className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{dashboard?.passedExams ?? '—'}</p>
          <p className="text-xs text-gray-400">{lang === 'ru' ? 'сдали экзамен' : 'exams passed'}</p>
        </div>
      </div>

      {/* Students table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">
            {lang === 'ru' ? 'Студенты' : 'Students'}
          </h2>
        </div>

        {!students ? (
          <div className="p-4 space-y-3 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
          </div>
        ) : students.length === 0 ? (
          <p className="p-8 text-center text-gray-400">
            {lang === 'ru' ? 'Нет студентов' : 'No students yet'}
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {/* Header */}
            <div className="hidden lg:grid lg:grid-cols-12 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide bg-gray-50">
              <div className="col-span-4">{lang === 'ru' ? 'Студент' : 'Student'}</div>
              <div className="col-span-2 text-center">{lang === 'ru' ? 'Главы' : 'Chapters'}</div>
              <div className="col-span-2 text-center">{lang === 'ru' ? 'Ср. балл' : 'Avg Score'}</div>
              <div className="col-span-2 text-center">{lang === 'ru' ? 'Экзамен' : 'Last Exam'}</div>
              <div className="col-span-2 text-center">{lang === 'ru' ? 'Активность' : 'Last Active'}</div>
            </div>

            {(students as any[]).map((s: any) => {
              const decisionColors: Record<string, string> = {
                PASS: 'bg-green-100 text-green-700',
                RETRY: 'bg-yellow-100 text-yellow-700',
                DISBAND: 'bg-red-100 text-red-700',
              };
              return (
                <div key={s.id} className="px-4 py-3 lg:grid lg:grid-cols-12 lg:items-center flex flex-col gap-1">
                  {/* Name */}
                  <div className="lg:col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-600">
                      {s.name?.charAt(0) ?? '?'}
                    </div>
                    <span className="font-semibold text-sm text-gray-900">{s.name}</span>
                  </div>

                  {/* Chapters */}
                  <div className="lg:col-span-2 text-center">
                    <span className="text-sm font-bold">{s.chaptersCompleted}/9</span>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1 w-20 mx-auto lg:mx-auto">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${Math.round((s.chaptersCompleted / 9) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Avg Score */}
                  <div className="lg:col-span-2 text-center">
                    {s.avgTestScore != null ? (
                      <span className={`text-sm font-bold ${s.avgTestScore >= 80 ? 'text-green-600' : s.avgTestScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {s.avgTestScore}%
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>

                  {/* Last Exam */}
                  <div className="lg:col-span-2 text-center">
                    {s.lastExamDecision ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${decisionColors[s.lastExamDecision] ?? 'bg-gray-100 text-gray-600'}`}>
                        {s.lastExamDecision}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>

                  {/* Last Active */}
                  <div className="lg:col-span-2 text-center">
                    <span className="text-xs text-gray-400">
                      {s.lastActiveAt
                        ? new Date(s.lastActiveAt).toLocaleDateString()
                        : lang === 'ru' ? 'не заходил' : 'never'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
