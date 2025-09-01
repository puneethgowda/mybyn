import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";

import { Database } from "@/supabase/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function useSupabaseBrowser() {
  return useMemo(createClient, []);
}

export default useSupabaseBrowser;
