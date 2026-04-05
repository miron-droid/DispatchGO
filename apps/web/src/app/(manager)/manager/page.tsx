'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi, type StudentAnalytics } from '@/lib/api/admin';
import { examsApi } from '@/lib/api/exams';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useLang } from '@/lib/i18n/lang-context';
import Link from 'next/link';
import { Users, GraduationCap, BarChart2, Clock, ChevronRight, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ManagerDashboard() {
  const { lang } = useLang();
  const user = useAuthStore(s => s.user);
  const { data: dash } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminApi.dashboard });
  const { data: students = [] } = useQuery({ queryKey: ['admin-students'], queryFn: adminApi.students });
  const { data: pendingExams = [] } = useQuery({ queryKey: ['pending-exams'], queryFn: examsApi.pending });

  const now = Date.now();
  const stalled = students.filter(s => !s.lastActiveAt || (now - new Date(s.lastActiveAt!).getTime()) / 86400000 > 5);
  const struggling = students.filter(s => s.avgTestScore != null && s.avgTestScore < 60);
  const needsAttention = [...pendingExams.map((e: any) => ({ type: 'exam' as const, data: e })),
    ...stalled.map(s => ({ type: 'stalled' as const, data: s })),
    ...struggling.map(s => ({ type: 'struggling' as const, data: s }))];

  // Charts data
  const cohort = Array.from({ length: 9 }, (_, i) => {
    const count = students.filter(s => s.chaptersCompleted >= i + 1).length;
    return { ch: i + 1, count };
  });
  const maxCohort = Math.max(...cohort.map(c => c.count), 1);

  // Score distribution
  const scoreBuckets = [
    { label: '90-100%', min: 90, max: 100, color: 'bg-emerald-500' },
    { label: '80-89%', min: 80, max: 89, color: 'bg-emerald-400' },
    { label: '70-79%', min: 70, max: 79, color: 'bg-amber-400' },
    { label: '60-69%', min: 60, max: 69, color: 'bg-amber-500' },
    { label: '<60%', min: 0, max: 59, color: 'bg-red-500' },
  ].map(b => ({
    ...b,
    count: students.filter(s => s.avgTestScore != null && s.avgTestScore >= b.min && s.avgTestScore <= b.max).length,
  }));
  const maxBucket = Math.max(...scoreBuckets.map(b => b.count), 1);

  // Activity: active today / this week / inactive
  const activeToday = students.filter(s => s.lastActiveAt && (now - new Date(s.lastActiveAt).getTime()) < 86400000).length;
  const activeWeek = students.filter(s => s.lastActiveAt && (now - new Date(s.lastActiveAt).getTime()) < 7 * 86400000).length;
  const inactive = students.length - activeWeek;

  const hasPending = pendingExams.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">{lang === 'ru' ? 'Привет' : 'Hello'}, <span className="text-gray-600 font-medium">{user?.firstName}</span></p>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{lang === 'ru' ? 'Аналитика' : 'Analytics'}</h1>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <KPICard icon={Users} value={dash?.activeStudents ?? 0} label={lang === 'ru' ? 'Студенты' : 'Students'} />
        <KPICard icon={BarChart2} value={dash?.avgTestScore != null ? `${dash.avgTestScore}%` : '—'} label={lang === 'ru' ? 'Ср. балл' : 'Avg Score'} color={dash?.avgTestScore && dash.avgTestScore >= 75 ? 'text-emerald-600' : 'text-amber-600'} />
        <KPICard icon={Target} value={`${Math.round((students.filter(s => s.chaptersCompleted >= 9).length / Math.max(students.length, 1)) * 100)}%`} label={lang === 'ru' ? 'Выпускники' : 'Graduated'} />
        <KPICard icon={TrendingUp} value={activeToday} label={lang === 'ru' ? 'Сегодня' : 'Active Today'} color="text-emerald-600" />
        <KPICard icon={Clock} value={pendingExams.length} label={lang === 'ru' ? 'На проверку' : 'To Review'} color={hasPending ? 'text-red-600' : ''} urgent={hasPending} className="lg:col-span-1 col-span-2" />
      </div>

      {/* Needs Attention Banner */}
      {needsAttention.length > 0 && (
        <div className={cn('rounded-2xl border p-4 mb-6', hasPending ? 'bg-red-50/50 border-red-200' : 'bg-amber-50/50 border-amber-200')}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={cn('w-4 h-4', hasPending ? 'text-red-500' : 'text-amber-500')} />
            <h2 className="text-sm font-semibold text-gray-900">
              {lang === 'ru' ? 'Требует внимания' : 'Needs Attention'} ({needsAttention.length})
            </h2>
          </div>
          <div className="space-y-2">
            {/* Pending exams first */}
            {pendingExams.slice(0, 3).map((ex: any) => {
              const hours = Math.round((now - new Date(ex.createdAt).getTime()) / 3600000);
              return (
                <Link key={ex.id} href="/manager/exams" className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl hover:shadow-sm transition-all cursor-pointer group">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900">{ex.student?.firstName} {ex.student?.lastName}</span>
                    <span className="text-xs text-gray-400 ml-2">{lang === 'ru' ? 'экзамен' : 'exam'} · {hours}h</span>
                  </div>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">{lang === 'ru' ? 'Проверить' : 'Review'}</span>
                  <ChevronRight className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
            {/* Stalled */}
            {stalled.slice(0, 2).map(s => (
              <Link key={`st-${s.id}`} href="/manager/students" className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl hover:shadow-sm transition-all cursor-pointer">
                <span className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-sm text-gray-900 flex-1">{s.name}</span>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                  {lang === 'ru' ? 'неактивен' : 'inactive'}
                </span>
              </Link>
            ))}
            {needsAttention.length > 5 && (
              <p className="text-xs text-gray-400 text-center pt-1">
                +{needsAttention.length - 5} {lang === 'ru' ? 'ещё' : 'more'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Cohort Progress */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">{lang === 'ru' ? 'Прогресс когорты' : 'Cohort Progress'}</h2>
          <div className="space-y-2.5">
            {cohort.map(c => (
              <div key={c.ch} className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-gray-400 w-8">{lang === 'ru' ? 'Гл' : 'Ch'}.{c.ch}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div className="h-full bg-emerald-500 rounded-lg transition-all duration-700 flex items-center" style={{ width: `${Math.max((c.count / maxCohort) * 100, 2)}%` }}>
                    {c.count > 0 && <span className="text-[10px] font-mono font-bold text-white ml-2">{c.count}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">{lang === 'ru' ? 'Распределение баллов' : 'Score Distribution'}</h2>
          <div className="space-y-3">
            {scoreBuckets.map(b => (
              <div key={b.label} className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono text-gray-400 w-14">{b.label}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-md overflow-hidden">
                  <div className={cn('h-full rounded-md transition-all duration-700', b.color)} style={{ width: `${Math.max((b.count / maxBucket) * 100, b.count > 0 ? 8 : 0)}%` }} />
                </div>
                <span className="text-[10px] font-mono text-gray-500 w-4 text-right">{b.count}</span>
              </div>
            ))}
          </div>
          {/* Mini donut */}
          <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-gray-100">
            <MiniDonut segments={[
              { pct: (activeToday / Math.max(students.length, 1)) * 100, color: '#22c55e' },
              { pct: ((activeWeek - activeToday) / Math.max(students.length, 1)) * 100, color: '#fbbf24' },
              { pct: (inactive / Math.max(students.length, 1)) * 100, color: '#e5e7eb' },
            ]} />
            <div className="text-[10px] space-y-1">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />{lang === 'ru' ? 'Сегодня' : 'Today'} ({activeToday})</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />{lang === 'ru' ? 'Неделя' : 'Week'} ({activeWeek - activeToday})</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-200" />{lang === 'ru' ? 'Неактивны' : 'Inactive'} ({inactive})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Link href="/manager/exams" className="card p-4 flex items-center gap-3 hover:border-red-200 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold">{lang === 'ru' ? 'Экзамены' : 'Exams'}</p>
            <p className="text-xs text-gray-400">{pendingExams.length} {lang === 'ru' ? 'ожидают' : 'pending'}</p>
          </div>
        </Link>
        <Link href="/manager/students" className="card p-4 flex items-center gap-3 hover:border-blue-200 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold">{lang === 'ru' ? 'Студенты' : 'Students'}</p>
            <p className="text-xs text-gray-400">{students.length} {lang === 'ru' ? 'всего' : 'total'}</p>
          </div>
        </Link>
        <Link href="/manager/students" className="card p-4 flex items-center gap-3 hover:border-amber-200 transition-colors cursor-pointer col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold">{lang === 'ru' ? 'Проблемные' : 'At Risk'}</p>
            <p className="text-xs text-gray-400">{stalled.length + struggling.length} {lang === 'ru' ? 'студентов' : 'students'}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, value, label, color, urgent, className }: {
  icon: any; value: any; label: string; color?: string; urgent?: boolean; className?: string;
}) {
  return (
    <div className={cn('card p-4', urgent && 'border-red-200 bg-red-50/30', className)}>
      <div className="flex items-center justify-between mb-1.5">
        <Icon className={cn('w-4 h-4', urgent ? 'text-red-500' : 'text-gray-400')} />
        {urgent && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
      </div>
      <p className={cn('text-2xl font-bold font-mono', color || 'text-gray-900')}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function MiniDonut({ segments }: { segments: { pct: number; color: string }[] }) {
  let offset = 0;
  return (
    <svg width="56" height="56" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="none" stroke="#f3f4f6" strokeWidth="4" />
      {segments.map((s, i) => {
        const dash = `${s.pct * 0.88} ${88 - s.pct * 0.88}`;
        const o = offset;
        offset += s.pct * 0.88;
        return <circle key={i} cx="18" cy="18" r="14" fill="none" stroke={s.color} strokeWidth="4" strokeDasharray={dash} strokeDashoffset={-o} strokeLinecap="round" transform="rotate(-90 18 18)" className="transition-all duration-700" />;
      })}
    </svg>
  );
}
