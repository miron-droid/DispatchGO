'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useLang } from '@/lib/i18n/lang-context';
import { useState } from 'react';
import { UserPlus, Search, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'struggling' | 'stalled' | 'on-track';

export default function StudentsPage() {
  const { lang } = useLang();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: adminApi.students,
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => adminApi.deactivateUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-students'] });
      setConfirmDelete(null);
    },
  });

  const now = Date.now();
  const getStatus = (s: any) => {
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
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-4">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer',
              filter === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-white/60',
            )}
          >
            {tab.label}
            {tab.count > 0 && tab.color && (
              <span className={cn('h-4 min-w-[16px] px-1 rounded-full text-white text-[10px] font-mono font-bold flex items-center justify-center', tab.color)}>
                {tab.count}
              </span>
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

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="hidden lg:grid lg:grid-cols-12 px-5 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-100">
          <div className="col-span-3">{lang === 'ru' ? 'Студент' : 'Student'}</div>
          <div className="col-span-3">{lang === 'ru' ? 'Прогресс' : 'Progress'}</div>
          <div className="col-span-2 text-center">{lang === 'ru' ? 'Ср. балл' : 'Score'}</div>
          <div className="col-span-2 text-center">{lang === 'ru' ? 'Статус' : 'Status'}</div>
          <div className="col-span-1 text-center">{lang === 'ru' ? 'Активность' : 'Active'}</div>
          <div className="col-span-1"></div>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3 animate-pulse">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-50 rounded-lg" />)}</div>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-400">{lang === 'ru' ? 'Не найдено' : 'No results'}</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(s => {
              const pct = Math.round((s.chaptersCompleted / 9) * 100);
              const status = getStatus(s);
              const statusConfig = {
                'on-track':   { label: lang === 'ru' ? 'В норме' : 'On Track', bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
                'struggling': { label: lang === 'ru' ? 'Проблемы' : 'Struggling', bg: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
                'stalled':    { label: lang === 'ru' ? 'Неактивен' : 'Stalled', bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
              }[status];

              const activeDays = s.lastActiveAt ? Math.round((now - new Date(s.lastActiveAt).getTime()) / 86400000) : null;

              return (
                <div key={s.id} className="px-5 py-3.5 lg:grid lg:grid-cols-12 lg:items-center flex flex-col gap-2 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  {/* Name */}
                  <div className="lg:col-span-3 flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', status === 'on-track' ? 'bg-emerald-100 text-emerald-700' : status === 'struggling' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}>
                      {s.name?.charAt(0)}
                    </div>
                    <span className="font-medium text-sm text-gray-900 truncate">{s.name}</span>
                  </div>

                  {/* Progress */}
                  <div className="lg:col-span-3 flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', status === 'on-track' ? 'bg-emerald-500' : status === 'struggling' ? 'bg-red-400' : 'bg-amber-400')} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-gray-600">{s.chaptersCompleted}/9</span>
                  </div>

                  {/* Score */}
                  <div className="lg:col-span-2 text-center">
                    <span className={cn('text-sm font-bold font-mono', s.avgTestScore == null ? 'text-gray-300' : s.avgTestScore >= 80 ? 'text-emerald-600' : s.avgTestScore >= 60 ? 'text-amber-600' : 'text-red-500')}>
                      {s.avgTestScore != null ? `${s.avgTestScore}%` : '—'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="lg:col-span-2 text-center">
                    <span className={cn('inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold', statusConfig.bg)}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', statusConfig.dot)} />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Active */}
                  <div className="lg:col-span-1 text-center">
                    <span className={cn('text-[11px]', activeDays != null && activeDays > 3 ? 'text-red-500 font-medium' : 'text-gray-400')}>
                      {activeDays != null ? (activeDays === 0 ? (lang === 'ru' ? 'сегодня' : 'today') : `${activeDays}d`) : '—'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1 text-right">
                    {confirmDelete === s.id ? (
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={(e) => { e.stopPropagation(); deactivate.mutate(s.id); }} className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-lg font-semibold cursor-pointer">{lang === 'ru' ? 'Да' : 'Yes'}</button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-semibold cursor-pointer">{lang === 'ru' ? 'Нет' : 'No'}</button>
                      </div>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(s.id); }} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100" title={lang === 'ru' ? 'Деактивировать' : 'Deactivate'}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && <CreateStudentModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

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
