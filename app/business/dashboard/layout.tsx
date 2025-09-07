import { redirect } from "next/navigation";

import { MobileLayout } from "@/components/mobile-layout";
import { createClient } from "@/supabase/server";
import { getQueryClient } from "@/utils/react-query";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { getUserOptions } from "@/utils/react-query/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const supabase = await createClient();

  const { user } = await queryClient.fetchQuery(getUserOptions(supabase));

  if (!user?.id) redirect("/login");

  try {
    await queryClient.fetchQuery(
      getBusinessProfileOptions(supabase, user?.id as string)
    );
  } catch (_e) {
    redirect("/dashboard");
  }

  return <MobileLayout view="business">{children}</MobileLayout>;
}
