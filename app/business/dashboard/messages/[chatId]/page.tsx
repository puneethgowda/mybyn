"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@heroui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

    const optimistic_id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

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
      <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-background/40">
        <div className="p-4">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {[1, 2].map((i) => (
            <Skeleton
              key={i}
              className={`h-24 w-3/4 rounded-2xl ${i % 2 === 0 ? "ml-auto" : ""}`}
            />
          ))}
        </div>
        <div className="p-4">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-background/40">
      <ChatHeader
        businessLogo={chatDetails?.creator_profile?.profile_pic_url as string}
        businessName={chatDetails?.creator_profile?.name as string}
        collabTitle={chatDetails?.collabs?.title as string}
      />

      <div className="flex-1 py-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Date separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-content3 text-foreground/60 text-xs px-3 py-1 rounded-full">
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
  );
}
