import { Database } from "@/supabase/database.types";

// Use the database types for chat messages
export type Message = Database["public"]["Tables"]["chat_messages"]["Row"];
export type NewMessage =
  Database["public"]["Tables"]["chat_messages"]["Insert"];

type ChatRoomType = Database["public"]["Tables"]["chat_rooms"]["Row"];

export interface ChatRoom extends ChatRoomType {
  collabs: {
    title: string;
    business_profile: {
      name: string;
      logo_url: string;
    };
  };
}

// Chat details for UI display
export interface ChatDetails {
  name: string;
  logo: string;
  collabTitle: string;
}
