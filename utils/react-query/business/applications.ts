import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { TypedSupabaseClient } from "@/supabase/types";
import {
  acceptApplication,
  getAllCollabApplications,
  rejectApplication,
} from "@/supabase/queries/business/application-queries";
import { APPLICATION_STATUS } from "@/utils/enums";
import { ApplicationStatus } from "@/types/collab";

/**
 * React Query options for fetching paginated collab applications
 */
export function getAllCollabApplicationsOptions(
  supabase: TypedSupabaseClient,
  businessId: string,
  collabId: string,
  params?: {
    page?: number;
    pageSize?: number;
    status?:
      | (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS]
      | "All";
  },
) {
  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.max(1, params?.pageSize ?? 10);
  const status = params?.status ?? "All";

  return queryOptions({
    queryKey: businessId
      ? [
          "business",
          "collabs",
          "applications",
          businessId,
          collabId,
          page,
          pageSize,
          status,
        ]
      : [],
    queryFn: async () => {
      if (!businessId || !collabId) return null;

      return getAllCollabApplications(supabase, collabId, businessId, {
        page,
        pageSize,
        status,
      });
    },
    enabled: !!businessId && !!collabId,
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

/**
 * Mutation for accepting/rejecting a collaboration application
 */
export function useAcceptOrRejectApplicationMutation(
  supabase: TypedSupabaseClient,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collabApplicationId,
      status,
    }: {
      collabApplicationId: string;
      status: ApplicationStatus;
      businessId: string;
      collabId: string;
    }) => {
      if (status === APPLICATION_STATUS.ACCEPTED)
        return acceptApplication(supabase, collabApplicationId);

      return rejectApplication(supabase, collabApplicationId);
    },
    onSuccess: (_data, variables) => {
      // Invalidate all paginated queries for this collab regardless of page/filters
      queryClient.invalidateQueries({
        queryKey: [
          "business",
          "collabs",
          "applications",
          variables.businessId,
          variables.collabId,
        ],
        exact: false,
      });

      if (variables.status === APPLICATION_STATUS.ACCEPTED) {
        toast.success("Application Accepted");
      } else {
        toast.error("Application Rejected");
      }
    },
    onError: (error: any) => {
      console.error("Error updating application:", error);
      toast.error("Failed to accept/reject applicant");
    },
  });
}
