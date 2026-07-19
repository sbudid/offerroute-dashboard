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
    .from('links')
    .select('*, domains(hostname), offers(name)')
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
    .from('links')
    .insert({
      workspace_id: memberData.workspace_id,
      name: body.name,
      slug: body.slug,
      domain_id: body.domain_id,
      offer_id: body.offer_id || null,
      status: body.status ?? 'active',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Create primary destination if provided
  if (body.destination_url && data) {
    await supabase.from('destinations').insert({
      link_id: data.id,
      label: 'Primary',
      url: body.destination_url,
      weight: 100,
    });
  }

  return NextResponse.json(data, { status: 201 });
}
