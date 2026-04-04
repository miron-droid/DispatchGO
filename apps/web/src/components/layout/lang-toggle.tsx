'use client';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';

export function LangToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium text-gray-800">
        {lang === 'ru' ? 'Русский' : 'English'}
      </span>

      <div className="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1">
        {(['en', 'ru'] as const).map((l) => {
          const active = lang === l;
          return (
            <button
              key={l}
              onClick={() => { if (!active) toggleLang(); }}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
                active
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600',
              )}
            >
              {l.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
