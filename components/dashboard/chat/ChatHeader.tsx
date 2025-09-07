"use client";

import { RiArrowLeftLine } from "@remixicon/react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toTitleCase } from "@/utils/string";

interface ChatHeaderProps {
  businessName: string;
  businessLogo: string;
  collabTitle: string;
}

export function ChatHeader({
  businessName,
  businessLogo,
  collabTitle,
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div className="py-5 bg-background sticky top-0 z-10 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={() => router.back()}>
          <RiArrowLeftLine />
        </Button>

        <Avatar className="size-10 rounded-md">
          <AvatarImage
            alt={businessName}
            height={32}
            src={businessLogo}
            width={32}
          />
          <AvatarFallback className=" rounded-md">
            {businessName}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-medium text-foreground">
            {toTitleCase(businessName)}
          </h3>
          <p className="text-xs text-foreground/60">
            {toTitleCase(collabTitle)}
          </p>
        </div>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary">
              <RiMoreLine />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Block</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
}
