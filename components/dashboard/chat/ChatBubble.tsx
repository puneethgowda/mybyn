"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
        "flex items-start gap-4 text-[15px] leading-relaxed mb-4",
        isUser && "justify-end"
      )}
    >
      <Avatar
        className={cn(
          "size-8 rounded-md",
          isUser ? "order-1" : "border border-black/[0.08] shadow-sm"
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
