"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { usePathname, useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { SparkSolid } from "iconoir-react";
import { Chip } from "@heroui/chip";

import { createClient } from "@/supabase/client";
import { getUserOptions } from "@/utils/react-query/user";
import { getUserProfileOptions } from "@/utils/react-query/user";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import SplashScreen from "@/components/splash-screen";
import { POINTS } from "@/utils/constants";

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
    <header className="bg-background px-4 md:px-6 py-4">
      <div className="flex flex-row justify-between items-center gap-0 md:gap-4">
        <div>
          <h1 className="hidden md:block text-xl font-bold">
            {!isCreator && "Business Dashboard"}
            {isCreator && "Creator Dashboard"}
          </h1>
          <Link
            className="flex md:hidden items-center justify-center gap-2 h-10"
            href="/"
          >
            <span className="font-bold text-xl">MYBYN</span>
          </Link>
        </div>

        {/* Role Switcher */}
        {user && (
          <div className="flex items-center gap-4">
            {/* Points Display */}
            <Chip
              className="hidden sm:flex"
              color={hasLowBalance ? "warning" : "success"}
              startContent={<SparkSolid className="size-4 text-yellow-400" />}
              variant="bordered"
            >
              {points.toLocaleString()} pts
            </Chip>

            <div className="">
              {isCreator ? (
                !!businessProfile ? (
                  <Link href="/business/dashboard">
                    <Button size="sm" variant="bordered">
                      Switch to Business
                    </Button>
                  </Link>
                ) : (
                  <Link href="/business/onboarding">
                    <Button
                      color="primary"
                      size="sm"
                      startContent={<PlusIcon className="size-4" />}
                    >
                      Create Collab
                    </Button>
                  </Link>
                )
              ) : (
                <Link href="/dashboard">
                  <Button size="sm" variant="bordered">
                    Switch to Creator
                  </Button>
                </Link>
              )}
            </div>
            {!!user && (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="gap-0 md:gap-2 p-0 justify-end md:justify-center min-w-fit"
                    variant="light"
                  >
                    <Avatar
                      name={user.user_metadata.name}
                      size="sm"
                      src={user.user_metadata.avatar_url}
                    />
                    <span className="hidden md:block">
                      {user.user_metadata.name || user.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User actions">
                  <DropdownItem
                    key="profile"
                    onClick={() => {
                      router.push("/dashboard/profile");
                    }}
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push("/login");
                    }}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        )}
      </div>
      {isPending || (isBusinessPending && <SplashScreen />)}
    </header>
  );
}
