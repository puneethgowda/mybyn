import { TypedSupabaseClient } from "@/supabase/types";

export const getCreatorStats = async (
  supabase: TypedSupabaseClient,
  creatorId: string,
) => {
  return supabase
    .from("collab_applications")
    .select("status, count()")
    .eq("creator_id", creatorId);
};

export const getCreatorRecentApplications = async (
  supabase: TypedSupabaseClient,
  creatorId: string,
) => {
  const { data, error } = await supabase
    .from("collab_applications")
    .select(
      `
              *,
              collabs (
                *,
                business_profile (
                  *
                )
              )
            `,
    )
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw error;

  return data;
};
