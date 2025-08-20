import { DashboardHeader } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar view="creator" />
      <SidebarInset className="bg-sidebar group/sidebar-inset">
        <DashboardHeader />
        <div className="flex h-[calc(100svh-4rem)] bg-[hsl(240_5%_92.16%)] md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
