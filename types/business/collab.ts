import { Database } from "@/supabase/database.types";

// Stats for the business dashboard
export interface BusinessDashboardStats {
  activeCampaigns: number;
  totalApplications: number;
  acceptedCollabs: number;
  rejectedCollabs: number;
  profileCompletion: number;
  instagramConnected: boolean;
}

// Recent application type for the dashboard
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

// Active collab type for the dashboard
export interface ActiveCollab {
  id: string;
  title: string;
  collab_type: Database["public"]["Enums"]["collab_type"];
  status: Database["public"]["Enums"]["collab_status"];
  amount: number;
  format: string[];
  created_at: string;
  application_count?: number;
  selected_count?: number;
}

// Dashboard data type
export interface BusinessDashboardData {
  stats: BusinessDashboardStats;
  recentApplications: RecentApplication[];
  activeCollabs: ActiveCollab[];
}

export interface Collab {
  id: string;
  title: string;
  description: string;
  business_id: string;
  collab_type: Database["public"]["Enums"]["collab_type"];
  amount: number;
  format: string[];
  platform: string;
  languages: Database["public"]["Enums"]["languages"][];
  status: Database["public"]["Enums"]["collab_status"];
  created_at: string;
  updated_at: string;
  business_profile?: {
    id: string;
    name: string;
    logo_url?: string;
    description?: string;
    website?: string;
    location?: string;
    type?: Database["public"]["Enums"]["business_type"];
  };
}

export interface CollabApplication {
  id: string;
  collab_id: string;
  creator_id: string;
  status: Database["public"]["Enums"]["application_status"];
  message?: string;
  created_at: string;
  updated_at: string;
  collabs?: Collab;
  creator_profile?: {
    id: string;
    name: string;
    instagram_handle: string;
    followers_count: number;
    avatar_url?: string;
  };
}
