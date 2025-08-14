"use client";

import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreHoriz } from "iconoir-react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

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
    <div className="py-4 bg-background/60 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <Button
          isIconOnly
          className=""
          variant="light"
          onPress={() => router.back()}
        >
          <ArrowLeft />
        </Button>

        <Avatar
          className="bg-primary/10 text-primary"
          radius="lg"
          size="md"
          src={businessLogo}
        />

        <div className="flex-1">
          <h3 className="font-medium text-foreground">
            {toTitleCase(businessName)}
          </h3>
          <p className="text-xs text-foreground/60">
            {toTitleCase(collabTitle)}
          </p>
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="solid">
              <MoreHoriz />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">View Profile</DropdownItem>
            <DropdownItem key="copy">Block</DropdownItem>
            <DropdownItem key="edit">Report</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
