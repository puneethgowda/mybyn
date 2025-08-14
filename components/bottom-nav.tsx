"use client";

import {
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { NavLink } from "./sidebar";

export function BottomNav({ view }: { view: "business" | "creator" }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 z-10 right-0 bg-background border-t border-default-200">
      <nav className="flex justify-around p-2">
        {view === "business" && (
          <>
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
          </>
        )}
        {view === "creator" && (
          <>
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
          </>
        )}
      </nav>
    </div>
  );
}
