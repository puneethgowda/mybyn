// Get current user session
import { TypedSupabaseClient } from "@/supabase/types";

export async function getCurrentSession(supabase: TypedSupabaseClient) {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data;
}

export async function getCurrentUser(supabase: TypedSupabaseClient) {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return data;
}

export async function getCreatorProfile(
  supabase: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("creator_profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}

export async function getUserProfile(
  supabase: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return data;
}
