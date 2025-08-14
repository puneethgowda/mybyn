import { queryOptions } from "@tanstack/react-query";

import { TypedSupabaseClient } from "@/supabase/types";
import {
  getCreatorProfile,
  getCurrentSession,
  getCurrentUser,
  getUserProfile,
} from "@/supabase/queries/user-queries";

export function getUserOptions(supabase: TypedSupabaseClient) {
  return queryOptions({
    queryKey: ["user"],
    queryFn: async () => {
      return getCurrentUser(supabase);
    },
  });
}
export function getUserSessionOptions(supabase: TypedSupabaseClient) {
  return queryOptions({
    queryKey: ["user", "session"],
    queryFn: async () => {
      return getCurrentSession(supabase);
    },
  });
}

export function getUserProfileOptions(
  supabase: TypedSupabaseClient,
  userId: string,
) {
  return queryOptions({
    queryKey: ["user", "profile", userId],
    queryFn: async () => {
      return getUserProfile(supabase, userId);
    },
    enabled: !!userId,
  });
}

export function getCreatorProfileOptions(
  supabase: TypedSupabaseClient,
  userId: string,
) {
  return queryOptions({
    queryKey: ["user", "creator-profile", userId],
    queryFn: async () => {
      return getCreatorProfile(supabase, userId);
    },
    enabled: !!userId,
  });
}
