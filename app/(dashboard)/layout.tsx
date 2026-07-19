export const runtime = 'edge';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/lib/components/logout-button';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/links', label: 'Links', icon: '🔗' },
  { href: '/offers', label: 'Offers', icon: '🎯' },
  { href: '/domains', label: 'Domains', icon: '🌐' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-900/80">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
          <Link href="/dashboard" className="text-xl font-bold text-white">
            Offer<span className="text-emerald-400">Route</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              {user.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-zinc-300">{user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
