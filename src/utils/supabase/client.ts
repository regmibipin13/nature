import { createBrowserClient } from "@supabase/ssr";
export function createClient() {
  // Support both naming conventions (Vercel integration and manual setup)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;
  
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
