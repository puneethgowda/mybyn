export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      business_profile: {
        Row: {
          created_at: string;
          description: string | null;
          email: string;
          id: string;
          location: string;
          logo_url: string;
          name: string;
          owner_id: string;
          phone: string | null;
          type: Database["public"]["Enums"]["business_type"];
          website: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          email: string;
          id?: string;
          location: string;
          logo_url: string;
          name?: string;
          owner_id: string;
          phone?: string | null;
          type: Database["public"]["Enums"]["business_type"];
          website?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          email?: string;
          id?: string;
          location?: string;
          logo_url?: string;
          name?: string;
          owner_id?: string;
          phone?: string | null;
          type?: Database["public"]["Enums"]["business_type"];
          website?: string | null;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          chat_room_id: string;
          created_at: string;
          id: string;
          message: string;
          sender_id: string;
        };
        Insert: {
          chat_room_id: string;
          created_at?: string;
          id?: string;
          message: string;
          sender_id: string;
        };
        Update: {
          chat_room_id?: string;
          created_at?: string;
          id?: string;
          message?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_room_id_fkey";
            columns: ["chat_room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_rooms: {
        Row: {
          collab_application_id: string;
          created_at: string;
          id: string;
          unread: boolean | null;
        };
        Insert: {
          collab_application_id: string;
          created_at?: string;
          id?: string;
          unread?: boolean | null;
        };
        Update: {
          collab_application_id?: string;
          created_at?: string;
          id?: string;
          unread?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_rooms_collab_application_id_fkey";
            columns: ["collab_application_id"];
            isOneToOne: false;
            referencedRelation: "collab_applications";
            referencedColumns: ["id"];
          },
        ];
      };
      collab_applications: {
        Row: {
          collab_id: string;
          created_at: string;
          creator_id: string;
          id: string;
          message: string | null;
          status: Database["public"]["Enums"]["application_status"];
        };
        Insert: {
          collab_id: string;
          created_at?: string;
          creator_id: string;
          id?: string;
          message?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
        };
        Update: {
          collab_id?: string;
          created_at?: string;
          creator_id?: string;
          id?: string;
          message?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
        };
        Relationships: [
          {
            foreignKeyName: "collab_applications_collab_id_fkey";
            columns: ["collab_id"];
            isOneToOne: false;
            referencedRelation: "collabs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collab_applications_creator_id_fkey1";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "creator_profile";
            referencedColumns: ["id"];
          },
        ];
      };
      collabs: {
        Row: {
          amount: number | null;
          business_id: string;
          collab_type: Database["public"]["Enums"]["collab_type"];
          created_at: string;
          description: string;
          id: string;
          languages: Database["public"]["Enums"]["languages"][] | null;
          min_followers: number;
          platform: Database["public"]["Enums"]["platform_type"] | null;
          status: Database["public"]["Enums"]["collab_status"];
          title: string;
        };
        Insert: {
          amount?: number | null;
          business_id: string;
          collab_type: Database["public"]["Enums"]["collab_type"];
          created_at?: string;
          description: string;
          id?: string;
          languages?: Database["public"]["Enums"]["languages"][] | null;
          min_followers?: number;
          platform?: Database["public"]["Enums"]["platform_type"] | null;
          status: Database["public"]["Enums"]["collab_status"];
          title: string;
        };
        Update: {
          amount?: number | null;
          business_id?: string;
          collab_type?: Database["public"]["Enums"]["collab_type"];
          created_at?: string;
          description?: string;
          id?: string;
          languages?: Database["public"]["Enums"]["languages"][] | null;
          min_followers?: number;
          platform?: Database["public"]["Enums"]["platform_type"] | null;
          status?: Database["public"]["Enums"]["collab_status"];
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collabs_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_profile";
            referencedColumns: ["id"];
          },
        ];
      };
      creator_profile: {
        Row: {
          bio: string | null;
          created_at: string;
          followers_count: number | null;
          id: string;
          instagram_handle: string;
          name: string;
          profile_pic_url: string | null;
          synced_at: string | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          followers_count?: number | null;
          id: string;
          instagram_handle: string;
          name: string;
          profile_pic_url?: string | null;
          synced_at?: string | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          followers_count?: number | null;
          id?: string;
          instagram_handle?: string;
          name?: string;
          profile_pic_url?: string | null;
          synced_at?: string | null;
        };
        Relationships: [];
      };
      point_transactions: {
        Row: {
          amount: number;
          created_at: string;
          description: string;
          id: string;
          related_id: string;
          type: Database["public"]["Enums"]["tranasction_type"];
          user_id: string;
        };
        Insert: {
          amount?: number;
          created_at?: string;
          description: string;
          id?: string;
          related_id: string;
          type: Database["public"]["Enums"]["tranasction_type"];
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string;
          id?: string;
          related_id?: string;
          type?: Database["public"]["Enums"]["tranasction_type"];
          user_id?: string;
        };
        Relationships: [];
      };
      test_table: {
        Row: {
          created_at: string;
          id: string;
          text: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          text?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          text?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_profile: {
        Row: {
          balance: number;
          created_at: string;
          referral_code: string | null;
          referred_by: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance?: number;
          created_at?: string;
          referral_code?: string | null;
          referred_by?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance?: number;
          created_at?: string;
          referral_code?: string | null;
          referred_by?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      apply_to_collab: {
        Args: {
          input_user_id: string;
          input_collab_id: string;
          message: string;
        };
        Returns: undefined;
      };
      handle_create_collab: {
        Args: {
          input_user_id: string;
          input_business_id: string;
          input_collab_details: Json;
        };
        Returns: Record<string, unknown>;
      };
    };
    Enums: {
      application_status: "PENDING" | "ACCEPTED" | "REJECTED";
      business_type:
        | "Retail"
        | "E-commerce"
        | "Service"
        | "Food & Beverage"
        | "Technology"
        | "Fashion"
        | "Beauty"
        | "Health & Wellness"
        | "Travel"
        | "Entertainment"
        | "Education";
      collab_status: "ACTIVE" | "CLOSED";
      collab_type: "PAID" | "BARTER" | "PRODUCT_CASH";
      languages:
        | "Kannada"
        | "English"
        | "Hindi"
        | "Telugu"
        | "Tamil"
        | "Malayalam"
        | "Bengali"
        | "Marathi"
        | "Gujarati"
        | "Punjabi";
      platform_action: "STORY" | "POST" | "REEL";
      platform_type: "INSTAGRAM" | "FACEBOOK";
      tranasction_type: "CREDIT" | "DEBIT";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      application_status: ["PENDING", "ACCEPTED", "REJECTED"],
      business_type: [
        "Retail",
        "E-commerce",
        "Service",
        "Food & Beverage",
        "Technology",
        "Fashion",
        "Beauty",
        "Health & Wellness",
        "Travel",
        "Entertainment",
        "Education",
      ],
      collab_status: ["ACTIVE", "CLOSED"],
      collab_type: ["PAID", "BARTER", "PRODUCT_CASH"],
      languages: [
        "Kannada",
        "English",
        "Hindi",
        "Telugu",
        "Tamil",
        "Malayalam",
        "Bengali",
        "Marathi",
        "Gujarati",
        "Punjabi",
      ],
      platform_action: ["STORY", "POST", "REEL"],
      platform_type: ["INSTAGRAM", "FACEBOOK"],
      tranasction_type: ["CREDIT", "DEBIT"],
    },
  },
} as const;
