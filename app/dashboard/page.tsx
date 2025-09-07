import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { CreatorDashboard } from "@/components/dashboard/creator-dashboard";
import { createClient } from "@/supabase/server";
import { getQueryClient } from "@/utils/react-query";
import {
  getCreatorRecentApplicationsOptions,
  getCreatorStatsOptions,
} from "@/utils/react-query/creator";
import { getUserOptions } from "@/utils/react-query/user";

export default async function Dashboard() {
  const queryClient = getQueryClient();

  const supabase = await createClient();

  const { user } = await queryClient.fetchQuery(getUserOptions(supabase));

  if (!user?.id) redirect("/login");

  void queryClient.prefetchQuery(getCreatorStatsOptions(supabase, user?.id));
  void queryClient.prefetchQuery(
    getCreatorRecentApplicationsOptions(supabase, user?.id)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8 md:shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl  w-full bg-background pb-20 md:pb-4">
        <CreatorDashboard userId={user?.id as string} />
      </div>
    </HydrationBoundary>
  );
}
