import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { TypedSupabaseClient } from "@/supabase/types";
import {
  getCollabs,
  applyToCollab,
  checkUserAppliedToCollab,
  getAllCollabApplications,
} from "@/supabase/queries/collab-queries";
import { Database } from "@/supabase/database.types";

export function getCollabsOptions(
  supabase: TypedSupabaseClient,
  filters: {
    location?: string;
    businessTypes?: Database["public"]["Enums"]["business_type"][];
    amountRange?: [number, number];
    formats?: string[];
    collabType?: Database["public"]["Enums"]["collab_type"] | "All";
    languages?: Database["public"]["Enums"]["languages"][];
    searchQuery?: string;
    page?: number;
    pageSize?: number;
  },
) {
  return queryOptions({
    queryKey: ["collabs", filters],
    queryFn: async () => {
      return getCollabs(supabase, filters);
    },
  });
}

export function useApplyToCollabMutation(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      collabId,
      message,
    }: {
      userId: string;
      collabId: string;
      message: string;
    }) => {
      return applyToCollab(supabase, userId, collabId, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collabs"] });
    },
  });
}

export function checkUserAppliedToCollabOptions(
  supabase: TypedSupabaseClient,
  userId: string,
  collabId: string,
) {
  return queryOptions({
    queryKey: ["collabs", "application", "has-applied", userId, collabId],
    queryFn: async () => {
      return checkUserAppliedToCollab(supabase, userId, collabId);
    },
    enabled: !!userId && !!collabId,
  });
}

export function getAllCollabApplicationsOptions(
  supabase: TypedSupabaseClient,
  userId: string,
) {
  return queryOptions({
    queryKey: ["collabs", "application", "all", userId],
    queryFn: async () => {
      return getAllCollabApplications(supabase, userId);
    },
    enabled: !!userId,
  });
}
