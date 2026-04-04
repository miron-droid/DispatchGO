'use client';
import { useGamification, LEVELS } from '@/lib/stores/gamification.store';
import { useLang } from '@/lib/i18n/lang-context';

export function XPBar() {
  const { totalXP, getLevel, getLevelProgress, streak } = useGamification();
  const { lang } = useLang();
  const level = getLevel();
  const progress = getLevelProgress();
  const idx = LEVELS.indexOf(level);
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;

  return (
    <div className="card p-3 space-y-2">
      {/* Level + XP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{level.emoji}</span>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {lang === 'ru' ? level.nameRu : level.name}
            </p>
            <p className="text-xs text-gray-400">{totalXP.toLocaleString()} XP</p>
          </div>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-bold text-orange-600">{streak}</span>
          </div>
        )}
      </div>

      {/* Progress bar to next level */}
      {next && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
              {lang === 'ru' ? 'до' : 'next'}: {lang === 'ru' ? next.nameRu : next.name}
            </span>
            <span className="text-[10px] text-gray-400">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
