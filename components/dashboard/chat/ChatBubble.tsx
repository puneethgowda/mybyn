"use client";

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isUser: boolean;
  senderName?: string;
}

export function ChatBubble({
  message,
  timestamp,
  isUser,
  senderName,
}: ChatBubbleProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 shadow-xs
          ${
            isUser
              ? "bg-primary text-white rounded-tr-none"
              : "bg-content2 text-foreground rounded-tl-none"
          }
        `}
      >
        {!isUser && senderName && (
          <p className="text-xs font-medium mb-1 opacity-80">{senderName}</p>
        )}
        <p className="text-sm leading-relaxed">{message}</p>
        <p
          className={`
            text-[10px] mt-1.5 text-right
            ${isUser ? "text-white/70" : "text-foreground/50"}
          `}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
}
