import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAllChatRooms,
  getAllChatRoomsPaginated,
  getChatDetails,
  getChatMessages,
  getChatRoomByApplicationId,
  getChatRoomByParticipants,
  getUnreadMessageCount,
  markMessagesAsRead,
  sendMessage,
} from "@/supabase/queries/chat-queries";
import { TypedSupabaseClient } from "@/supabase/types";
import { Message, NewMessage } from "@/types/chat";

export function getAllChatRoomsOptions(
  supabase: TypedSupabaseClient,
  userId: string
) {
  return queryOptions({
    queryKey: ["chat", "rooms", userId],
    queryFn: async () => {
      return getAllChatRooms(supabase, userId);
    },
    enabled: !!userId,
  });
}

export function useInfiniteChatRooms(
  supabase: TypedSupabaseClient,
  userId: string
) {
  return useInfiniteQuery({
    queryKey: ["chat", "rooms", "infinite", userId],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return getAllChatRoomsPaginated(
        supabase,
        userId,
        pageParam as number,
        20
      );
    },
    getNextPageParam: (lastPage: any) => {
      const totalPages = Math.ceil(lastPage.count / lastPage.pageSize);

      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: !!userId,
  });
}

export function getChatMessagesOptions(
  supabase: TypedSupabaseClient,
  chatRoomId: string
) {
  return queryOptions({
    queryKey: ["chat", "room-messages", chatRoomId],
    queryFn: async () => {
      const result = await getChatMessages(supabase, chatRoomId);

      return result.data;
    },
    enabled: !!chatRoomId,
  });
}

export function useInfiniteChatMessages(
  supabase: TypedSupabaseClient,
  chatRoomId: string
) {
  return useInfiniteQuery({
    queryKey: ["chat", "room-messages", "infinite", chatRoomId],
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

export function getChatDetailsOptions(
  supabase: TypedSupabaseClient,
  chatRoomId: string
) {
  return queryOptions({
    queryKey: ["chat", "room-details", chatRoomId],
    queryFn: async () => {
      return getChatDetails(supabase, chatRoomId);
    },
    enabled: !!chatRoomId,
  });
}

export function useSendMessageMutation(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      optimistic_id: _optimistic_id,
      ...newMessage
    }: NewMessage & { optimistic_id?: string }) => {
      return sendMessage(supabase, newMessage);
    },
    onSuccess: (data, variables) => {
      // Invalidate chat room messages
      queryClient.invalidateQueries({
        queryKey: ["chat", "room-messages", variables.chat_room_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["chat", "room-messages", "infinite", variables.chat_room_id],
      });

      // Invalidate chat rooms list
      queryClient.invalidateQueries({
        queryKey: ["chat", "rooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chat", "rooms", "infinite"],
      });
    },
  });
}

export function useMarkMessagesAsReadMutation(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatRoomId,
      userId: _userId,
    }: {
      chatRoomId: string;
      userId: string;
    }) => {
      return markMessagesAsRead(supabase, chatRoomId);
    },
    onSuccess: (data, variables) => {
      // Invalidate chat room messages
      queryClient.invalidateQueries({
        queryKey: ["chat", "room-messages", variables.chatRoomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chat", "room-messages", "infinite", variables.chatRoomId],
      });

      // Invalidate chat rooms list
      queryClient.invalidateQueries({
        queryKey: ["chat", "rooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chat", "rooms", "infinite"],
      });

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: ["chat", "unread-count", variables.chatRoomId],
      });
    },
  });
}

export function useUnreadMessageCount(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
  userId: string
) {
  return queryOptions({
    queryKey: ["chat", "unread-count", chatRoomId, userId],
    queryFn: async () => {
      return getUnreadMessageCount(supabase, chatRoomId, userId);
    },
    enabled: !!chatRoomId && !!userId,
  });
}

export function useChatRoomByApplicationId(
  supabase: TypedSupabaseClient,
  applicationId: string
) {
  return queryOptions({
    queryKey: ["chat", "room-by-application", applicationId],
    queryFn: async () => {
      return getChatRoomByApplicationId(supabase, applicationId);
    },
    enabled: !!applicationId,
  });
}

export function useChatRoomByParticipants(
  supabase: TypedSupabaseClient,
  creatorId: string,
  businessId: string,
  collabId: string
) {
  return queryOptions({
    queryKey: ["chat", "room-by-participants", creatorId, businessId, collabId],
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
    ["chat", "room-messages", chatRoomId],
    (oldData: Message[] = []) => [...oldData, optimisticMessage]
  );

  queryClient.setQueryData(
    ["chat", "room-messages", "infinite", chatRoomId],
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
