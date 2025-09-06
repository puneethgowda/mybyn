"use client";

import { RiAttachment2, RiSendPlaneLine } from "@remixicon/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

export function MessageInput({ onSendMessage, isSending }: MessageInputProps) {
  const [message, setMessage] = useState<string>("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 pt-4 md:pt-8 z-50">
      <div className="max-w-3xl mx-auto bg-background rounded-[20px] pb-4 md:pb-8">
        <div className="relative rounded-[20px] border border-transparent bg-muted transition-colors focus-within:bg-muted/50 focus-within:border-input has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
          <textarea
            aria-label="Message..."
            className="flex border-none sm:min-h-[64px] w-full bg-transparent px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none [resize:none]"
            placeholder="Message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {/* Textarea buttons */}
          <div className="flex items-center justify-between gap-2 p-3">
            {/* Left buttons */}
            <div className="flex items-center gap-2">
              <Button
                className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                size="icon"
                variant="outline"
              >
                <RiAttachment2
                  aria-hidden="true"
                  className="text-muted-foreground/70 size-5"
                  size={20}
                />
                <span className="sr-only">Attach</span>
              </Button>
            </div>
            {/* Right buttons */}
            <div className="flex items-center gap-2">
              <Button
                className="h-8"
                disabled={!message.trim() || isSending}
                onClick={handleSend}
              >
                <RiSendPlaneLine />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
