import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { TypedSupabaseClient } from "@/supabase/types";
import {
  getBusinessProfile,
  saveBusinessProfile,
} from "@/supabase/queries/business/profile-queries";
import { BusinessProfileFormValues } from "@/types/business-profile";

export function getBusinessProfileOptions(
  supabase: TypedSupabaseClient,
  ownerId: string,
) {
  return queryOptions({
    queryKey: ownerId ? ["business", "profile", ownerId] : [],
    queryFn: async () => {
      return getBusinessProfile(supabase, ownerId);
    },
    enabled: !!ownerId,
  });
}

export function useSaveBusinessProfileMutation(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      businessProfile: BusinessProfileFormValues & {
        owner_id: string;
        business_id?: string;
      },
    ) => {
      return saveBusinessProfile(supabase, businessProfile);
    },
    onSuccess: (data, variables) => {
      // Update the cache with the new data
      queryClient.setQueryData(
        ["business", "profile", variables.owner_id],
        data,
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["business", "profile", variables.owner_id],
      });

      addToast({
        title: "Business profile updated!",
        description: "",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Failed to update business profile",
        description:
          error?.message ?? "Something went wrong. Please try again.",
        color: "danger",
      });
    },
  });
}
