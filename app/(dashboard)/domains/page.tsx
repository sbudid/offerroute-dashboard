'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DataTable, type Column } from '@/lib/components/data-table';
import type { Domain } from '@/lib/types';

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [hostname, setHostname] = useState('');
  const supabase = createClient();

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: memberData } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!memberData) { setLoading(false); return; }
    const wsId = memberData.workspace_id;
    setWorkspaceId(wsId);

    const { data } = await supabase
      .from('domains')
      .select('*')
      .eq('workspace_id', wsId)
      .order('created_at', { ascending: false });

    setDomains((data ?? []) as Domain[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !hostname) return;

    await supabase.from('domains').insert({
      workspace_id: workspaceId,
      hostname: hostname.trim().toLowerCase(),
    });

    setHostname('');
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this domain? Links using it will need to be reassigned.')) return;
    await supabase.from('domains').delete().eq('id', id);
    loadData();
  };

  const handleSetDefault = async (id: string) => {
    await supabase.from('domains').update({ is_default: false }).eq('workspace_id', workspaceId);
    await supabase.from('domains').update({ is_default: true }).eq('id', id);
    loadData();
  };

  const columns: Column<Domain>[] = [
    {
      key: 'hostname',
      label: 'Domain',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{row.hostname}</span>
          {row.is_default && (
            <span className="rounded-full bg-emerald-900/50 px-2 py-0.5 text-xs font-medium text-emerald-400">
              Default
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
          row.status === 'verified' ? 'bg-emerald-900/50 text-emerald-400' :
          row.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
          'bg-red-900/50 text-red-400'
        }`}>
          {row.status === 'verified' && '✓'}
          {row.status === 'pending' && '⏳'}
          {row.status === 'failed' && '✕'}
          {row.status}
        </span>
      ),
    },
    {
      key: 'verification_token',
      label: 'Verification Token',
      render: (row) => (
        <div className="flex items-center gap-2">
          <code className="max-w-[200px] truncate rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {row.verification_token}
          </code>
          {row.status === 'pending' && (
            <button
              onClick={() => navigator.clipboard.writeText(row.verification_token)}
              className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              title="Copy token"
            >
              📋
            </button>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Added',
      render: (row) => <span className="text-zinc-500">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.is_default && (
            <button onClick={() => handleSetDefault(row.id)}
              className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              title="Set as default">Set default</button>
          )}
          <button onClick={() => handleDelete(row.id)}
            className="rounded p-1 text-zinc-500 hover:bg-red-900/30 hover:text-red-400"
            title="Delete">🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Domains</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage your branded tracking domains</p>
        </div>
        <button onClick={() => setShowModal(true)} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500">
          + Add Domain
        </button>
      </div>

      {/* Verification instructions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="text-sm font-medium text-zinc-300">How domain verification works</h3>
        <ol className="mt-2 space-y-1 text-sm text-zinc-500">
          <li>1. Add your domain below</li>
          <li>2. Add a TXT record to your DNS: <code className="rounded bg-zinc-800 px-1 text-zinc-400">offerroute-verify=&lt;token&gt;</code></li>
          <li>3. Wait for verification (usually a few minutes)</li>
        </ol>
      </div>

      <DataTable columns={columns} data={domains} loading={loading} emptyMessage="No domains added yet. Add your first branded domain!" />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-white">Add Domain</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Hostname</label>
                <input required value={hostname} onChange={(e) => setHostname(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="links.yourdomain.com" />
                <p className="mt-1 text-xs text-zinc-500">Enter the full hostname (e.g., links.yourdomain.com)</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">Cancel</button>
                <button type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                  Add Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
