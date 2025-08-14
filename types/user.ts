import { Database } from "@/supabase/database.types";

// User profile from database
export type UserProfile = Database["public"]["Tables"]["user_profile"]["Row"];

// Business profile from database
export type BusinessProfile =
  Database["public"]["Tables"]["business_profile"]["Row"];

// Creator profile from database
export type CreatorProfile =
  Database["public"]["Tables"]["creator_profile"]["Row"];
