import { TypedSupabaseClient } from "@/supabase/types";

/**
 * Aggregate referral credits from point_transactions for a user.
 * Filters: type = 'CREDIT' and description ILIKE 'Referral reward:%'
 * Returns 0 if there are no matching transactions.
 */
export async function getReferralCreditsFromTransactions(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<number> {
  // Use a single aggregate query to compute the sum on the server
  const { data, error } = await supabase
    .from("point_transactions")
    .select("amount", { count: "exact" })
    .eq("user_id", userId)
    .eq("type", "CREDIT")
    .ilike("description", "Referral reward:%");

  if (error) throw error;

  // Sum on client in case some drivers don't support sum(), while staying simple
  const total = (data || []).reduce(
    (acc, row: any) => acc + (row.amount || 0),
    0
  );

  return total || 0;
}
