"use client";

import { RiShining2Line } from "@remixicon/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { ChatBubble } from "@/components/dashboard/chat/ChatBubble";
import { ChatHeader } from "@/components/dashboard/chat/ChatHeader";
import { MessageInput } from "@/components/dashboard/chat/MessageInput";
import { createClient } from "@/supabase/client";
import { NewMessage } from "@/types/chat";
import { groupMessagesByDate, timeAgo } from "@/utils/date";
import {
  addOptimisticMessage,
  getChatDetailsOptions,
  useInfiniteBusinessChatMessages,
  useMarkMessagesAsReadMutation,
  useSendMessageMutation,
} from "@/utils/react-query/business/chat";
import { getUserOptions } from "@/utils/react-query/user";

export default function BusinessChatRoomPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;
  const userId = user?.id;

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: messagesLoading,
  } = useInfiniteBusinessChatMessages(supabase, chatId);

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

  // Scroll to bottom when messages change
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

    const optimisticMessage = {
      ...newMessage,
      id: optimistic_id,
      created_at: new Date().toISOString(),
    };

    addOptimisticMessage(queryClient, chatId, optimisticMessage);

    sendMessageMutation.mutate(newMessage);
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
    <div className="flex flex-col px-4 md:px-6 lg:px-8 md:shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl  w-full bg-background pb-16 md:pb-4">
      <ChatHeader
        businessLogo={chatDetails?.creator_profile?.profile_pic_url as string}
        businessName={chatDetails?.creator_profile?.name as string}
        collabTitle={chatDetails?.collabs?.title as string}
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
                // Group consecutive messages from the same sender
                const isUser = message.sender_id === user?.id;

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
