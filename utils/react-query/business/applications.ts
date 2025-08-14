import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { TypedSupabaseClient } from "@/supabase/types";
import {
  acceptApplication,
  getAllCollabApplications,
  rejectApplication,
} from "@/supabase/queries/business/application-queries";
import { APPLICATION_STATUS } from "@/utils/enums";
import { ApplicationStatus } from "@/types/collab";
import { Database } from "@/supabase/database.types";

/**
 * React Query options for fetching all collab applications
 */
export function getAllCollabApplicationsOptions(
  supabase: TypedSupabaseClient,
  businessId: string,
  collabId: string,
) {
  return queryOptions({
    queryKey: businessId
      ? ["business", "collabs", "applications", businessId, collabId]
      : [],
    queryFn: async () => {
      if (!businessId || !collabId) return null;

      return getAllCollabApplications(supabase, collabId, businessId);
    },
    enabled: !!businessId && !!collabId,
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
      businessId,
      collabId,
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
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.setQueryData(
        [
          "business",
          "collabs",
          "applications",
          variables.businessId,
          variables.collabId,
        ],
        (
          oldData: Database["public"]["Tables"]["collab_applications"]["Row"][] = [],
        ) => {
          const applicationIndex = oldData.findIndex(
            (application) => application.id === variables.collabApplicationId,
          );

          if (applicationIndex !== -1) {
            return [
              ...oldData.slice(0, applicationIndex),
              {
                ...oldData[applicationIndex],
                status: variables.status,
              },
              ...oldData.slice(applicationIndex + 1),
            ];
          }

          return oldData;
        },
      );

      if (variables.status === APPLICATION_STATUS.ACCEPTED) {
        addToast({
          title: "Application Accepted",
          description: ``,
          color: "success",
        });
      } else {
        addToast({
          title: "Application Rejected",
          description: ``,
          color: "success",
        });
      }

      // Navigate to the collab details page
      // router.push(`/business/dashboard/collabs/${data.id}`);
    },
    onError: (error: any) => {
      console.error("Error creating collab:", error);
      addToast({
        title: `Failed to Accpet/Reject applicant`,
        description: error.message || "Something went wrong. Please try again.",
        color: "danger",
      });
    },
  });
}
