import { Database } from "@/supabase/database.types";

export interface RecentApplication {
  id: string;
  creator_profile: {
    id: string;
    name: string;
    instagram_handle: string;
    followers_count: number;
    avatar_url: string | null;
  };
  collab: {
    id: string;
    title: string;
  };
  status: Database["public"]["Enums"]["application_status"];
  created_at: string;
}
