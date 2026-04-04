import { Providers } from '@/components/providers';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <span className="text-xl">🚛</span>
            <span className="font-bold text-gray-900">DispatchGO <span className="text-gray-400 font-normal">Manager</span></span>
          </div>
        </header>
        {children}
      </div>
    </Providers>
  );
}
