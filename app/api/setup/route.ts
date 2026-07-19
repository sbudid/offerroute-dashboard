export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check if user already has a workspace
  const { data: existingMember } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (existingMember) {
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', existingMember.workspace_id)
      .single();
    return NextResponse.json(workspace ?? { workspace_id: existingMember.workspace_id });
  }

  // Create a new workspace
  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert({ name: 'My Workspace', owner_id: user.id, plan: 'starter' })
    .select()
    .single();

  if (wsError) return NextResponse.json({ error: wsError.message }, { status: 500 });

  // Insert workspace_member
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, user_id: user.id, role: 'owner' });

  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  // Seed sample data for new workspace
  const wsId = workspace.id;

  // Domains
  const { data: domains } = await supabase.from('domains').insert([
    { workspace_id: wsId, hostname: 'go.incomecloser.com', status: 'verified', is_default: true },
    { workspace_id: wsId, hostname: 'go.healthyzo.com', status: 'pending', is_default: false },
  ]).select();

  const defaultDomainId = domains?.[0]?.id;

  // Offers
  const { data: offers } = await supabase.from('offers').insert([
    { workspace_id: wsId, name: 'Email Toolkit', network: 'ClickBank', canonical_url: 'https://example.com/email-toolkit', commission_label: '$14.00', status: 'active' },
    { workspace_id: wsId, name: 'Sleep Reset', network: 'ClickBank', canonical_url: 'https://example.com/sleep-reset', commission_label: '$18.00', status: 'active' },
    { workspace_id: wsId, name: 'AI Funnel Builder', network: 'WarriorPlus', canonical_url: 'https://example.com/funnel-ai', commission_label: '$12.00', status: 'active' },
    { workspace_id: wsId, name: 'Wellness Guide', network: 'Direct', canonical_url: 'https://example.com/wellness', commission_label: '$9.00', status: 'active' },
  ]).select();

  // Links with destinations
  if (defaultDomainId && offers?.length) {
    const linksData = [
      { name: 'Email Toolkit Promo', slug: 'email-toolkit', offer_id: offers[0].id },
      { name: 'Sleep Reset Guide', slug: 'sleep', offer_id: offers[1].id },
      { name: 'AI Funnel Builder', slug: 'funnel-ai', offer_id: offers[2].id },
      { name: 'Wellness Starter Guide', slug: 'wellness', offer_id: offers[3].id },
      { name: 'Pinterest Lead Magnet', slug: 'pin-kit', offer_id: offers[0].id },
    ];

    for (const link of linksData) {
      const { data: createdLink } = await supabase.from('links').insert({
        workspace_id: wsId,
        domain_id: defaultDomainId,
        offer_id: link.offer_id,
        name: link.name,
        slug: link.slug,
        status: 'active',
        redirect_code: 302,
        preserve_query: true,
      }).select().single();

      if (createdLink) {
        await supabase.from('destinations').insert({
          link_id: createdLink.id,
          label: 'Primary',
          url: `https://vendor-site.com/${link.slug}?aff=you`,
          weight: 100,
          active: true,
        });
      }
    }
  }

  return NextResponse.json(workspace, { status: 201 });
}
