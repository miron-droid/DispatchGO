import { Providers } from '@/components/providers';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <span className="font-extrabold text-base text-gray-900 tracking-tight">
              <span className="text-[#1a3a5c]">Dispatch</span><span className="text-[#22c55e]">GO</span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500 font-medium">Manager</span>
          </div>
        </header>
        {children}
      </div>
    </Providers>
  );
}
