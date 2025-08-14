"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { SendDiagonal } from "iconoir-react";

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
    <div className="py-3 bg-background/60 backdrop-blur-md sticky bottom-0">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        {/*<Button*/}
        {/*  isIconOnly*/}
        {/*  aria-label="Attach file"*/}
        {/*  className="text-foreground/70"*/}
        {/*  size="sm"*/}
        {/*  variant="light"*/}
        {/*>*/}
        {/*  <svg*/}
        {/*    fill="none"*/}
        {/*    height="18"*/}
        {/*    stroke="currentColor"*/}
        {/*    strokeLinecap="round"*/}
        {/*    strokeLinejoin="round"*/}
        {/*    strokeWidth="2"*/}
        {/*    viewBox="0 0 24 24"*/}
        {/*    width="18"*/}
        {/*    xmlns="http://www.w3.org/2000/svg"*/}
        {/*  >*/}
        {/*    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />*/}
        {/*  </svg>*/}
        {/*</Button>*/}

        <Input
          className="flex-1"
          placeholder="Type a message..."
          size="lg"
          value={message}
          variant="bordered"
          onKeyDown={handleKeyPress}
          onValueChange={setMessage}
        />

        <Button
          isIconOnly
          color="primary"
          isDisabled={!message.trim()}
          isLoading={isSending}
          radius="full"
          size="lg"
          onPress={handleSend}
        >
          <SendDiagonal />
        </Button>
      </div>
    </div>
  );
}
