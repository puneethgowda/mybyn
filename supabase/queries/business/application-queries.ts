import { TypedSupabaseClient } from "@/supabase/types";
import { APPLICATION_STATUS } from "@/utils/enums";

/**
 * get all collaboration applications (paginated + optional status filter)
 */
export async function getAllCollabApplications(
  supabase: TypedSupabaseClient,
  collabId: string,
  businessId: string,
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
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const status = params?.status;

  let query = supabase
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
      { count: "exact" },
    )
    .eq("collab_id", collabId)
    .eq("collabs.business_id", businessId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status && status !== "All") {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data ?? [],
    count: count ?? 0,
    page,
    pageSize,
  };
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
