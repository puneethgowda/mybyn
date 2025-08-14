import { DashboardSidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar view="creator" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav view="creator" />
    </div>
  );
}
