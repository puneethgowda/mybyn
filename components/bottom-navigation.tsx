"use client";

import {
  RiBriefcase3Line,
  RiChat1Line,
  RiHomeLine,
  RiMailOpenLine,
  RiSearch2Line,
  RiShareLine,
  RiUser3Line,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navData = {
  business: [
    { title: "Home", href: "/business/dashboard", icon: RiHomeLine },
    {
      title: "Collabs",
      href: "/business/dashboard/collabs",
      icon: RiBriefcase3Line,
    },
    {
      title: "Messages",
      href: "/business/dashboard/messages",
      icon: RiChat1Line,
    },
    {
      title: "Profile",
      href: "/business/dashboard/profile",
      icon: RiUser3Line,
    },
  ],
  creator: [
    { title: "Home", href: "/dashboard", icon: RiHomeLine },
    {
      title: "Discover",
      href: "/dashboard/discover",
      icon: RiSearch2Line,
    },
    { title: "Applied", href: "/dashboard/applications", icon: RiMailOpenLine },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: RiChat1Line,
    },
    { title: "Referrals", href: "/dashboard/referrals", icon: RiShareLine },
    { title: "Profile", href: "/dashboard/profile", icon: RiUser3Line },
  ],
};

interface BottomNavigationProps {
  view: "business" | "creator";
}

export function BottomNavigation({ view }: BottomNavigationProps) {
  const pathname = usePathname();
  const navItems = navData[view];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 h-full px-2 py-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              href={item.href}
            >
              <Icon
                className={cn(
                  "mb-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                size={20}
              />
              <span
                className={cn(
                  "text-xs font-medium truncate transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
