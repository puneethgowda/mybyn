import { TypedSupabaseClient } from "@/supabase/types";
import { NewMessage } from "@/types/chat";

export async function getAllChatRooms(
  supabase: TypedSupabaseClient,
  userId: string,
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
            `,
    )
    .eq("collab_applications.creator_id", userId);

  if (error) throw error;

  return data;
}

export async function getChatMessages(
  supabase: TypedSupabaseClient,
  chatRoomId: string,
) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select(`*`)
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}

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
         ...collabs (
         collab_id:id,
          collab_title:title,
          ...business_profile (
            business_name:name,
            logo_url
          )
        )
        )
      `,
    )
    .eq("id", chatRoomId)
    .single();

  if (error) throw error;

  return data;
}

export async function sendMessage(
  supabase: TypedSupabaseClient,
  newMessage: NewMessage,
) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(newMessage)
    .select()
    .single();

  if (error) throw error;

  return data;
}
