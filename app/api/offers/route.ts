export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: memberData } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!memberData) return NextResponse.json([]);

  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('workspace_id', memberData.workspace_id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: memberData } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!memberData) return NextResponse.json({ error: 'No workspace' }, { status: 400 });

  const body = await request.json();
  const { data, error } = await supabase
    .from('offers')
    .insert({
      workspace_id: memberData.workspace_id,
      name: body.name,
      network: body.network ?? null,
      canonical_url: body.canonical_url,
      fallback_url: body.fallback_url ?? null,
      commission_label: body.commission_label ?? null,
      status: body.status ?? 'active',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
