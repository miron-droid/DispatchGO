import { LangProvider } from '@/lib/i18n/lang-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <div className="min-h-screen flex items-center justify-center bg-brand-600 px-4">
        {children}
      </div>
    </LangProvider>
  );
}
