'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChapterProgressItem } from '@/types';
import { useLang } from '@/lib/i18n/lang-context';

const CHAPTER_EMOJI: Record<number, string> = {
  1: '🚛', 2: '🗺️', 3: '🔧', 4: '📋', 5: '💻', 6: '📞', 7: '🤝', 8: '💰', 9: '🛡️',
};

interface Props { chapter: ChapterProgressItem }

export function ChapterCard({ chapter }: Props) {
  const { t, lang, translateTitle } = useLang();
  const locked = chapter.status === 'LOCKED';
  const done   = chapter.status === 'COMPLETED';
  const pct = chapter.lessonsTotal > 0 ? Math.round((chapter.lessonsCompleted / chapter.lessonsTotal) * 100) : 0;
  const emoji = CHAPTER_EMOJI[chapter.order] ?? '📖';

  return (
    <Link
      href={locked ? '#' : `/learn/chapters/${chapter.id}`}
      className={cn(
        'card flex items-center gap-4 transition-all active:scale-[0.98] lg:hover:scale-[1.01] lg:hover:border-brand-200',
        locked && 'opacity-60 pointer-events-none',
        done && 'bg-gradient-to-r from-green-50/60 to-white border-green-200',
        !locked && !done && 'bg-gradient-to-r from-blue-50/40 to-white',
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl',
        done   ? 'bg-green-100' :
        locked ? 'bg-gray-100 grayscale opacity-50'  : 'bg-brand-50',
      )}>
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">{t('chapter_prefix')} {chapter.order}</span>
          {done && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {t('chapter_complete')}
            </span>
          )}
          {!done && !locked && pct > 0 && (
            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
              {pct}%
            </span>
          )}
        </div>
        <p className="font-semibold text-gray-900 truncate mt-0.5">{translateTitle(chapter.title)}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", done ? "bg-green-500" : "bg-brand-500")}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 shrink-0">
            {chapter.lessonsCompleted}/{chapter.lessonsTotal}
          </span>
        </div>
      </div>

      {!locked && <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />}
    </Link>
  );
}
