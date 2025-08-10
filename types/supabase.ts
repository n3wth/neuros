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
          query?: string
          variables?: Json
          extensions?: Json
          operationName?: string
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
      achievements: {
        Row: {
          description: string
          id: string
          metadata: Json | null
          rarity: string | null
          share_count: number | null
          title: string
          unlocked_at: string | null
          user_id: string | null
          viral_score: number | null
        }
        Insert: {
          description: string
          id?: string
          metadata?: Json | null
          rarity?: string | null
          share_count?: number | null
          title: string
          unlocked_at?: string | null
          user_id?: string | null
          viral_score?: number | null
        }
        Update: {
          description?: string
          id?: string
          metadata?: Json | null
          rarity?: string | null
          share_count?: number | null
          title?: string
          unlocked_at?: string | null
          user_id?: string | null
          viral_score?: number | null
        }
        Relationships: []
      }
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
      ai_tutors: {
        Row: {
          context: Json
          created_at: string | null
          id: string
          personality: Json
          user_id: string | null
        }
        Insert: {
          context: Json
          created_at?: string | null
          id?: string
          personality: Json
          user_id?: string | null
        }
        Update: {
          context?: Json
          created_at?: string | null
          id?: string
          personality?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      card_images: {
        Row: {
          card_id: string | null
          created_at: string | null
          id: string
          image_url: string
          prompt: string
          style: string
          user_id: string
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          prompt: string
          style: string
          user_id: string
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          prompt?: string
          style?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_images_card_id_fkey"
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
          image_url: string | null
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
          image_url?: string | null
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
          image_url?: string | null
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
      challenge_participants: {
        Row: {
          challenge_id: string | null
          completed_at: string | null
          id: string
          joined_at: string | null
          progress: number | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed_at?: string | null
          id?: string
          joined_at?: string | null
          progress?: number | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed_at?: string | null
          id?: string
          joined_at?: string | null
          progress?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "viral_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_sessions: {
        Row: {
          compatibility_score: number
          created_at: string | null
          ended_at: string | null
          id: string
          started_at: string | null
          status: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          compatibility_score: number
          created_at?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          compatibility_score?: number
          created_at?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: []
      }
      knowledge_edges: {
        Row: {
          created_at: string | null
          id: string
          source_id: string | null
          strength: number | null
          target_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          source_id?: string | null
          strength?: number | null
          target_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          source_id?: string | null
          strength?: number | null
          target_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_edges_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_edges_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "knowledge_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_nodes: {
        Row: {
          created_at: string | null
          id: string
          label: string
          mastery: number | null
          metadata: Json | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          mastery?: number | null
          metadata?: Json | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          mastery?: number | null
          metadata?: Json | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      learning_presence: {
        Row: {
          id: string
          last_active: string | null
          location: Json
          metadata: Json | null
          status: string | null
          topic: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          last_active?: string | null
          location: Json
          metadata?: Json | null
          status?: string | null
          topic?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          last_active?: string | null
          location?: Json
          metadata?: Json | null
          status?: string | null
          topic?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      meta_learning_patterns: {
        Row: {
          id: string
          meta_insights: Json
          patterns: Json
          predictions: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          meta_insights: Json
          patterns: Json
          predictions: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          meta_insights?: Json
          patterns?: Json
          predictions?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
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
      system_evolution: {
        Row: {
          created_at: string | null
          generation: number
          id: string
          improvements: string
        }
        Insert: {
          created_at?: string | null
          generation: number
          id?: string
          improvements: string
        }
        Update: {
          created_at?: string | null
          generation?: number
          id?: string
          improvements?: string
        }
        Relationships: []
      }
      topic_images: {
        Row: {
          concepts: string[] | null
          created_at: string | null
          id: string
          image_url: string
          topic: string
          topic_id: string | null
          user_id: string
        }
        Insert: {
          concepts?: string[] | null
          created_at?: string | null
          id?: string
          image_url: string
          topic: string
          topic_id?: string | null
          user_id: string
        }
        Update: {
          concepts?: string[] | null
          created_at?: string | null
          id?: string
          image_url?: string
          topic?: string
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_images_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tutor_interventions: {
        Row: {
          context: Json
          created_at: string | null
          effectiveness_score: number | null
          id: string
          intervention: string
          tutor_personality: Json
          user_id: string | null
        }
        Insert: {
          context: Json
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          intervention: string
          tutor_personality: Json
          user_id?: string | null
        }
        Update: {
          context?: Json
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          intervention?: string
          tutor_personality?: Json
          user_id?: string | null
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
      viral_challenges: {
        Row: {
          created_at: string | null
          deadline: string
          description: string
          id: string
          name: string
          reward: string | null
        }
        Insert: {
          created_at?: string | null
          deadline: string
          description: string
          id?: string
          name: string
          reward?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string
          description?: string
          id?: string
          name?: string
          reward?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_next_review: {
        Args: {
          rating: number
          current_reps: number
          current_ease: number
          current_interval: number
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

