export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getWorkspaceStats(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  // Get user's workspace
  const { data: memberData } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (!memberData) return null;
  const workspaceId = memberData.workspace_id;

  const [linksRes, offersRes, clicksRes, recentClicks] = await Promise.all([
    supabase.from('links').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    supabase.from('offers').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'active'),
    supabase.from('click_events').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    supabase
      .from('click_events')
      .select('occurred_at, country_code, device_type, link_id, links(name)')
      .eq('workspace_id', workspaceId)
      .order('occurred_at', { ascending: false })
      .limit(10),
  ]);

  return {
    totalLinks: linksRes.count ?? 0,
    activeOffers: offersRes.count ?? 0,
    totalClicks: clicksRes.count ?? 0,
    recentActivity: (recentClicks.data ?? []) as unknown as Array<{
      occurred_at: string;
      country_code: string;
      device_type: string;
      link_id: string;
      links: { name: string } | null;
    }>,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const stats = await getWorkspaceStats(supabase, user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">Welcome back, {user.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/links"
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            + Create Link
          </Link>
          <Link
            href="/offers"
            className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            + Add Offer
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { label: 'Total Links', value: stats?.totalLinks ?? 0, icon: '🔗' },
          { label: 'Total Clicks', value: stats?.totalClicks ?? 0, icon: '👆' },
          { label: 'Active Offers', value: stats?.activeOffers ?? 0, icon: '🎯' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-white">
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-zinc-800">
          {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-zinc-500">
              No activity yet. Create your first link to get started!
            </p>
          ) : (
            stats.recentActivity.map((event, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3">
                <span className="text-lg">
                  {event.device_type === 'mobile' ? '📱' : event.device_type === 'tablet' ? '📱' : '💻'}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-zinc-300">
                    Click on <span className="font-medium text-white">{event.links?.name ?? 'Unknown link'}</span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    {event.country_code ?? 'Unknown'} · {event.device_type} ·{' '}
                    {new Date(event.occurred_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
