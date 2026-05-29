import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vqkrotdvxrfomjcpuoby.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_I8l_iL5HyEJt9ZlkwQWN5Q_BjjyKJ44";

// Safe creation for Next.js 15 SSR builds
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Keep sessions persisted in localstorage
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
