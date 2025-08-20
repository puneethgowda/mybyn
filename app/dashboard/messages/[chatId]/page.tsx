"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RiShining2Line } from "@remixicon/react";

import { Skeleton } from "@/components/ui/skeleton";
import { ChatHeader } from "@/components/dashboard/chat/ChatHeader";
import { ChatBubble } from "@/components/dashboard/chat/ChatBubble";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageInput } from "@/components/dashboard/chat/MessageInput";

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

    const optimistic_id = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

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

        toast.error("Failed to send message");
      },
    });
  };

  const isLoading = messagesLoading || detailsLoading;

  if (isLoading || !chatDetails) {
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
          businessLogo={chatDetails?.logo_url}
          businessName={chatDetails?.business_name}
          collabTitle={chatDetails?.collab_title}
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
                  senderImage={
                    isUser
                      ? userData?.user?.user_metadata?.avatar_url
                      : chatDetails?.logo_url
                  }
                  senderName={
                    showSender && !isUser
                      ? chatDetails.business_name
                      : undefined
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
        {/*</div>*/}
      </div>
    </ScrollArea>
  );
}
