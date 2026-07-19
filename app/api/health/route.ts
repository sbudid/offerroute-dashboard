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
    .from('health_checks')
    .select(`
      *,
      destinations!inner(
        id,
        label,
        url,
        link_id,
        links!inner(
          id,
          name,
          slug,
          workspace_id,
          domains(hostname)
        )
      )
    `)
    .eq('destinations.links.workspace_id', memberData.workspace_id)
    .order('checked_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
