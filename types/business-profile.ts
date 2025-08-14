import { Database } from "@/supabase/database.types";

export interface BusinessProfile {
  id: string;
  type: Database["public"]["Enums"]["business_type"];
  website: string;
  location: string;
  logo_url: string;
  owner_id: string;
  created_at: string;
  description: string;
  name: string;
  email: string;
  phone: string;
}

export interface BusinessProfileFormValues
  extends Omit<BusinessProfile, "id" | "owner_id" | "created_at"> {}

export type BusinessType = Database["public"]["Enums"]["business_type"];
