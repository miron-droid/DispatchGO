'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, type StudentAnalytics } from '@/lib/api/admin';
import { useLang } from '@/lib/i18n/lang-context';
import { useState } from 'react';
import { UserPlus, Search, X, Trash2, Key, RotateCcw, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'struggling' | 'stalled' | 'on-track';

export default function StudentsPage() {
  const { lang } = useLang();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [settingsFor, setSettingsFor] = useState<StudentAnalytics | null>(null);

  const { data: students = [], isLoading } = useQuery({ queryKey: ['admin-students'], queryFn: adminApi.students });

  const now = Date.now();
  const getStatus = (s: StudentAnalytics) => {
    if (s.avgTestScore != null && s.avgTestScore < 60) return 'struggling';
    if (!s.lastActiveAt || (now - new Date(s.lastActiveAt).getTime()) / 86400000 > 5) return 'stalled';
    return 'on-track';
  };

  const counts = { all: students.length, struggling: 0, stalled: 0, 'on-track': 0 };
  students.forEach(s => { counts[getStatus(s)]++; });

  const filtered = students
    .filter(s => filter === 'all' || getStatus(s) === filter)
    .filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()));

  const TABS: { key: Filter; label: string; count: number; color?: string }[] = [
    { key: 'all', label: lang === 'ru' ? 'Все' : 'All', count: counts.all },
    { key: 'struggling', label: lang === 'ru' ? 'Проблемы' : 'Struggling', count: counts.struggling, color: 'bg-red-500' },
    { key: 'stalled', label: lang === 'ru' ? 'Неактивные' : 'Stalled', count: counts.stalled, color: 'bg-amber-500' },
    { key: 'on-track', label: lang === 'ru' ? 'В норме' : 'On Track', count: counts['on-track'], color: 'bg-emerald-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6 pb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{lang === 'ru' ? 'Студенты' : 'Students'}</h1>
          <p className="text-sm text-gray-400 font-mono">{students.length}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary w-auto flex items-center gap-2 px-4 text-sm">
          <UserPlus className="w-4 h-4" />
          {lang === 'ru' ? 'Добавить' : 'Add'}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-4 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap',
            filter === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-white/60',
          )}>
            {tab.label}
            {tab.count > 0 && tab.color && (
              <span className={cn('h-4 min-w-[16px] px-1 rounded-full text-white text-[10px] font-mono font-bold flex items-center justify-center', tab.color)}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input className="input pl-10 bg-gray-50/50" placeholder={lang === 'ru' ? 'Поиск...' : 'Search...'} value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"><X className="w-4 h-4 text-gray-400" /></button>}
      </div>

      {/* Student Cards */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-400">{lang === 'ru' ? 'Не найдено' : 'No results'}</p>
        ) : filtered.map(s => {
          const pct = Math.round((s.chaptersCompleted / 9) * 100);
          const status = getStatus(s);
          const cfg = {
            'on-track': { label: lang === 'ru' ? 'В норме' : 'On Track', bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', avatar: 'bg-emerald-100 text-emerald-700' },
            'struggling': { label: lang === 'ru' ? 'Проблемы' : 'Struggling', bg: 'bg-red-50 text-red-700', dot: 'bg-red-500', avatar: 'bg-red-100 text-red-700' },
            'stalled': { label: lang === 'ru' ? 'Неактивен' : 'Stalled', bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', avatar: 'bg-amber-100 text-amber-700' },
          }[status];
          const activeDays = s.lastActiveAt ? Math.round((now - new Date(s.lastActiveAt).getTime()) / 86400000) : null;

          return (
            <div key={s.id} className="card flex items-center gap-4 group">
              {/* Avatar */}
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0', cfg.avatar)}>
                {s.name?.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                  <span className={cn('inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md font-semibold', cfg.bg)}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                    {cfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <div className="w-14 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', cfg.dot)} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-mono">{s.chaptersCompleted}/9</span>
                  </span>
                  <span className={cn('font-mono font-semibold',
                    s.avgTestScore == null ? 'text-gray-300' :
                    s.avgTestScore >= 80 ? 'text-emerald-600' :
                    s.avgTestScore >= 60 ? 'text-amber-600' : 'text-red-500'
                  )}>
                    {s.avgTestScore != null ? `${s.avgTestScore}%` : '—'}
                  </span>
                  <span className={cn(activeDays != null && activeDays > 3 ? 'text-red-400' : '')}>
                    {activeDays != null ? (activeDays === 0 ? (lang === 'ru' ? 'сегодня' : 'today') : `${activeDays}d`) : '—'}
                  </span>
                </div>
              </div>

              {/* Settings button */}
              <button
                onClick={() => setSettingsFor(s)}
                className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100 lg:opacity-100"
                title={lang === 'ru' ? 'Настройки' : 'Settings'}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {showCreate && <CreateStudentModal onClose={() => setShowCreate(false)} />}
      {settingsFor && <StudentSettingsModal student={settingsFor} onClose={() => setSettingsFor(null)} />}
    </div>
  );
}

/* ── Create Student Modal ─────────────────────────── */
function CreateStudentModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const qc = useQueryClient();
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const create = useMutation({
    mutationFn: () => adminApi.createUser(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-students'] }); onClose(); },
    onError: (e: any) => setError(e.message),
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">{lang === 'ru' ? 'Новый студент' : 'New Student'}</h2>
          <button onClick={onClose} className="p-1 cursor-pointer"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">{error}</div>}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{lang === 'ru' ? 'Имя' : 'First Name'}</label>
              <input className="input" value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{lang === 'ru' ? 'Фамилия' : 'Last Name'}</label>
              <input className="input" value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{lang === 'ru' ? 'Пароль' : 'Password'}</label>
            <input className="input" type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Min 8 characters" />
          </div>
        </div>
        <button onClick={() => create.mutate()} disabled={!form.email || !form.password || !form.firstName || create.isPending} className="btn-primary mt-5">
          {create.isPending ? '...' : (lang === 'ru' ? 'Создать' : 'Create')}
        </button>
      </div>
    </div>
  );
}

/* ── Student Settings Modal ───────────────────────── */
function StudentSettingsModal({ student, onClose }: { student: StudentAnalytics; onClose: () => void }) {
  const { lang } = useLang();
  const qc = useQueryClient();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState<'delete' | 'reset' | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const resetPassword = useMutation({
    mutationFn: () => adminApi.resetPassword(student.id, newPassword),
    onSuccess: () => { setNewPassword(''); setDone(lang === 'ru' ? 'Пароль изменён' : 'Password changed'); setTimeout(() => setDone(null), 2000); },
  });

  const resetProgress = useMutation({
    mutationFn: () => adminApi.resetProgress(student.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-students'] }); setConfirm(null); setDone(lang === 'ru' ? 'Прогресс сброшен' : 'Progress reset'); setTimeout(() => setDone(null), 2000); },
  });

  const deactivateUser = useMutation({
    mutationFn: () => adminApi.deactivateUser(student.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-students'] }); onClose(); },
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
              {student.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{student.name}</h2>
              <p className="text-xs text-gray-400">{lang === 'ru' ? 'Настройки студента' : 'Student Settings'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 cursor-pointer"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Success toast */}
        {done && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm mb-4 flex items-center gap-2">
            <span>✓</span> {done}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold font-mono text-gray-900">{student.chaptersCompleted}/9</p>
            <p className="text-[10px] text-gray-400">{lang === 'ru' ? 'Главы' : 'Chapters'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className={cn('text-lg font-bold font-mono',
              student.avgTestScore == null ? 'text-gray-300' :
              student.avgTestScore >= 80 ? 'text-emerald-600' :
              student.avgTestScore >= 60 ? 'text-amber-600' : 'text-red-500'
            )}>
              {student.avgTestScore != null ? `${student.avgTestScore}%` : '—'}
            </p>
            <p className="text-[10px] text-gray-400">{lang === 'ru' ? 'Ср. балл' : 'Avg Score'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold font-mono text-gray-900">
              {student.lastActiveAt ? `${Math.round((Date.now() - new Date(student.lastActiveAt).getTime()) / 86400000)}d` : '—'}
            </p>
            <p className="text-[10px] text-gray-400">{lang === 'ru' ? 'Активность' : 'Active'}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">{lang === 'ru' ? 'Сменить пароль' : 'Change Password'}</h3>
            </div>
            <div className="flex gap-2">
              <input
                className="input flex-1 text-sm"
                type="text"
                placeholder={lang === 'ru' ? 'Новый пароль (мин. 8)' : 'New password (min 8)'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <button
                onClick={() => resetPassword.mutate()}
                disabled={newPassword.length < 8 || resetPassword.isPending}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl disabled:opacity-40 cursor-pointer hover:bg-gray-800 transition-colors"
              >
                {resetPassword.isPending ? '...' : (lang === 'ru' ? 'Сменить' : 'Set')}
              </button>
            </div>
          </div>

          {/* Reset Progress */}
          <div className="border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900">{lang === 'ru' ? 'Сбросить обучение' : 'Reset Progress'}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              {lang === 'ru'
                ? 'Удалит весь прогресс: уроки, тесты, экзамены. Студент начнёт обучение заново с главы 1.'
                : 'Removes all progress: lessons, tests, exams. Student restarts from Chapter 1.'}
            </p>
            {confirm === 'reset' ? (
              <div className="flex gap-2">
                <button onClick={() => resetProgress.mutate()} disabled={resetProgress.isPending} className="flex-1 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-xl cursor-pointer hover:bg-amber-600 transition-colors">
                  {resetProgress.isPending ? '...' : (lang === 'ru' ? 'Да, сбросить' : 'Yes, Reset')}
                </button>
                <button onClick={() => setConfirm(null)} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
                  {lang === 'ru' ? 'Отмена' : 'Cancel'}
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirm('reset')} className="w-full px-4 py-2 border border-amber-300 text-amber-700 text-sm font-medium rounded-xl cursor-pointer hover:bg-amber-50 transition-colors">
                {lang === 'ru' ? 'Сбросить прогресс' : 'Reset All Progress'}
              </button>
            )}
          </div>

          {/* Delete */}
          <div className="border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-semibold text-gray-900">{lang === 'ru' ? 'Удалить студента' : 'Delete Student'}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              {lang === 'ru'
                ? 'Деактивирует аккаунт студента. Он потеряет доступ к платформе.'
                : 'Deactivates the student account. They will lose platform access.'}
            </p>
            {confirm === 'delete' ? (
              <div className="flex gap-2">
                <button onClick={() => deactivateUser.mutate()} disabled={deactivateUser.isPending} className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-xl cursor-pointer hover:bg-red-600 transition-colors">
                  {deactivateUser.isPending ? '...' : (lang === 'ru' ? 'Да, удалить' : 'Yes, Delete')}
                </button>
                <button onClick={() => setConfirm(null)} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
                  {lang === 'ru' ? 'Отмена' : 'Cancel'}
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirm('delete')} className="w-full px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-xl cursor-pointer hover:bg-red-50 transition-colors">
                {lang === 'ru' ? 'Удалить аккаунт' : 'Delete Account'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
