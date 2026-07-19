'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DataTable, type Column } from '@/lib/components/data-table';
import type { Offer } from '@/lib/types';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    network: '',
    canonical_url: '',
    fallback_url: '',
    commission_label: '',
    status: 'active' as 'active' | 'paused' | 'archived',
  });
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
      .from('offers')
      .select('*')
      .eq('workspace_id', wsId)
      .order('created_at', { ascending: false });

    setOffers((data ?? []) as Offer[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingOffer(null);
    setFormData({ name: '', network: '', canonical_url: '', fallback_url: '', commission_label: '', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name,
      network: offer.network ?? '',
      canonical_url: offer.canonical_url,
      fallback_url: offer.fallback_url ?? '',
      commission_label: offer.commission_label ?? '',
      status: offer.status as typeof formData.status,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    const payload = {
      name: formData.name,
      network: formData.network || null,
      canonical_url: formData.canonical_url,
      fallback_url: formData.fallback_url || null,
      commission_label: formData.commission_label || null,
      status: formData.status,
    };

    if (editingOffer) {
      await supabase.from('offers').update(payload).eq('id', editingOffer.id);
    } else {
      await supabase.from('offers').insert({ ...payload, workspace_id: workspaceId });
    }

    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? Links associated with this offer will be unlinked.')) return;
    await supabase.from('offers').delete().eq('id', id);
    loadData();
  };

  const columns: Column<Offer>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => <span className="font-medium text-white">{row.name}</span>,
    },
    {
      key: 'network',
      label: 'Network',
      render: (row) => <span className="text-zinc-400">{row.network ?? '—'}</span>,
    },
    {
      key: 'canonical_url',
      label: 'URL',
      render: (row) => (
        <a href={row.canonical_url} target="_blank" rel="noopener noreferrer"
          className="max-w-xs truncate text-emerald-400 hover:text-emerald-300">
          {row.canonical_url}
        </a>
      ),
    },
    {
      key: 'commission_label',
      label: 'Commission',
      render: (row) => <span className="text-zinc-400">{row.commission_label ?? '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
          row.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
          row.status === 'paused' ? 'bg-yellow-900/50 text-yellow-400' :
          'bg-zinc-800 text-zinc-500'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300" title="Edit">✏️</button>
          <button onClick={() => handleDelete(row.id)} className="rounded p-1 text-zinc-500 hover:bg-red-900/30 hover:text-red-400" title="Delete">🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Offers</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage your affiliate offers and programs</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500">
          + Add Offer
        </button>
      </div>

      <DataTable columns={columns} data={offers} loading={loading} emptyMessage="No offers yet. Add your first affiliate offer!" />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-white">{editingOffer ? 'Edit Offer' : 'Add Offer'}</h2>
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Amazon Associates" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Network</label>
                <input value={formData.network} onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Amazon, ClickBank, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Canonical URL</label>
                <input required type="url" value={formData.canonical_url} onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="https://example.com/offer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Fallback URL</label>
                <input type="url" value={formData.fallback_url} onChange={(e) => setFormData({ ...formData, fallback_url: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="https://example.com/fallback" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Commission Label</label>
                <input value={formData.commission_label} onChange={(e) => setFormData({ ...formData, commission_label: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="5% per sale" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">Cancel</button>
                <button type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                  {editingOffer ? 'Save Changes' : 'Add Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
