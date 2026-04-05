'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { examsApi } from '@/lib/api/exams';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useLang } from '@/lib/i18n/lang-context';
import Link from 'next/link';
import { Users, GraduationCap, BarChart2, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ManagerDashboard() {
  const { lang } = useLang();
  const user = useAuthStore(s => s.user);
  const { data: dash } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminApi.dashboard });
  const { data: students = [] } = useQuery({ queryKey: ['admin-students'], queryFn: adminApi.students });
  const { data: pendingExams = [] } = useQuery({ queryKey: ['pending-exams'], queryFn: examsApi.pending });

  const stalled = students.filter(s => {
    if (!s.lastActiveAt) return true;
    const days = (Date.now() - new Date(s.lastActiveAt).getTime()) / 86400000;
    return days > 5;
  });
  const struggling = students.filter(s => s.avgTestScore != null && s.avgTestScore < 60);

  // Cohort distribution — count students per chapter
  const cohort = Array.from({ length: 9 }, (_, i) => ({
    ch: i + 1,
    count: students.filter(s => s.chaptersCompleted === i + 1 || (i === 0 && s.chaptersCompleted === 0)).length,
  }));
  const maxCohort = Math.max(...cohort.map(c => c.count), 1);

  const hasPending = pendingExams.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6 pb-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-400">
          {lang === 'ru' ? 'Доброе утро' : 'Good morning'}, <span className="text-gray-600 font-medium">{user?.firstName}</span>
        </p>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
          {lang === 'ru' ? 'Панель управления' : 'Dashboard'}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Clock, value: dash?.pendingExams ?? 0, label: lang === 'ru' ? 'Ожидают' : 'Pending', urgent: hasPending, color: hasPending ? 'border-red-200 bg-red-50/50' : '' },
          { icon: AlertTriangle, value: struggling.length, label: lang === 'ru' ? 'Проблемы' : 'Struggling', urgent: struggling.length > 0, color: struggling.length > 0 ? 'border-amber-200 bg-amber-50/50' : '' },
          { icon: Users, value: dash?.activeStudents ?? 0, label: lang === 'ru' ? 'Студенты' : 'Students', color: '' },
          { icon: BarChart2, value: dash?.avgTestScore != null ? `${dash.avgTestScore}%` : '—', label: lang === 'ru' ? 'Ср. балл' : 'Avg Score', color: '' },
        ].map((s, i) => (
          <div key={i} className={cn('card p-4', s.color)}>
            <div className="flex items-center justify-between mb-2">
              <s.icon className={cn('w-4 h-4', s.urgent ? 'text-red-500' : 'text-gray-400')} />
              {s.urgent && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
            </div>
            <p className="text-2xl font-bold text-gray-900 font-mono">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Exams to Review */}
        <div className={cn('card p-0 overflow-hidden', hasPending && 'border-red-200')}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              {lang === 'ru' ? 'Требуют проверки' : 'Exams to Review'}
            </h2>
            {hasPending && (
              <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {pendingExams.length}
              </span>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {pendingExams.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-400">
                {lang === 'ru' ? 'Всё проверено' : 'All caught up'}
              </p>
            ) : pendingExams.slice(0, 5).map((ex: any) => {
              const hours = Math.round((Date.now() - new Date(ex.createdAt).getTime()) / 3600000);
              const urgent = hours > 48;
              return (
                <Link key={ex.id} href="/manager/exams" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    {ex.student?.firstName?.charAt(0)}{ex.student?.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ex.student?.firstName} {ex.student?.lastName}</p>
                    <p className="text-xs text-gray-400">{ex.chapter?.title}</p>
                  </div>
                  <span className={cn('text-xs font-mono', urgent ? 'text-red-600 font-bold' : 'text-gray-400')}>
                    {hours}h
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
          {pendingExams.length > 0 && (
            <Link href="/manager/exams" className="block text-center text-sm font-medium text-emerald-600 py-3 border-t border-gray-100 hover:bg-emerald-50 transition-colors cursor-pointer">
              {lang === 'ru' ? 'Проверить все →' : 'Review All →'}
            </Link>
          )}
        </div>

        {/* Needs Attention */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              {lang === 'ru' ? 'Требуют внимания' : 'Needs Attention'}
            </h2>
            <span className="text-[10px] font-mono text-amber-600">{stalled.length + struggling.length}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {stalled.length === 0 && struggling.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-400">
                {lang === 'ru' ? 'Все в порядке' : 'Everyone on track'}
              </p>
            ) : (
              <>
                {stalled.slice(0, 3).map(s => (
                  <Link key={s.id} href={`/manager/students`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                    </div>
                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      {lang === 'ru' ? 'неактивен' : 'inactive'}
                    </span>
                  </Link>
                ))}
                {struggling.slice(0, 3).map(s => (
                  <Link key={s.id} href={`/manager/students`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <span className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                      {s.avgTestScore}%
                    </span>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cohort Progress */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          {lang === 'ru' ? 'Распределение по главам' : 'Cohort Progress'}
        </h2>
        <div className="space-y-2">
          {cohort.map(c => (
            <div key={c.ch} className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 w-10">{lang === 'ru' ? 'Гл' : 'Ch'}.{c.ch}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(c.count / maxCohort) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-gray-500 w-6 text-right">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
