"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { RiAddBoxLine, RiFlashlightLine } from "@remixicon/react";

import { Badge } from "./ui/badge";

import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { getUserOptions } from "@/utils/react-query/user";
import { getUserProfileOptions } from "@/utils/react-query/user";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import SplashScreen from "@/components/splash-screen";
import { POINTS } from "@/utils/constants";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "@/components/user-dropdown";

export function DashboardHeader() {
  const router = useRouter();
  const supabase = createClient();

  const pathname = usePathname();

  const isCreator = pathname.startsWith("/dashboard");

  const { data: userData, isPending } = useQuery(getUserOptions(supabase));
  const user = userData?.user;

  const { data: businessProfile, isPending: isBusinessPending } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string),
  );

  const { data: userProfile } = useQuery(
    getUserProfileOptions(supabase, user?.id as string),
  );

  const points = userProfile?.balance || 0;
  const hasLowBalance =
    points < Math.max(POINTS.CREATE_COLLAB, POINTS.APPLY_COLLAB);

  return (
    <header className="dark flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-sidebar text-sidebar-foreground relative before:absolute before:inset-y-3 before:-left-px before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5 before:z-50">
      <SidebarTrigger className="-ms-2" />
      <h1 className="hidden md:block text-sm font-medium">
        {!isCreator && "Business Dashboard"}
        {isCreator && "Creator Dashboard"}
      </h1>
      <div className="flex items-center gap-8 ml-auto">
        <nav className="flex items-center gap-4 text-sm font-medium max-sm:hidden">
          <div className="">
            {isCreator ? (
              !!businessProfile ? (
                <Link href="/business/dashboard">
                  <Button>Switch to Business</Button>
                </Link>
              ) : (
                <Link href="/business/onboarding">
                  <Button size="sm">
                    <RiAddBoxLine />
                    Create Collab
                  </Button>
                </Link>
              )
            ) : (
              <Link href="/dashboard">
                <Button>Switch to Creator</Button>
              </Link>
            )}
          </div>
          <Badge>
            <RiFlashlightLine
              aria-hidden="true"
              className="-ms-0.5 opacity-60"
              size={12}
            />
            {points.toLocaleString()} Credits
          </Badge>
        </nav>
        <UserDropdown user={user} />
      </div>
      {isPending || (isBusinessPending && <SplashScreen />)}
    </header>
  );
}
