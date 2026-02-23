import { createClient } from "@supabase/supabase-js";

// Client Supabase avec la clé service_role
// Permet d'accéder aux emails des utilisateurs (auth.users)
// ⚠️ Ne JAMAIS utiliser côté client
export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
