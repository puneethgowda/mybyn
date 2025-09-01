import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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

  return (
    <SidebarProvider>
      <AppSidebar view="business" />
      <SidebarInset className="bg-sidebar group/sidebar-inset">
        <DashboardHeader />
        <div className="flex h-[calc(100svh-4rem)] bg-[hsl(240_5%_92.16%)] md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
