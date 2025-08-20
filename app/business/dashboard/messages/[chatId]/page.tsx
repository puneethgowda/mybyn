"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RiShining2Line } from "@remixicon/react";

import { Skeleton } from "@/components/ui/skeleton";
import { ChatHeader } from "@/components/dashboard/chat/ChatHeader";
import { ChatBubble } from "@/components/dashboard/chat/ChatBubble";
import { MessageInput } from "@/components/dashboard/chat/MessageInput";
import { createClient } from "@/supabase/client";
import { NewMessage } from "@/types/chat";
import { timeAgo } from "@/utils/date";
import { getUserOptions } from "@/utils/react-query/user";
import {
  getChatMessagesOptions,
  getChatDetailsOptions,
  useSendMessageMutation,
  addOptimisticMessage,
} from "@/utils/react-query/business/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BusinessChatRoomPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;
  const userId = user?.id;

  const { data: messages, isPending } = useQuery(
    getChatMessagesOptions(supabase, chatId),
  );
  const { data: chatDetails, isPending: isChatDetailsPending } = useQuery(
    getChatDetailsOptions(supabase, chatId),
  );

  const sendMessageMutation = useSendMessageMutation(supabase);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const handleSendMessage = async (message: string) => {
    if (!userId || !chatId) return;

    const optimistic_id = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const newMessage: NewMessage & { optimistic_id?: string } = {
      sender_id: userId,
      chat_room_id: chatId,
      message,
      optimistic_id,
    };

    const optimisticMessage = {
      ...newMessage,
      id: optimistic_id,
      created_at: new Date().toISOString(),
    };

    addOptimisticMessage(queryClient, chatId, optimisticMessage);

    sendMessageMutation.mutate(newMessage);
  };

  if (isPending || isChatDetailsPending) {
    return (
      <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
        <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
          <div className="p-4">
            <Skeleton className="h-12 w-full lg:max-w-96 rounded-lg" />
          </div>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className={`h-24 w-3/4 rounded-2xl ${
                  i % 2 === 0 ? "ml-auto" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        <ChatHeader
          businessLogo={chatDetails?.creator_profile?.profile_pic_url as string}
          businessName={chatDetails?.creator_profile?.name as string}
          collabTitle={chatDetails?.collabs?.title as string}
        />

        {/* Chat */}
        <div className="relative grow">
          <div className="max-w-3xl mx-auto mt-6 space-y-6">
            <div className="text-center my-8">
              <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
                <RiShining2Line
                  aria-hidden="true"
                  className="me-1.5 text-muted-foreground/70 -ms-1"
                  size={14}
                />
                Today
              </div>
            </div>
            {(messages || []).map((message) => {
              // Group consecutive messages from the same sender
              const isUser = message.sender_id === user?.id;

              // const showSender =
              //   index === 0 || messages[index - 1].sender_id !== user?.id;

              return (
                <ChatBubble
                  key={message.id}
                  isUser={isUser}
                  message={message.message}
                  senderImage={
                    isUser
                      ? user?.user_metadata?.avatar_url
                      : chatDetails?.creator_profile?.profile_pic_url
                  }
                  senderName={undefined}
                  timestamp={timeAgo(message.created_at)}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <MessageInput
          isSending={sendMessageMutation.isPending}
          onSendMessage={handleSendMessage}
        />
      </div>
    </ScrollArea>
  );
}
