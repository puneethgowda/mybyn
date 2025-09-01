import { TypedSupabaseClient } from "@/supabase/types";
import { BusinessProfileFormValues } from "@/types/business-profile";

/**
 * Get business profile by owner ID
 */
export async function getBusinessProfile(
  supabase: TypedSupabaseClient,
  ownerId: string
) {
  const { data, error } = await supabase
    .from("business_profile")
    .select("*")
    .eq("owner_id", ownerId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Save business profile (create or update)
 */
export async function saveBusinessProfile(
  supabase: TypedSupabaseClient,
  profileData: BusinessProfileFormValues & {
    owner_id: string;
    business_id?: string;
  }
) {
  const { owner_id, business_id, ...updateData } = profileData;

  // First, try to update existing profile
  const { data: existingProfile } = await supabase
    .from("business_profile")
    .select("id")
    .eq("owner_id", owner_id)
    .single();

  if (existingProfile) {
    // Update existing profile
    const { data, error } = await supabase
      .from("business_profile")
      .update(updateData)
      .eq("owner_id", owner_id)
      .eq("id", business_id as string)
      .select()
      .single();

    if (error) throw error;

    return data;
  } else {
    // Create new profile
    const { data, error } = await supabase
      .from("business_profile")
      .insert({
        owner_id,
        ...updateData,
      })
      .select()
      .single();

    if (error) throw error;

    // Handle referral points for business profile creation
    try {
      await supabase.rpc("handle_referral_points_for_profile", {
        profile_user_id: owner_id,
        action_type: "BUSINESS_PROFILE_CREATED",
      });
    } catch (_referralError) {
      // console.error("Error handling referral points:", referralError);
      // Don't fail the profile creation if referral handling fails
    }

    return data;
  }
}
