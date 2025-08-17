import { RiLogoutCircleLine, RiUserLine } from "@remixicon/react";
import { User } from "@supabase/auth-js";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/supabase/client";

export default function UserDropdown({ user }: { user: User | undefined }) {
  const supabase = createClient();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
          <Avatar className="size-8">
            <AvatarImage
              alt={user?.user_metadata.name}
              height={32}
              src={user?.user_metadata.avatar_url}
              width={32}
            />
            <AvatarFallback className=" rounded-md">
              {user?.user_metadata.name}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64 p-2">
        <DropdownMenuLabel className="flex min-w-0 flex-col py-0 px-1 mb-2">
          <span className="truncate text-sm font-medium text-foreground mb-0.5">
            {user?.user_metadata.name}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user?.user_metadata.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="gap-3 px-1"
          onClick={() => {
            router.push("/dashboard/profile");
          }}
        >
          <RiUserLine
            aria-hidden="true"
            className="text-muted-foreground/70"
            size={20}
          />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-3 px-1"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
        >
          <RiLogoutCircleLine
            aria-hidden="true"
            className="text-muted-foreground/70"
            size={20}
          />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
