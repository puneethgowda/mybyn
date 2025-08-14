"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@heroui/skeleton";
import { addToast } from "@heroui/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ChatHeader } from "@/components/dashboard/chat/ChatHeader";
import { ChatBubble } from "@/components/dashboard/chat/ChatBubble";
import { MessageInput } from "@/components/dashboard/chat/MessageInput";
import { Message, NewMessage } from "@/types/chat";
import { timeAgo } from "@/utils/date";
import { createClient } from "@/supabase/client";
import {
  getChatMessagesOptions,
  getChatDetailsOptions,
  useSendMessageMutation,
  addOptimisticMessage,
} from "@/utils/react-query/chat";
import { getUserOptions } from "@/utils/react-query/user";

export default function ChatRoomPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const supabase = createClient();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useQuery(getUserOptions(supabase));
  const userId = userData?.user?.id;

  const { data: messages = [], isLoading: messagesLoading } = useQuery(
    getChatMessagesOptions(supabase, chatId),
  );

  const { data: chatDetails, isLoading: detailsLoading } = useQuery(
    getChatDetailsOptions(supabase, chatId),
  );

  const sendMessageMutation = useSendMessageMutation(supabase);

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

    const optimisticMessage: Message = {
      ...newMessage,
      id: optimistic_id,
      created_at: new Date().toISOString(),
    };

    addOptimisticMessage(queryClient, chatId, optimisticMessage);

    sendMessageMutation.mutate(newMessage, {
      onError: () => {
        queryClient.setQueryData(
          ["chat", "room-messages", chatId],
          (oldData: Message[] = []) =>
            oldData.filter((msg) => msg.id !== optimistic_id),
        );

        addToast({
          title: "Failed to send message",
          description: "Something went wrong. Please try again.",
          color: "danger",
        });
      },
    });
  };

  const isLoading = messagesLoading || detailsLoading;

  if (isLoading || !chatDetails) {
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
        businessLogo={chatDetails?.logo_url}
        businessName={chatDetails?.business_name}
        collabTitle={chatDetails?.collab_title}
      />

      <div className="flex-1 py-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center my-4">
            <div className="bg-content3 text-foreground/60 text-xs px-3 py-1 rounded-full">
              Today
            </div>
          </div>

          {messages.map((message) => {
            const isUser = message.sender_id === userId;

            // const showSender =
            //   index === 0 || messages[index - 1].sender_id !== message.sender_id;
            const showSender = true;

            return (
              <ChatBubble
                key={message.id}
                isUser={isUser}
                message={message.message}
                senderName={
                  showSender && !isUser ? chatDetails.business_name : undefined
                }
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
