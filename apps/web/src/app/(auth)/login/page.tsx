'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useLang } from '@/lib/i18n/lang-context';
import { LogoIcon } from '@/components/domain/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const { t } = useLang();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { accessToken, user } = await authApi.login(email, password);
      setAuth(user, accessToken);
      if (user.role === 'ADMIN' || user.role === 'MANAGER') router.replace('/manager');
      else router.replace('/learn');
    } catch (err: any) {
      setError(err.message ?? t('auth_login_failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm lg:max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex mb-5 rounded-2xl p-3 bg-white/5 backdrop-blur-sm border border-white/10"
             style={{ filter: 'drop-shadow(0 0 24px rgba(34,197,94,0.2))' }}>
          <LogoIcon size={90} />
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Dispatch<span className="text-emerald-400">GO</span>
        </h1>
        <p className="text-blue-200/80 mt-2 text-sm lg:text-base">{t('auth_title')}</p>
        <p className="text-blue-300/40 mt-1 text-xs tracking-wide">9 chapters · 36 lessons · 100% online</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg space-y-4 animate-fade-in-up">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth_email')}</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth_password')}</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>
        <button className="btn-primary mt-2" type="submit" disabled={loading}>
          {loading ? t('auth_signing_in') : t('auth_sign_in')}
        </button>
      </form>
    </div>
  );
}
