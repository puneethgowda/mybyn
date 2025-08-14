"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { IconSvgProps } from "@heroui/shared-icons";
import { cn } from "@heroui/theme";

import { ThemeSwitch } from "@/components/theme-switch";

export function DashboardSidebar({ view }: { view: "business" | "creator" }) {
  return (
    <div className="hidden md:flex w-32 bg-content  h-screen flex-col">
      <div className="p-4">
        <Link className="flex items-center justify-center gap-2 h-10" href="/">
          <span className="font-bold text-xl">MYBYN</span>
        </Link>
      </div>

      {/* Navigation Links - Business */}
      {view === "business" && (
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            <NavLink Icon={HomeIcon} href="/business/dashboard">
              Home
            </NavLink>
            <NavLink Icon={BriefcaseIcon} href="/business/dashboard/collabs">
              Collabs
            </NavLink>
            <NavLink
              Icon={ChatBubbleLeftRightIcon}
              href="/business/dashboard/messages"
            >
              Messages
            </NavLink>
            <NavLink Icon={UserIcon} href="/business/dashboard/profile">
              Profile
            </NavLink>
          </nav>
        </div>
      )}

      {/* Navigation Links - Creator */}
      {view === "creator" && (
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            <NavLink Icon={HomeIcon} href="/dashboard">
              Home
            </NavLink>
            <NavLink Icon={MagnifyingGlassIcon} href="/dashboard/discover">
              Discover
            </NavLink>
            <NavLink Icon={InboxIcon} href="/dashboard/applications">
              Applied
            </NavLink>
            <NavLink Icon={ChatBubbleLeftRightIcon} href="/dashboard/messages">
              Messages
            </NavLink>
            <NavLink Icon={UserIcon} href="/dashboard/profile">
              Profile
            </NavLink>
          </nav>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 flex justify-center mt-auto">
        <ThemeSwitch />
      </div>
    </div>
  );
}

// Helper component for navigation links
export function NavLink({
  href,
  children,
  Icon,
}: {
  href: string;
  Icon: React.FC<IconSvgProps>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={cn(
        "flex flex-col  md:gap-1 items-center px-3 py-2 rounded-md hover:bg-primary/10 text-default-700 hover:text-primary transition-colors",
        {
          "text-primary": isActive,
        },
      )}
      href={href}
    >
      <Icon className="size-6" />
      <span className="text-xs md:text-sm">{children}</span>
    </Link>
  );
}
