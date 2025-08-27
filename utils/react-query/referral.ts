import { queryOptions } from "@tanstack/react-query";

import { TypedSupabaseClient } from "@/supabase/types";
import { getReferralCreditsFromTransactions } from "@/supabase/queries/referral-queries";

export function getReferralCreditsOptions(
  supabase: TypedSupabaseClient,
  userId: string,
) {
  return queryOptions({
    queryKey: ["user", "referral-credits", userId],
    queryFn: async () => {
      return getReferralCreditsFromTransactions(supabase, userId);
    },
    enabled: !!userId,
  });
}
