import { queryOptions } from "@tanstack/react-query";

import {
  getCreatorRecentApplications,
  getCreatorStats,
} from "@/supabase/queries/creator-queries";
import { TypedSupabaseClient } from "@/supabase/types";

export function getCreatorStatsOptions(
  supabase: TypedSupabaseClient,
  userId: string
) {
  return queryOptions({
    queryKey: ["creator", "stats", userId],
    queryFn: async () => {
      if (!userId) return null;

      return getCreatorStats(supabase, userId);
    },
    enabled: !!userId,
  });
}

export function getCreatorRecentApplicationsOptions(
  supabase: TypedSupabaseClient,
  userId: string
) {
  return queryOptions({
    queryKey: ["creator", "recent-applications", userId],
    queryFn: async () => {
      if (!userId) return null;

      return getCreatorRecentApplications(supabase, userId);
    },
    enabled: !!userId,
  });
}
