import { TypedSupabaseClient } from "@/supabase/types";
import { Message } from "@/types/chat";

/**
 * Get all chat rooms for a user
 */
export async function getAllChatRooms(
  supabase: TypedSupabaseClient,
  businessId: string,
) {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select(
      `
              *,
              ...collab_applications!inner(
               creator_profile!inner(*),
                collabs!inner(
                  id,
                  business_id,
                  title
                  )
                )
            `,
    )
    .eq("collab_applications.collabs.business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Get messages for a specific chat room
 */
export async function getChatMessages(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}

/**
 * Get chat room details
 */
export async function getChatDetails(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
) {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select(
      `
      *,
      ...collab_applications!inner (
       creator_profile!inner (
          name,
          instagram_handle,
          profile_pic_url
        ),
        collabs!inner (
          title
        )
      )
    `,
    )
    .eq("id", chatRoomId)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Send a message to a chat room
 */
export async function sendMessage(
  supabase: TypedSupabaseClient,
  message: {
    chat_room_id: string;
    sender_id: string;
    message: string;
  },
): Promise<Message> {
  // Insert the message
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      chat_room_id: message.chat_room_id,
      sender_id: message.sender_id,
      message: message.message,
    })
    .select()
    .single();

  if (error) throw error;

  // Update the chat room's updated_at timestamp
  await supabase
    .from("chat_rooms")
    .update({
      updated_at: new Date().toISOString(),
      unread: true,
    })
    .eq("id", message.chat_room_id);

  return data;
}
