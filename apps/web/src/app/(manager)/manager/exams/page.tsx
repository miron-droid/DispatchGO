'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '@/lib/api/exams';
import { useState } from 'react';
import type { ExamDecision } from '@/types';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';

export default function ManagerExamsPage() {
  const qc = useQueryClient();
  const { t, translateTitle } = useLang();
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['pending-exams'],
    queryFn: examsApi.pending,
  });

  const [reviewing, setReviewing] = useState<string | null>(null);
  const [decision, setDecision] = useState<ExamDecision>('PASS');
  const [comment, setComment] = useState('');

  const review = useMutation({
    mutationFn: () => examsApi.review(reviewing!, decision, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-exams'] });
      setReviewing(null);
      setComment('');
    },
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-28 bg-gray-200 rounded-2xl"/>)}</div>;

  const DECISIONS: { value: ExamDecision; label: string; color: string }[] = [
    { value: 'PASS',    label: t('manager_pass'),    color: 'border-green-500 bg-green-50 text-green-700' },
    { value: 'RETRY',   label: t('manager_retry'),   color: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
    { value: 'DISBAND', label: t('manager_disband'), color: 'border-red-500 bg-red-50 text-red-700' },
  ];

  return (
    <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-6 pt-6">
      <h1 className="text-xl lg:text-2xl font-bold mb-6">{t('manager_pending_title')} ({exams.length})</h1>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="card space-y-3">
            <div>
              <p className="font-semibold">
                {exam.student?.firstName} {exam.student?.lastName}
              </p>
              <p className="text-sm text-gray-500">{translateTitle(exam.chapter?.title ?? '')}</p>
            </div>

            {reviewing === exam.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {DECISIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDecision(d.value)}
                      className={cn(
                        'py-2 rounded-xl border-2 text-sm font-medium transition-all',
                        decision === d.value ? d.color : 'border-gray-200 text-gray-500',
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder={t('manager_comment_placeholder')}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="btn-primary"
                    onClick={() => review.mutate()}
                    disabled={comment.length < 10 || review.isPending}
                  >
                    {t('manager_submit')}
                  </button>
                  <button className="btn-ghost" onClick={() => setReviewing(null)}>
                    {t('manager_cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn-primary"
                onClick={() => setReviewing(exam.id)}
              >
                {t('manager_review_exam')}
              </button>
            )}
          </div>
        ))}

        {exams.length === 0 && (
          <p className="text-center text-gray-400 py-12">{t('manager_no_pending')}</p>
        )}
      </div>
    </div>
  );
}
