'use client';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/lib/api/exams';
import { formatDate } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';
import type { TranslationKey } from '@/lib/i18n/translations';

const BADGE_STYLE: Record<string, string> = {
  REQUESTED: 'bg-yellow-100 text-yellow-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
};

const DECISION_STYLE: Record<string, string> = {
  PASS:    'bg-green-100 text-green-700',
  RETRY:   'bg-yellow-100 text-yellow-700',
  DISBAND: 'bg-red-100 text-red-700',
};

export default function ExamsPage() {
  const { t, translateTitle } = useLang();
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['my-exams'],
    queryFn: examsApi.myExams,
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-24 bg-gray-200 rounded-2xl"/>)}</div>;

  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 lg:px-6 pt-6">
      <h1 className="text-xl lg:text-2xl font-bold mb-6">{t('exams_title')}</h1>

      {exams.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>{t('exams_empty')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => {
            const statusKey = `exam_status_${exam.status}` as TranslationKey;
            const decisionKey = exam.decision ? `exam_decision_${exam.decision}` as TranslationKey : null;
            return (
              <div key={exam.id} className="card space-y-2">
                <div className="flex items-start justify-between">
                  <p className="font-semibold">{translateTitle(exam.chapter.title)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_STYLE[exam.status]}`}>
                    {t(statusKey)}
                  </span>
                </div>
                {decisionKey && exam.decision && (
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${DECISION_STYLE[exam.decision]}`}>
                    {t(decisionKey)}
                  </span>
                )}
                {exam.comment && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{exam.comment}</p>
                )}
                <p className="text-xs text-gray-400">{formatDate(exam.createdAt)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
