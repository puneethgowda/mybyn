import { TypedSupabaseClient } from "@/supabase/types";
import { NewMessage } from "@/types/chat";

export async function getAllChatRooms(
  supabase: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select(
      `
              *,
              ...collab_applications!inner(
                collabs!inner(
                  title,
                  business_profile!inner (
                    *
                  )
                  )
                )
            `
    )
    .eq("collab_applications.creator_id", userId)
    .order("last_message_at", { ascending: false })
    .order("unread", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getAllChatRoomsPaginated(
  supabase: TypedSupabaseClient,
  userId: string,
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
                collabs!inner(
                  title,
                  business_profile!inner (
                    *
                  )
                  )
                )
            `,
      { count: "exact" }
    )
    .eq("collab_applications.creator_id", userId)
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
    .select(`*`, { count: "exact" })
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
         ...collabs (
         collab_id:id,
          collab_title:title,
          ...business_profile (
            business_name:name,
            logo_url
          )
        )
        )
      `
    )
    .eq("id", chatRoomId)
    .single();

  if (error) throw error;

  return data;
}

export async function sendMessage(
  supabase: TypedSupabaseClient,
  newMessage: NewMessage
) {
  // Insert the message - the database trigger will handle updating last_message* fields
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(newMessage)
    .select()
    .single();

  if (error) throw error;

  if (newMessage.chat_room_id) {
    // Always mark as unread when a message is sent
    // The other participant will see this as unread
    await supabase
      .from("chat_rooms")
      .update({ unread: true })
      .eq("id", newMessage.chat_room_id);
  }

  return data;
}

export async function markMessagesAsRead(
  supabase: TypedSupabaseClient,
  chatRoomId: string
) {
  // Mark chat room as read when user enters the chat
  const { error } = await supabase
    .from("chat_rooms")
    .update({ unread: false })
    .eq("id", chatRoomId);

  if (error) throw error;

  return true;
}

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
