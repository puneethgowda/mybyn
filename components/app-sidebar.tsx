import * as React from "react";
import {
  RiChat1Line,
  RiPlanetLine,
  RiSeedlingLine,
  RiSettings3Line,
  RiHomeLine,
  RiBriefcase3Line,
  RiUser3Line,
  RiShareLine,
  RiMailOpenLine,
  RiSearch2Line,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const brand = {
  name: "KOLLABIT",
  logo: "/assets/logo.png",
};

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
    { title: "Referrals", href: "/dashboard/referrals", icon: RiShareLine },
    { title: "Profile", href: "/dashboard/profile", icon: RiUser3Line },
  ],
};

const secondaryNavData = [
  {
    title: "Community",
    href: "#",
    icon: RiPlanetLine,
  },
  {
    title: "Help Centre",
    href: "#",
    icon: RiSeedlingLine,
  },
  {
    title: "Settings",
    href: "#",
    icon: RiSettings3Line,
  },
];

export function AppSidebar({
  view,
  ...props
}: { view: "business" | "creator" } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="dark !border-none">
      <SidebarHeader>
        <SidebarMenuButton
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3 [&>svg]:size-auto"
          size="lg"
        >
          <div className="flex aspect-square size-9 items-center justify-center rounded-md overflow-hidden bg-sidebar-primary text-sidebar-primary-foreground relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none">
            <Image alt={brand.name} height={36} src={brand.logo} width={36} />
          </div>
          <div className="grid flex-1 text-left text-base leading-tight">
            <span className="truncate font-medium">
              {brand?.name ?? "Select a Team"}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {/* We only show the first parent group */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
            {view}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {navData[view].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group/menu-button font-medium gap-3 h-9 rounded-md data-[active=true]:hover:bg-transparent data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto"
                    isActive={false}
                  >
                    <Link href={item.href}>
                      {item.icon && (
                        <item.icon
                          aria-hidden="true"
                          className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground"
                          size={22}
                        />
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
            More
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {secondaryNavData.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group/menu-button font-medium gap-3 h-9 rounded-md [&>svg]:size-auto"
                    isActive={false}
                  >
                    <a href={item.href}>
                      {item.icon && (
                        <item.icon
                          aria-hidden="true"
                          className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-primary"
                          size={22}
                        />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
