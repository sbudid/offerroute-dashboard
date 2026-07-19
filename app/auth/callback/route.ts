export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Auto-create workspace if user doesn't have one
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existingMember } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (!existingMember) {
          // Create workspace
          const { data: workspace } = await supabase
            .from('workspaces')
            .insert({
              name: 'My Workspace',
              owner_id: user.id,
              plan: 'free',
            })
            .select()
            .single();

          if (workspace) {
            await supabase.from('workspace_members').insert({
              workspace_id: workspace.id,
              user_id: user.id,
              role: 'owner',
            });
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
