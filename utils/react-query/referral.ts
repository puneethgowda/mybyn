import { queryOptions } from "@tanstack/react-query";

import { getReferralCreditsFromTransactions } from "@/supabase/queries/referral-queries";
import { TypedSupabaseClient } from "@/supabase/types";

export function getReferralCreditsOptions(
  supabase: TypedSupabaseClient,
  userId: string
) {
  return queryOptions({
    queryKey: ["user", "referral-credits", userId],
    queryFn: async () => {
      return getReferralCreditsFromTransactions(supabase, userId);
    },
    enabled: !!userId,
  });
}
