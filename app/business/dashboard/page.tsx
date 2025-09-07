import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { BusinessDashboard } from "@/components/business/business-dashboard";
import { createClient } from "@/supabase/server";
import { getQueryClient } from "@/utils/react-query";
import { getBusinessDashboardDataOptions } from "@/utils/react-query/business/collabs";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { getUserOptions } from "@/utils/react-query/user";

export default async function BusinessDashboardPage() {
  const queryClient = getQueryClient();
  const supabase = await createClient();

  const { user } = await queryClient.fetchQuery(getUserOptions(supabase));

  if (!user?.id) redirect("/login");

  const { id: businessId } = await queryClient.fetchQuery(
    getBusinessProfileOptions(supabase, user?.id as string)
  );

  await queryClient.prefetchQuery(
    getBusinessDashboardDataOptions(supabase, businessId)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col px-4 md:px-6 lg:px-8 md:shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl  w-full bg-background pb-16 md:pb-4">
        <BusinessDashboard businessId={businessId} userId={user?.id} />
      </div>
    </HydrationBoundary>
  );
}
