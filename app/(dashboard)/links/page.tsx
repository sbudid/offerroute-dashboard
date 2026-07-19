'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DataTable, type Column } from '@/lib/components/data-table';
import type { Link as LinkType, Offer, Domain } from '@/lib/types';

interface LinkWithJoins extends LinkType {
  domains?: { hostname: string } | null;
  offers?: { name: string } | null;
  click_count?: number;
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkWithJoins[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkWithJoins | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    destination_url: '',
    domain_id: '',
    offer_id: '',
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

    const [linksRes, offersRes, domainsRes] = await Promise.all([
      supabase
        .from('links')
        .select('*, domains(hostname), offers(name)')
        .eq('workspace_id', wsId)
        .order('created_at', { ascending: false }),
      supabase.from('offers').select('*').eq('workspace_id', wsId),
      supabase.from('domains').select('*').eq('workspace_id', wsId),
    ]);

    setLinks((linksRes.data ?? []) as LinkWithJoins[]);
    setOffers((offersRes.data ?? []) as Offer[]);
    setDomains((domainsRes.data ?? []) as Domain[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingLink(null);
    setFormData({ name: '', slug: '', destination_url: '', domain_id: domains[0]?.id ?? '', offer_id: '', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (link: LinkWithJoins) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      slug: link.slug,
      destination_url: '',
      domain_id: link.domain_id,
      offer_id: link.offer_id ?? '',
      status: link.status,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    if (editingLink) {
      await supabase
        .from('links')
        .update({
          name: formData.name,
          slug: formData.slug,
          domain_id: formData.domain_id,
          offer_id: formData.offer_id || null,
          status: formData.status,
        })
        .eq('id', editingLink.id);
    } else {
      const { data: newLink } = await supabase
        .from('links')
        .insert({
          workspace_id: workspaceId,
          name: formData.name,
          slug: formData.slug,
          domain_id: formData.domain_id,
          offer_id: formData.offer_id || null,
          status: formData.status,
        })
        .select()
        .single();

      if (newLink && formData.destination_url) {
        await supabase.from('destinations').insert({
          link_id: newLink.id,
          label: 'Primary',
          url: formData.destination_url,
          weight: 100,
        });
      }
    }

    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    await supabase.from('links').delete().eq('id', id);
    loadData();
  };

  const copyShortUrl = (link: LinkWithJoins) => {
    const hostname = link.domains?.hostname ?? 'offerroute.link';
    navigator.clipboard.writeText(`https://${hostname}/${link.slug}`);
  };

  const columns: Column<LinkWithJoins>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => (
        <div>
          <p className="font-medium text-white">{row.name}</p>
          <p className="text-xs text-zinc-500">/{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
      render: (row) => <span className="text-zinc-400">{row.domains?.hostname ?? '—'}</span>,
    },
    {
      key: 'offer',
      label: 'Offer',
      render: (row) => <span className="text-zinc-400">{row.offers?.name ?? '—'}</span>,
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
      key: 'created_at',
      label: 'Created',
      render: (row) => <span className="text-zinc-500">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => copyShortUrl(row)} className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300" title="Copy short URL">📋</button>
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
          <h1 className="text-2xl font-bold text-white">Links</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage your affiliate tracking links</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500">
          + Create Link
        </button>
      </div>

      <DataTable columns={columns} data={links} loading={loading} emptyMessage="No links yet. Create your first tracking link!" />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-white">{editingLink ? 'Edit Link' : 'Create Link'}</h2>
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="My affiliate link" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Slug</label>
                <input required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="my-link" />
              </div>
              {!editingLink && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300">Destination URL</label>
                  <input required value={formData.destination_url} onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="https://example.com/offer" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-zinc-300">Domain</label>
                <select required value={formData.domain_id} onChange={(e) => setFormData({ ...formData, domain_id: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
                  <option value="">Select domain</option>
                  {domains.map((d) => <option key={d.id} value={d.id}>{d.hostname}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Offer (optional)</label>
                <select value={formData.offer_id} onChange={(e) => setFormData({ ...formData, offer_id: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
                  <option value="">None</option>
                  {offers.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
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
                  {editingLink ? 'Save Changes' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
