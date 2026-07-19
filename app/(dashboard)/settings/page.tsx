'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Member {
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
}

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: memberData } = await supabase
      .from('workspace_members')
      .select('workspace_id, role')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!memberData) { setLoading(false); return; }
    const wsId = memberData.workspace_id;
    setWorkspaceId(wsId);

    const [wsRes, membersRes] = await Promise.all([
      supabase.from('workspaces').select('name').eq('id', wsId).single(),
      supabase.from('workspace_members').select('user_id, role, created_at').eq('workspace_id', wsId),
    ]);

    setWorkspaceName(wsRes.data?.name ?? '');
    setMembers((membersRes.data ?? []) as Member[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('workspaces')
      .update({ name: workspaceName })
      .eq('id', workspaceId);

    setMessage(error ? `Error: ${error.message}` : 'Workspace name updated!');
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
        <div className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">Manage your workspace settings</p>
      </div>

      {/* Workspace Name */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Workspace</h2>
        <form onSubmit={handleSaveName} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Workspace Name</label>
            <input required value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)}
              className="mt-1 w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none" />
          </div>
          {message && (
            <p className={`text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
              {message}
            </p>
          )}
          <button type="submit" disabled={saving}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Team Members */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Team Members</h2>
        <p className="mt-1 text-sm text-zinc-400">People with access to this workspace</p>
        <div className="mt-4 divide-y divide-zinc-800">
          {members.map((member) => (
            <div key={member.user_id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-sm font-bold text-zinc-300">
                  {(member.email ?? member.user_id)[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">{member.email ?? `User ${member.user_id.slice(0, 8)}...`}</p>
                  <p className="text-xs text-zinc-500">Added {new Date(member.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 capitalize">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">API Keys</h2>
        <p className="mt-1 text-sm text-zinc-400">Manage API access for programmatic control</p>
        <div className="mt-4 rounded-lg border border-dashed border-zinc-700 p-8 text-center">
          <p className="text-sm text-zinc-500">API key management coming soon.</p>
          <p className="mt-1 text-xs text-zinc-600">Use the Supabase dashboard for direct database access in the meantime.</p>
        </div>
      </div>
    </div>
  );
}
