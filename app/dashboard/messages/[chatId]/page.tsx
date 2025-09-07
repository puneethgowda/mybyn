"use client";

import { RiShining2Line } from "@remixicon/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { ChatBubble } from "@/components/dashboard/chat/ChatBubble";
import { ChatHeader } from "@/components/dashboard/chat/ChatHeader";
import { MessageInput } from "@/components/dashboard/chat/MessageInput";
import { createClient } from "@/supabase/client";
import { Message, NewMessage } from "@/types/chat";
import { groupMessagesByDate, timeAgo } from "@/utils/date";
import {
  addOptimisticMessage,
  getChatDetailsOptions,
  useInfiniteChatMessages,
  useMarkMessagesAsReadMutation,
  useSendMessageMutation,
} from "@/utils/react-query/chat";
import { getUserOptions } from "@/utils/react-query/user";

export default function ChatRoomPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const supabase = createClient();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useQuery(getUserOptions(supabase));
  const userId = userData?.user?.id;

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: messagesLoading,
  } = useInfiniteChatMessages(supabase, chatId);

  const { data: chatDetails, isLoading: detailsLoading } = useQuery(
    getChatDetailsOptions(supabase, chatId)
  );

  const sendMessageMutation = useSendMessageMutation(supabase);
  const markMessagesAsReadMutation = useMarkMessagesAsReadMutation(supabase);

  // Flatten all messages from all pages
  const allMessages =
    messagesData?.pages.flatMap((page: any) => page.data) || [];

  // Group messages by date
  const messageGroups = groupMessagesByDate(allMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Mark messages as read when entering chat room
  useEffect(() => {
    if (chatId && userId && allMessages.length > 0 && chatDetails?.unread) {
      markMessagesAsReadMutation.mutate({
        chatRoomId: chatId,
        userId: userId,
      });
    }
  }, [chatId, userId, allMessages.length, chatDetails?.unread]);

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
            oldData.filter(msg => msg.id !== optimistic_id)
        );

        toast.error("Failed to send message");
      },
    });
  };

  // Infinite scroll handler for loading older messages
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;

    if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const isLoading = messagesLoading || detailsLoading;

  if (isLoading || !chatDetails) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col px-4 md:px-6 lg:px-8 md:shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl  w-full bg-background pb-20 md:pb-4">
      <ChatHeader
        businessLogo={chatDetails?.logo_url}
        businessName={chatDetails?.business_name}
        collabTitle={chatDetails?.collab_title}
      />

      {/* Chat */}
      <div className="relative grow">
        <div
          ref={scrollContainerRef}
          className="max-w-3xl mx-auto mt-6 space-y-6 h-full overflow-y-auto"
          onScroll={handleScroll}
        >
          {/* Loading indicator for older messages */}
          {isFetchingNextPage && (
            <div className="text-center py-4">
              <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
                <RiShining2Line
                  aria-hidden="true"
                  className="me-1.5 text-muted-foreground/70 -ms-1"
                  size={14}
                />
                Loading older messages...
              </div>
            </div>
          )}

          {/* Message groups */}
          {messageGroups.map(group => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="text-center my-8">
                <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
                  <RiShining2Line
                    aria-hidden="true"
                    className="me-1.5 text-muted-foreground/70 -ms-1"
                    size={14}
                  />
                  {group.label}
                </div>
              </div>

              {/* Messages in this group */}
              {group.messages.map((message: any) => {
                const isUser = message.sender_id === userId;
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
            </div>
          ))}

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
