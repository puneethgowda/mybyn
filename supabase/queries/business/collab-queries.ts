import { TypedSupabaseClient } from "@/supabase/types";
import { APPLICATION_STATUS, COLLAB_STATUS } from "@/utils/enums";
import { BusinessDashboardStats } from "@/types/business/collab";
import { Database } from "@/supabase/database.types";

/**
 * Get business dashboard stats
 */
export async function getBusinessDashboardStats(
  supabase: TypedSupabaseClient,
  businessId: string,
): Promise<BusinessDashboardStats> {
  // Initialize default stats
  const stats: BusinessDashboardStats = {
    activeCampaigns: 0,
    totalApplications: 0,
    acceptedCollabs: 0,
    rejectedCollabs: 0,
    profileCompletion: 0,
    instagramConnected: false,
  };

  // Get application stats
  const { data: applicationStats, error: applicationError } = await supabase
    .from("collab_applications")
    .select(
      `
      status,
      count(),
      ...collabs!inner(business_id)
      `,
      {
        count: "exact",
      },
    )
    .eq("collabs.business_id", businessId);

  if (!applicationError && applicationStats) {
    const applicationStatus: Record<string, number> = {};
    let totalApplications = 0;

    applicationStats.forEach((each) => {
      applicationStatus[each.status] = each.count;
      totalApplications += each.count;
    });

    stats.totalApplications = totalApplications;
    stats.acceptedCollabs = applicationStatus[APPLICATION_STATUS.ACCEPTED] || 0;
    stats.rejectedCollabs = applicationStatus[APPLICATION_STATUS.REJECTED] || 0;
  }

  // Get total active collabs
  const { count: activeCampaigns, error: collabsError } = await supabase
    .from("collabs")
    .select("count()", { count: "exact" })
    .eq("business_id", businessId);

  if (!collabsError) {
    stats.activeCampaigns = activeCampaigns || 0;
  }

  // Check if Instagram is connected
  stats.instagramConnected = false;

  return stats;
}

/**
 * Get recent applications for business dashboard
 */
export async function getBusinessRecentApplications(
  supabase: TypedSupabaseClient,
  businessId: string,
  limit: number = 5,
) {
  const { data, error } = await supabase
    .from("collab_applications")
    .select(
      `
      id,
      status,
      created_at,
      creator_profile (
        id,
        name,
        instagram_handle,
        followers_count,
        profile_pic_url
      ),
      collab:collabs!inner (
        id,
        title
      )
      `,
    )
    .eq("collabs.business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data;
}

/**
 * Get active collabs for business dashboard
 */
export async function getBusinessActiveCollabs(
  supabase: TypedSupabaseClient,
  businessId: string,
  limit: number = 3,
) {
  // Get active collabs
  const { data, error } = await supabase
    .from("collabs")
    .select(
      `
      id,
      title,
      collab_type,
      status,
      amount,
      created_at
      `,
    )
    .eq("business_id", businessId)
    .eq("status", COLLAB_STATUS.ACTIVE)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data;
}

/**
 * Get all business dashboard data in a single function
 */
export async function getBusinessDashboardData(
  supabase: TypedSupabaseClient,
  businessId: string,
) {
  const [stats, recentApplications, activeCollabs] = await Promise.all([
    getBusinessDashboardStats(supabase, businessId),
    getBusinessRecentApplications(supabase, businessId),
    getBusinessActiveCollabs(supabase, businessId),
  ]);

  return {
    stats,
    recentApplications,
    activeCollabs,
  };
}

/**
 * Get all collabs for business dashboard
 */
export async function getAllBusinessCollabs(
  supabase: TypedSupabaseClient,
  businessId: string,
  status: Database["public"]["Enums"]["collab_status"] = COLLAB_STATUS.ACTIVE,
) {
  // Get active collabs
  const { data, error } = await supabase
    .from("collabs")
    .select("*")
    .eq("business_id", businessId)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export interface CreateCollabData {
  title: string;
  description: string;
  platform: Database["public"]["Enums"]["platform_type"];
  collab_type: Database["public"]["Enums"]["collab_type"];
  amount: number | null;
  languages: Database["public"]["Enums"]["languages"][];
  business_id: string;
  status: Database["public"]["Enums"]["collab_status"];
}

export interface UpdateCollabData extends Partial<CreateCollabData> {
  id: string;
}

/**
 * Create a new collaboration
 */
export async function createCollab(
  supabase: TypedSupabaseClient,
  userId: string,
  collabData: CreateCollabData,
) {
  // const { data, error } = await supabase
  //   .from("collabs")
  //   .insert(collabData)
  //   .select()
  //   .single();

  const { data, error } = await supabase.rpc("handle_create_collab", {
    input_user_id: userId,
    input_business_id: collabData.business_id,
    input_collab_details: { ...collabData },
  });

  if (error) throw error;

  return data;
}

/**
 * Update an existing collaboration
 */
export async function updateCollab(
  supabase: TypedSupabaseClient,
  collabData: UpdateCollabData,
) {
  const { id, ...updateData } = collabData;

  const { data, error } = await supabase
    .from("collabs")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Get a single collaboration by ID
 */
export async function getCollabById(
  supabase: TypedSupabaseClient,
  collabId: string,
  businessId?: string,
) {
  let query = supabase.from("collabs").select("*").eq("id", collabId);

  // If businessId is provided, ensure the collab belongs to this business
  if (businessId) {
    query = query.eq("business_id", businessId);
  }

  const { data, error } = await query.single();

  if (error) throw error;

  return data;
}

/**
 * Update collaboration status
 */
export async function updateCollabStatus(
  supabase: TypedSupabaseClient,
  collabId: string,
  status: Database["public"]["Enums"]["collab_status"],
  businessId: string,
) {
  const { data, error } = await supabase
    .from("collabs")
    .update({ status })
    .eq("id", collabId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
