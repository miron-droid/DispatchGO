'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { coursesApi } from '@/lib/api/courses';
import { useAuthStore } from '@/lib/stores/auth.store';
import { ChapterCard } from '@/components/domain/chapter-card';
import { ProgressRing } from '@/components/domain/progress-ring';
import { XPBar } from '@/components/domain/xp-bar';
import { HighwayMap } from '@/components/domain/highway-map';
import { useLang } from '@/lib/i18n/lang-context';

const COURSE_ID = 'course-dispatchers-v1';

export default function LearnPage() {
  const user = useAuthStore((s) => s.user);
  const { t, lang } = useLang();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
  });

  useEffect(() => {
    if (!progress) coursesApi.initializeCourse(COURSE_ID).catch(() => {});
  }, [progress]);

  if (isLoading) return <CourseSkeleton />;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg lg:max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">{t('learn_course_title')}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{t('learn_hello')}, {user?.firstName} 👋</p>
        </div>
        <ProgressRing percent={progress?.overallPercent ?? 0} />
      </div>

      {/* XP Bar + Highway Map */}
      <div className="space-y-3 mb-4">
        <XPBar />
        {progress && <HighwayMap chapters={progress.chapters ?? []} />}
      </div>

      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {(progress?.chapters ?? []).map((ch) => (
          <ChapterCard key={ch.id} chapter={ch} />
        ))}
      </div>
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-3 animate-pulse max-w-lg lg:max-w-5xl mx-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
      ))}
    </div>
  );
}
