import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { getQueryClient } from "@/utils/react-query";
import { createClient } from "@/supabase/server";
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
      getBusinessProfileOptions(supabase, user?.id as string),
    );
  } catch (e) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar view="business" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav view="business" />
    </div>
  );
}
