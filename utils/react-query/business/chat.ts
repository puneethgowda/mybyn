import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { TypedSupabaseClient } from "@/supabase/types";
import {
  getAllChatRooms,
  getChatMessages,
  getChatDetails,
  sendMessage,
} from "@/supabase/queries/business/chat-queries";
import { Message } from "@/types/chat";

/**
 * React Query options for fetching all chat rooms
 */
export function getAllChatRoomsOptions(
  supabase: TypedSupabaseClient,
  businessId: string,
) {
  return queryOptions({
    queryKey: businessId ? ["business", "chat", "rooms", businessId] : [],
    queryFn: async () => {
      if (!businessId) return [];

      return getAllChatRooms(supabase, businessId);
    },
    enabled: !!businessId,
  });
}

/**
 * React Query options for fetching chat messages
 */
export function getChatMessagesOptions(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
) {
  return queryOptions({
    queryKey: ["business", "chat", "room-messages", chatRoomId],
    queryFn: async () => {
      if (!chatRoomId) return [];

      return getChatMessages(supabase, chatRoomId);
    },
    enabled: !!chatRoomId,
  });
}

/**
 * React Query options for fetching chat details
 */
export function getChatDetailsOptions(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
) {
  return queryOptions({
    queryKey: ["business", "chat", "room-details", chatRoomId],
    queryFn: async () => {
      if (!chatRoomId) return null;

      return getChatDetails(supabase, chatRoomId);
    },
    enabled: !!chatRoomId,
  });
}

/**
 * React Query mutation for sending a message
 */
export function useSendMessageMutation(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMessage: {
      chat_room_id: string;
      sender_id: string;
      message: string;
      optimistic_id?: string;
    }) => {
      return sendMessage(supabase, newMessage);
    },
    onSuccess: (data, variables) => {
      // Update the messages cache
      queryClient.setQueryData(
        ["business", "chat", "room-messages", variables.chat_room_id],
        (oldData: Message[] = []) => {
          const messageExists = oldData.some(
            (msg) => msg.id === variables.optimistic_id,
          );

          if (messageExists) {
            return oldData.map((msg) =>
              msg.id === variables.optimistic_id ? data : msg,
            );
          }

          return [...oldData, data];
        },
      );
    },
    onError: (error, variables) => {
      queryClient.setQueryData(
        ["business", "chat", "room-messages", variables.chat_room_id],
        (oldData: Message[] = []) =>
          oldData.filter((msg) => msg.id !== variables.optimistic_id),
      );

      addToast({
        title: "Failed to send message",
        description: "Something went wrong. Please try again.",
        color: "danger",
      });
    },
  });
}

/**
 * Helper function to add an optimistic message to the cache
 */

export function addOptimisticMessage(
  queryClient: any,
  chatRoomId: string,
  message: Message,
) {
  queryClient.setQueryData(
    ["business", "chat", "room-messages", chatRoomId],
    (oldData: Message[] = []) => [...oldData, message],
  );
}
