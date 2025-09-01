import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAllBusinessChatRoomsPaginated,
  getAllChatRooms,
  getChatDetails,
  getChatMessages,
  getChatRoomByApplicationId,
  getChatRoomByParticipants,
  getUnreadMessageCount,
  markMessagesAsRead,
  sendMessage,
} from "@/supabase/queries/business/chat-queries";
import { TypedSupabaseClient } from "@/supabase/types";
import { Message } from "@/types/chat";

/**
 * React Query options for fetching all chat rooms
 */
export function getAllChatRoomsOptions(
  supabase: TypedSupabaseClient,
  businessId: string
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
 * React Query hook for infinite chat rooms
 */
export function useInfiniteBusinessChatRooms(
  supabase: TypedSupabaseClient,
  businessId: string
) {
  return useInfiniteQuery({
    queryKey: ["business", "chat", "rooms", "infinite", businessId],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return getAllBusinessChatRoomsPaginated(
        supabase,
        businessId,
        pageParam as number,
        20
      );
    },
    getNextPageParam: (lastPage: any) => {
      const totalPages = Math.ceil(lastPage.count / lastPage.pageSize);

      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: !!businessId,
  });
}

/**
 * React Query options for fetching chat messages
 */
export function getChatMessagesOptions(
  supabase: TypedSupabaseClient,
  chatRoomId: string
) {
  return queryOptions({
    queryKey: ["business", "chat", "room-messages", chatRoomId],
    queryFn: async () => {
      const result = await getChatMessages(supabase, chatRoomId);

      return result.data;
    },
    enabled: !!chatRoomId,
  });
}

/**
 * React Query hook for infinite chat messages
 */
export function useInfiniteBusinessChatMessages(
  supabase: TypedSupabaseClient,
  chatRoomId: string
) {
  return useInfiniteQuery({
    queryKey: ["business", "chat", "room-messages", "infinite", chatRoomId],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return getChatMessages(supabase, chatRoomId, pageParam as number, 50);
    },
    getNextPageParam: (lastPage: any) => {
      const totalPages = Math.ceil(lastPage.count / lastPage.pageSize);

      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: !!chatRoomId,
  });
}

/**
 * React Query options for fetching chat details
 */
export function getChatDetailsOptions(
  supabase: TypedSupabaseClient,
  chatRoomId: string
) {
  return queryOptions({
    queryKey: ["business", "chat", "room-details", chatRoomId],
    queryFn: async () => {
      return getChatDetails(supabase, chatRoomId);
    },
    enabled: !!chatRoomId,
  });
}

/**
 * React Query mutation for sending messages
 */
export function useSendMessageMutation(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: {
      chat_room_id: string;
      sender_id: string;
      message: string;
    }) => {
      return sendMessage(supabase, message);
    },
    onSuccess: (data, variables) => {
      // Invalidate chat room messages
      queryClient.invalidateQueries({
        queryKey: ["business", "chat", "room-messages", variables.chat_room_id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "business",
          "chat",
          "room-messages",
          "infinite",
          variables.chat_room_id,
        ],
      });

      // Invalidate chat rooms list
      queryClient.invalidateQueries({
        queryKey: ["business", "chat", "rooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["business", "chat", "rooms", "infinite"],
      });
    },
  });
}

/**
 * React Query mutation for marking messages as read
 */
export function useMarkMessagesAsReadMutation(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatRoomId,
    }: {
      chatRoomId: string;
      userId: string;
    }) => {
      return markMessagesAsRead(supabase, chatRoomId);
    },
    onSuccess: (data, variables) => {
      // Invalidate chat room messages
      queryClient.invalidateQueries({
        queryKey: ["business", "chat", "room-messages", variables.chatRoomId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "business",
          "chat",
          "room-messages",
          "infinite",
          variables.chatRoomId,
        ],
      });

      // Invalidate chat rooms list
      queryClient.invalidateQueries({
        queryKey: ["business", "chat", "rooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["business", "chat", "rooms", "infinite"],
      });

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: ["business", "chat", "unread-count", variables.chatRoomId],
      });
    },
  });
}

/**
 * React Query options for unread message count
 */
export function useUnreadMessageCount(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
  userId: string
) {
  return queryOptions({
    queryKey: ["business", "chat", "unread-count", chatRoomId, userId],
    queryFn: async () => {
      return getUnreadMessageCount(supabase, chatRoomId, userId);
    },
    enabled: !!chatRoomId && !!userId,
  });
}

/**
 * React Query options for getting chat room by application ID
 */
export function useChatRoomByApplicationId(
  supabase: TypedSupabaseClient,
  applicationId: string
) {
  return queryOptions({
    queryKey: ["business", "chat", "room-by-application", applicationId],
    queryFn: async () => {
      return getChatRoomByApplicationId(supabase, applicationId);
    },
    enabled: !!applicationId,
  });
}

/**
 * React Query options for getting chat room by participants
 */
export function useChatRoomByParticipants(
  supabase: TypedSupabaseClient,
  creatorId: string,
  businessId: string,
  collabId: string
) {
  return queryOptions({
    queryKey: [
      "business",
      "chat",
      "room-by-participants",
      creatorId,
      businessId,
      collabId,
    ],
    queryFn: async () => {
      return getChatRoomByParticipants(
        supabase,
        creatorId,
        businessId,
        collabId
      );
    },
    enabled: !!creatorId && !!businessId && !!collabId,
  });
}

// Helper function for optimistic updates
export function addOptimisticMessage(
  queryClient: any,
  chatRoomId: string,
  optimisticMessage: Message
) {
  queryClient.setQueryData(
    ["business", "chat", "room-messages", chatRoomId],
    (oldData: Message[] = []) => [...oldData, optimisticMessage]
  );

  queryClient.setQueryData(
    ["business", "chat", "room-messages", "infinite", chatRoomId],
    (oldData: any) => {
      if (!oldData?.pages) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page: any, index: number) => {
          if (index === oldData.pages.length - 1) {
            return {
              ...page,
              data: [...page.data, optimisticMessage],
            };
          }

          return page;
        }),
      };
    }
  );
}
