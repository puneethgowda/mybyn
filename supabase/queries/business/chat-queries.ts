import { TypedSupabaseClient } from "@/supabase/types";
import { Message } from "@/types/chat";

/**
 * Get all chat rooms for a business
 */
export async function getAllChatRooms(
  supabase: TypedSupabaseClient,
  businessId: string
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
            `
    )
    .eq("collab_applications.collabs.business_id", businessId)
    .order("last_message_at", { ascending: false })
    .order("unread", { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Get all chat rooms for a business with pagination
 */
export async function getAllBusinessChatRoomsPaginated(
  supabase: TypedSupabaseClient,
  businessId: string,
  page: number = 1,
  pageSize: number = 20
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
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
      { count: "exact" }
    )
    .eq("collab_applications.collabs.business_id", businessId)
    .order("last_message_at", { ascending: false })
    .order("unread", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
  };
}

/**
 * Get messages for a specific chat room
 */
export async function getChatMessages(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
  page: number = 1,
  pageSize: number = 50
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact" })
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data || []).reverse(), // Reverse to maintain chronological order
    count: count || 0,
    page,
    pageSize,
  };
}

/**
 * Get chat room details
 */
export async function getChatDetails(
  supabase: TypedSupabaseClient,
  chatRoomId: string
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
    `
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
  }
): Promise<Message> {
  // Insert the message - the database trigger will handle updating last_message* fields
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

  if (message.chat_room_id) {
    // Always mark as unread when a message is sent
    // The other participant will see this as unread
    await supabase
      .from("chat_rooms")
      .update({ unread: true })
      .eq("id", message.chat_room_id);
  }

  return data;
}

/**
 * Mark messages as read for a user
 */
export async function markMessagesAsRead(
  supabase: TypedSupabaseClient,
  chatRoomId: string
) {
  const { error } = await supabase
    .from("chat_rooms")
    .update({ unread: false })
    .eq("id", chatRoomId);

  if (error) throw error;

  return true;
}

/**
 * Get unread message count for a user in a chat room
 */
export async function getUnreadMessageCount(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
  userId: string
) {
  const { count, error } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("chat_room_id", chatRoomId)
    .neq("sender_id", userId)
    .is("read_by", null);

  if (error) throw error;

  return count || 0;
}

/**
 * Get chat room by application ID
 */
export async function getChatRoomByApplicationId(
  supabase: TypedSupabaseClient,
  applicationId: string
) {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("collab_application_id", applicationId)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Get chat room by participants
 */
export async function getChatRoomByParticipants(
  supabase: TypedSupabaseClient,
  creatorId: string,
  businessId: string,
  collabId: string
) {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("collab_applications.creator_id", creatorId)
    .eq("collab_applications.collabs.business_id", businessId)
    .eq("collab_applications.collab_id", collabId)
    .single();

  if (error) throw error;

  return data;
}
