import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ylpqbyyaivoqfvqgxhff.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_U6374HOCNxfcXzrwRqNzDw_24RO_Elg';

  return createBrowserClient(url, key);
}
