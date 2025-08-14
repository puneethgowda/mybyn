import { Database } from "@/supabase/database.types";

// Base collab type from database
export type Collab = Database["public"]["Tables"]["collabs"]["Row"];

// Collab with business profile
export interface CollabWithBusinessProfile extends Collab {
  business_profile: Database["public"]["Tables"]["business_profile"]["Row"];
}

// Collab application
export type CollabApplication =
  Database["public"]["Tables"]["collab_applications"]["Row"];

// Collab application with collab details
export interface CollabApplicationWithCollab extends CollabApplication {
  collabs: CollabWithBusinessProfile;
}

// Enums from database
export type CollabType = Database["public"]["Enums"]["collab_type"];
export type CollabStatus = Database["public"]["Enums"]["collab_status"];
export type ApplicationStatus =
  Database["public"]["Enums"]["application_status"];
