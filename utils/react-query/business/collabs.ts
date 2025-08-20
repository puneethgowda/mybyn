import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { TypedSupabaseClient } from "@/supabase/types";
import {
  getBusinessDashboardStats,
  getBusinessRecentApplications,
  getBusinessActiveCollabs,
  getBusinessDashboardData,
  getAllBusinessCollabs,
  getCollabById,
} from "@/supabase/queries/business/collab-queries";
import { Database } from "@/supabase/database.types";
import { COLLAB_STATUS } from "@/utils/enums";
import {
  createCollab,
  updateCollab,
  updateCollabStatus,
  CreateCollabData,
  UpdateCollabData,
} from "@/supabase/queries/business/collab-queries";
/**
 * React Query options for fetching business dashboard stats
 */
export function getBusinessDashboardStatsOptions(
  supabase: TypedSupabaseClient,
  businessId: string,
) {
  return queryOptions({
    queryKey: ["business", "dashboard", "stats", businessId],
    queryFn: async () => {
      if (!businessId) return null;

      return getBusinessDashboardStats(supabase, businessId);
    },
    enabled: !!businessId,
  });
}

/**
 * React Query options for fetching business recent applications
 */
export function getBusinessRecentApplicationsOptions(
  supabase: TypedSupabaseClient,
  businessId: string,
  limit: number = 5,
) {
  return queryOptions({
    queryKey: [
      "business",
      "dashboard",
      "recent-applications",
      businessId,
      limit,
    ],
    queryFn: async () => {
      if (!businessId) return [];

      return getBusinessRecentApplications(supabase, businessId, limit);
    },
    enabled: !!businessId,
  });
}

/**
 * React Query options for fetching business active collabs
 */
export function getBusinessActiveCollabsOptions(
  supabase: TypedSupabaseClient,
  businessId: string,
  limit: number = 3,
) {
  return queryOptions({
    queryKey: ["business", "dashboard", "active-collabs", businessId, limit],
    queryFn: async () => {
      if (!businessId) return [];

      return getBusinessActiveCollabs(supabase, businessId, limit);
    },
    enabled: !!businessId,
  });
}

/**
 * React Query options for fetching all business dashboard data
 */
export function getBusinessDashboardDataOptions(
  supabase: TypedSupabaseClient,
  businessId: string,
) {
  return queryOptions({
    queryKey: ["business", "dashboard", "data", businessId],
    queryFn: async () => {
      if (!businessId) return null;

      return getBusinessDashboardData(supabase, businessId);
    },
    enabled: !!businessId,
  });
}

/**
 * React Query options for fetching all business dashboard data
 */
export function getAllBusinessCollabsOptions(
  supabase: TypedSupabaseClient,
  businessId: string,
  status: Database["public"]["Enums"]["collab_status"] = COLLAB_STATUS.ACTIVE,
) {
  return queryOptions({
    queryKey: businessId ? ["business", "collabs", businessId] : [],
    queryFn: async () => {
      if (!businessId) return null;

      return getAllBusinessCollabs(supabase, businessId, status);
    },
    enabled: !!businessId,
  });
}
/**
 * React Query options for fetching all business dashboard data
 */
export function getSingleBusinessCollabsOptions(
  supabase: TypedSupabaseClient,
  businessId: string,
  collabId: string,
) {
  return queryOptions({
    queryKey: businessId ? ["business", "collabs", businessId, collabId] : [],
    queryFn: async () => {
      if (!businessId || !collabId) return null;

      return getCollabById(supabase, collabId, businessId);
    },
    enabled: !!businessId && !!collabId,
  });
}

/**
 * Mutation for creating a new collaboration
 */
export function useCreateCollabMutation(
  supabase: TypedSupabaseClient,
  userId: string,
) {
  const queryClient = useQueryClient();
  // const router = useRouter();

  return useMutation({
    mutationFn: async (collabData: CreateCollabData) => {
      return createCollab(supabase, userId, collabData);
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["business", "collabs", variables.business_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["business", "dashboard", "data", variables.business_id],
      });

      toast.success("Collaboration Created");

      // Navigate to the collab details page
      // router.push(`/business/dashboard/collabs/${data.id}`);
    },
    onError: (error: any) => {
      console.error("Error creating collab:", error);
      toast.error("Failed to Create Collaboration");
    },
  });
}

/**
 * Mutation for updating an existing collaboration
 */
export function useUpdateCollabMutation(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();
  // const router = useRouter();

  return useMutation({
    mutationFn: async (collabData: UpdateCollabData) => {
      return updateCollab(supabase, collabData);
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["business", "collabs", variables.business_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["business", "dashboard", "data", variables.business_id],
      });

      toast.success("Collaboration Updated");

      // Navigate to the collab details page
      // router.push(`/business/dashboard/collabs/${data.id}`);
    },
    onError: (error: any) => {
      console.error("Error updating collab:", error);
      toast.error("Failed to Update Collaboration");
    },
  });
}

/**
 * Mutation for updating collaboration status
 */
export function useUpdateCollabStatusMutation(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collabId,
      status,
      businessId,
    }: {
      collabId: string;
      status: Database["public"]["Enums"]["collab_status"];
      businessId: string;
    }) => {
      return updateCollabStatus(supabase, collabId, status, businessId);
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["business", "collabs", variables.businessId],
      });
      queryClient.invalidateQueries({
        queryKey: ["business", "dashboard", "data", variables.businessId],
      });

      const statusText =
        variables.status === "ACTIVE"
          ? "activated"
          : variables.status === "CLOSED"
            ? "closed"
            : "drafted";

      toast.success("Status Updated");
    },
    onError: (error: any) => {
      console.error("Error updating collab status:", error);
      toast.error("Failed to Update Status");
    },
  });
}
