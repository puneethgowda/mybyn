import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { TypedSupabaseClient } from "@/supabase/types";
import {
  getAllChatRooms,
  getChatDetails,
  getChatMessages,
  sendMessage,
} from "@/supabase/queries/chat-queries";
import { Message, NewMessage } from "@/types/chat";

export function getAllChatRoomsOptions(
  supabase: TypedSupabaseClient,
  userId: string,
) {
  return queryOptions({
    queryKey: ["chat", "rooms", userId],
    queryFn: async () => {
      return getAllChatRooms(supabase, userId);
    },
    enabled: !!userId,
  });
}

export function getChatMessagesOptions(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
) {
  return queryOptions({
    queryKey: ["chat", "room-messages", chatRoomId],
    queryFn: async () => {
      return getChatMessages(supabase, chatRoomId);
    },
    enabled: !!chatRoomId,
  });
}

export function getChatDetailsOptions(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
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
    mutationFn: async (newMessage: NewMessage & { optimistic_id?: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { optimistic_id, ...message } = newMessage;

      return sendMessage(supabase, message);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["chat", "room-messages", variables.chat_room_id],
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
  });
}

export function addOptimisticMessage(
  queryClient: any,
  chatRoomId: string,
  message: Message,
) {
  queryClient.setQueryData(
    ["chat", "room-messages", chatRoomId],
    (oldData: Message[] = []) => [...oldData, message],
  );
}
