import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { BusinessDashboard } from "@/components/business/business-dashboard";
import { getBusinessDashboardDataOptions } from "@/utils/react-query/business/collabs";
import { getQueryClient } from "@/utils/react-query";
import { createClient } from "@/supabase/server";
import { getUserOptions } from "@/utils/react-query/user";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function BusinessDashboardPage() {
  const queryClient = getQueryClient();
  const supabase = await createClient();

  const { user } = await queryClient.fetchQuery(getUserOptions(supabase));

  if (!user?.id) redirect("/login");

  const { id: businessId } = await queryClient.fetchQuery(
    getBusinessProfileOptions(supabase, user?.id as string),
  );

  await queryClient.prefetchQuery(
    getBusinessDashboardDataOptions(supabase, businessId),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
        <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
          <BusinessDashboard businessId={businessId} userId={user?.id} />
        </div>
      </ScrollArea>
    </HydrationBoundary>
  );
}
