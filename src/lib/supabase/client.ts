import { createBrowserClient } from "@supabase/ssr";

// Untyped client — replace with createBrowserClient<Database>() after running:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
