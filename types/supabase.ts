export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_generations: {
        Row: {
          card_id: string | null
          created_at: string | null
          generation_type: string | null
          id: string
          prompt: string
          response: Json
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          generation_type?: string | null
          id?: string
          prompt: string
          response: Json
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          generation_type?: string | null
          id?: string
          prompt?: string
          response?: Json
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_generations_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          back: string
          created_at: string | null
          difficulty: string | null
          explanation: string | null
          front: string
          id: string
          metadata: Json | null
          tags: string[] | null
          topic_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          back: string
          created_at?: string | null
          difficulty?: string | null
          explanation?: string | null
          front: string
          id?: string
          metadata?: Json | null
          tags?: string[] | null
          topic_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          back?: string
          created_at?: string | null
          difficulty?: string | null
          explanation?: string | null
          front?: string
          id?: string
          metadata?: Json | null
          tags?: string[] | null
          topic_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          rating: number
          response_time: number
          session_id: string | null
          user_card_id: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          rating: number
          response_time: number
          session_id?: string | null
          user_card_id: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          rating?: number
          response_time?: number
          session_id?: string | null
          user_card_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_card_id_fkey"
            columns: ["user_card_id"]
            isOneToOne: false
            referencedRelation: "user_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          cards_correct: number | null
          cards_studied: number | null
          ended_at: string | null
          focus_score: number | null
          id: string
          metadata: Json | null
          started_at: string | null
          total_time_seconds: number | null
          user_id: string
        }
        Insert: {
          cards_correct?: number | null
          cards_studied?: number | null
          ended_at?: string | null
          focus_score?: number | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          total_time_seconds?: number | null
          user_id: string
        }
        Update: {
          cards_correct?: number | null
          cards_studied?: number | null
          ended_at?: string | null
          focus_score?: number | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          total_time_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_cards: {
        Row: {
          average_response_time: number | null
          card_id: string
          correct_reviews: number | null
          created_at: string | null
          ease_factor: number | null
          id: string
          interval_days: number | null
          last_review_date: string | null
          mastery_level: number | null
          next_review_date: string | null
          repetitions: number | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_response_time?: number | null
          card_id: string
          correct_reviews?: number | null
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_review_date?: string | null
          mastery_level?: number | null
          next_review_date?: string | null
          repetitions?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_response_time?: number | null
          card_id?: string
          correct_reviews?: number | null
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_review_date?: string | null
          mastery_level?: number | null
          next_review_date?: string | null
          repetitions?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          average_accuracy: number | null
          best_time_of_day: number | null
          cards_mastered: number | null
          created_at: string | null
          current_streak_days: number | null
          favorite_topic_id: string | null
          last_study_date: string | null
          longest_streak_days: number | null
          total_cards: number | null
          total_reviews: number | null
          total_study_time_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_accuracy?: number | null
          best_time_of_day?: number | null
          cards_mastered?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          favorite_topic_id?: string | null
          last_study_date?: string | null
          longest_streak_days?: number | null
          total_cards?: number | null
          total_reviews?: number | null
          total_study_time_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_accuracy?: number | null
          best_time_of_day?: number | null
          cards_mastered?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          favorite_topic_id?: string | null
          last_study_date?: string | null
          longest_streak_days?: number | null
          total_cards?: number | null
          total_reviews?: number | null
          total_study_time_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_favorite_topic_id_fkey"
            columns: ["favorite_topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_next_review: {
        Args: {
          current_ease: number
          current_interval: number
          current_reps: number
          rating: number
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

