"use client";
import {
  RiCodeSSlashLine,
  RiBookLine,
  RiLoopRightFill,
  RiCheckLine,
} from "@remixicon/react";

import { cn } from "@/lib/utils";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isUser: boolean;
  senderName?: string;
  senderImage?: string;
}

export function ChatBubble({
  message,
  timestamp,
  isUser,
  senderName,
  senderImage,
}: ChatBubbleProps) {
  return (
    <article
      className={cn(
        "flex items-start gap-4 text-[15px] leading-relaxed",
        isUser && "justify-end",
      )}
    >
      <Avatar
        className={cn(
          "size-8 rounded-md",
          isUser ? "order-1" : "border border-black/[0.08] shadow-sm",
        )}
      >
        <AvatarImage
          alt={senderName}
          height={32}
          src={senderImage}
          width={32}
        />
        <AvatarFallback className=" rounded-md">{senderName}</AvatarFallback>
      </Avatar>
      <div
        className={cn(isUser ? "bg-muted px-4 py-3 rounded-xl" : "space-y-4")}
      >
        <div className="flex flex-col mb-1">
          <p>{message}</p>
        </div>
        <p className="text-[10px] text-left text-muted-foreground">
          {timestamp}
        </p>
      </div>
    </article>
  );
}

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
};

function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="relative text-muted-foreground/80 hover:text-foreground transition-colors size-8 flex items-center justify-center before:absolute before:inset-y-1.5 before:left-0 before:w-px before:bg-border first:before:hidden first-of-type:rounded-s-lg last-of-type:rounded-e-lg focus-visible:z-10 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70">
          {icon}
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="dark px-2 py-1 text-xs" side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function MessageActions() {
  return (
    <div className="relative inline-flex bg-white rounded-md border border-black/[0.08] shadow-sm -space-x-px">
      <TooltipProvider delayDuration={0}>
        <ActionButton icon={<RiCodeSSlashLine size={16} />} label="Show code" />
        <ActionButton icon={<RiBookLine size={16} />} label="Bookmark" />
        <ActionButton icon={<RiLoopRightFill size={16} />} label="Refresh" />
        <ActionButton icon={<RiCheckLine size={16} />} label="Approve" />
      </TooltipProvider>
    </div>
  );
}
