'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Truck } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

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
      if (user.role === 'ADMIN') router.replace('/admin');
      else if (user.role === 'MANAGER') router.replace('/manager');
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 mb-4 animate-float shadow-lg shadow-emerald-500/30">
          <Truck className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Dispatch<span className="text-emerald-300">GO</span>
        </h1>
        <p className="text-blue-100 mt-2 text-sm lg:text-base">{t('auth_title')}</p>
        <p className="text-blue-200/60 mt-1 text-xs">9 chapters · 36 lessons · 100% online</p>
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
