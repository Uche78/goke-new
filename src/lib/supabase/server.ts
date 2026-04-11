import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Untyped client — replace with createServerClient<Database>() after running:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // In Server Components, cookie setting fails silently.
            // Middleware handles session refresh.
          }
        },
      },
    }
  );
};
