"use client";

import { RiAddBoxLine, RiFlashlightLine, RiUser3Line } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/supabase/client";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import {
  getUserOptions,
  getUserProfileOptions,
} from "@/utils/react-query/user";

export function MobileSwitchFAB() {
  const supabase = createClient();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isCreator = pathname.startsWith("/dashboard");

  const { data: userData } = useQuery(getUserOptions(supabase));
  const user = userData?.user;

  const { data: businessProfile } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string)
  );

  const { data: userProfile } = useQuery(
    getUserProfileOptions(supabase, user?.id as string)
  );

  const points = userProfile?.balance || 0;

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <RiUser3Line size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 mb-2 mr-2" side="top">
          {/* Credits Display */}
          <div className="px-3 py-2 border-b">
            <div className="flex items-center gap-2">
              <Badge className="text-xs">
                <RiFlashlightLine
                  aria-hidden="true"
                  className="-ms-0.5 opacity-60"
                  size={10}
                />
                {points.toLocaleString()} Credits
              </Badge>
            </div>
          </div>

          {/* Switch Options */}
          <div className="py-1">
            {isCreator ? (
              !!businessProfile ? (
                <DropdownMenuItem asChild>
                  <Link
                    className="flex items-center gap-2 w-full"
                    href="/business/dashboard"
                    onClick={() => setIsOpen(false)}
                  >
                    <RiUser3Line size={16} />
                    Switch to Business
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    className="flex items-center gap-2 w-full"
                    href="/business/onboarding"
                    onClick={() => setIsOpen(false)}
                  >
                    <RiAddBoxLine size={16} />
                    Create Business Profile
                  </Link>
                </DropdownMenuItem>
              )
            ) : (
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center gap-2 w-full"
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                >
                  <RiUser3Line size={16} />
                  Switch to Creator
                </Link>
              </DropdownMenuItem>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
