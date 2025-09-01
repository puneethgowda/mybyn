"use client";

import clsx from "clsx";
import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background">
      <div className="container px-6 mx-auto flex items-center justify-between py-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-1" href="/">
            {/*<Logo size={40} />*/}
            <span className="text-xl font-bold">KOLLABIT</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden sm:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {siteConfig.navItems.map(item => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className={clsx(
                      "px-3 py-2 font-semibold transition-colors hover:text-primary",
                      "data-[active=true]:text-primary data-[active=true]:font-bold"
                    )}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Login */}
        <div className="hidden sm:flex items-center gap-2">
          <Button asChild variant="default">
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button aria-label="Open menu" size="icon" variant="ghost">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0" side="right">
              <nav className="flex flex-col gap-4 p-6">
                {siteConfig.navMenuItems.map((item, index) => (
                  <Link
                    key={`${item.label}-${index}`}
                    className="text-center font-bold text-2xl py-2"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
