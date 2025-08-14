import { TypedSupabaseClient } from "@/supabase/types";
import { APPLICATION_STATUS } from "@/utils/enums";

/**
 * get all collaboration applications
 */
export async function getAllCollabApplications(
  supabase: TypedSupabaseClient,
  collabId: string,
  businessId: string,
) {
  const { data, error } = await supabase
    .from("collab_applications")
    .select(
      `
        *,
        collabs!inner (
          business_id
        ),
        creator_profile!inner (
          name,
          instagram_handle,
          followers_count,
          profile_pic_url
        )
      `,
    )
    .eq("collab_id", collabId)
    .eq("collabs.business_id", businessId);

  if (error) throw error;

  return data;
}

/**
 * accept collaboration applications
 */
export async function acceptApplication(
  supabase: TypedSupabaseClient,
  collabApplicationId: string,
) {
  const { data, error } = await supabase
    .from("collab_applications")
    .update({ status: APPLICATION_STATUS.ACCEPTED })
    .eq("id", collabApplicationId)
    .select();

  if (error) throw error;

  return data;
}
/**
 * reject collaboration applications
 */
export async function rejectApplication(
  supabase: TypedSupabaseClient,
  collabApplicationId: string,
) {
  const { data, error } = await supabase
    .from("collab_applications")
    .update({ status: APPLICATION_STATUS.REJECTED })
    .eq("id", collabApplicationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
