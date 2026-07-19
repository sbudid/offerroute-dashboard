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

  if (!memberData) return NextResponse.json({ clicks: 0, unique: 0, conversions: 0, revenue: 0 });

  // Get aggregate stats from click_events
  const { count: clickCount } = await supabase
    .from('click_events')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', memberData.workspace_id);

  // Get unique visitors count
  const { data: uniqueData } = await supabase
    .from('click_events')
    .select('visitor_hash')
    .eq('workspace_id', memberData.workspace_id);

  const uniqueVisitors = uniqueData
    ? new Set(uniqueData.map((d: { visitor_hash: string }) => d.visitor_hash)).size
    : 0;

  // Get conversions
  const { count: conversionCount } = await supabase
    .from('conversions')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', memberData.workspace_id);

  // Get total revenue
  const { data: revenueData } = await supabase
    .from('conversions')
    .select('amount')
    .eq('workspace_id', memberData.workspace_id);

  const totalRevenue = revenueData
    ? revenueData.reduce((sum: number, c: { amount: number }) => sum + (c.amount || 0), 0)
    : 0;

  // Get clicks by country
  const { data: countryData } = await supabase
    .from('click_events')
    .select('country_code')
    .eq('workspace_id', memberData.workspace_id);

  const countryCounts: Record<string, number> = {};
  if (countryData) {
    countryData.forEach((c: { country_code: string }) => {
      const code = c.country_code || 'Unknown';
      countryCounts[code] = (countryCounts[code] || 0) + 1;
    });
  }

  // Get clicks by device
  const { data: deviceData } = await supabase
    .from('click_events')
    .select('device_type')
    .eq('workspace_id', memberData.workspace_id);

  const deviceCounts: Record<string, number> = {};
  if (deviceData) {
    deviceData.forEach((d: { device_type: string }) => {
      const type = d.device_type || 'unknown';
      deviceCounts[type] = (deviceCounts[type] || 0) + 1;
    });
  }

  return NextResponse.json({
    clicks: clickCount ?? 0,
    unique: uniqueVisitors,
    conversions: conversionCount ?? 0,
    revenue: totalRevenue,
    countries: countryCounts,
    devices: deviceCounts,
  });
}
