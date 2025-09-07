import { Database } from "@/supabase/database.types";
import { TypedSupabaseClient } from "@/supabase/types";
import { COLLAB_STATUS } from "@/utils/enums";

export async function getCollabs(
  supabase: TypedSupabaseClient,
  filters: {
    location?: string;
    businessTypes?: Database["public"]["Enums"]["business_type"][];
    amountRange?: [number, number];
    formats?: string[];
    collabType?: Database["public"]["Enums"]["collab_type"] | "All";
    languages?: string;
    searchQuery?: string;
    page?: number;
    pageSize?: number;
  }
) {
  const {
    location,
    businessTypes,
    amountRange,
    formats,
    collabType,
    languages,
    searchQuery,
    page = 1,
    pageSize = 9,
  } = filters;

  let query = supabase.from("collabs").select(
    `
        *,
        business_profile!inner(
          *
        )
      `
  );

  // Apply filters
  query = query.eq("status", COLLAB_STATUS.ACTIVE);

  if (location && location !== "All") {
    query = query.eq("location", location);
  }

  if (
    businessTypes &&
    businessTypes.length > 0 &&
    // @ts-ignore
    businessTypes !== "All"
  ) {
    query = query.in("business_profile.type", businessTypes);
  }

  if (amountRange) {
    query = query.gte("amount", amountRange[0]).lte("amount", amountRange[1]);
  }

  if (formats && formats.length > 0) {
    query = query.in("format", formats);
  }

  if (collabType && collabType !== "All") {
    query = query.eq("collab_type", collabType);
  }

  if (languages && languages !== "All" && languages.length > 0) {
    query = query.overlaps("languages", [languages]);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { collabs: data, count };
}

export async function applyToCollab(
  supabase: TypedSupabaseClient,
  userId: string,
  collabId: string,
  message: string
) {
  // const { error } = await supabase
  //   .from("collab_applications")
  //   .insert({ creator_id: userId, collab_id: collabId, message });

  const { error } = await supabase.rpc("apply_to_collab", {
    input_collab_id: collabId,
    input_user_id: userId,
    message,
  });

  if (error) throw error;

  return true;
}

export async function checkUserAppliedToCollab(
  supabase: TypedSupabaseClient,
  userId: string,
  collabId: string
) {
  const { data, error } = await supabase
    .from("collab_applications")
    .select("id, status")
    .eq("collab_id", collabId)
    .eq("creator_id", userId)
    .single();

  if (error) throw error;

  return data;
}

export async function getAllCollabApplications(
  supabase: TypedSupabaseClient,
  userId: string
) {
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
            `
    )
    .eq("creator_id", userId);

  if (error) throw error;

  return data;
}
