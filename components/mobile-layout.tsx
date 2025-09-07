"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { DashboardHeader } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import * as React from "react";

interface MobileLayoutProps {
  children: React.ReactNode;
  view: "business" | "creator";
}

export function MobileLayout({ children, view }: MobileLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Main content area with bottom padding for navigation */}
        <main className="flex-1 overflow-y-auto pb-16">{children}</main>
        {/* Bottom navigation */}
        <BottomNavigation view={view} />
      </div>
    );
  }

  // Desktop layout with sidebar
  return (
    <SidebarProvider>
      <AppSidebar view={view} />
      <SidebarInset className="bg-sidebar group/sidebar-inset">
        <DashboardHeader />
        <div className="flex h-[calc(100svh-4rem)] bg-[hsl(240_5%_92.16%)] md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
