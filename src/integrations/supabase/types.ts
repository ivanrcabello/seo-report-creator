export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          openai_api_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          openai_api_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          openai_api_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_documents: {
        Row: {
          analyzed_status: string | null
          client_id: string
          content: string | null
          id: string
          name: string
          type: string
          upload_date: string
          url: string
        }
        Insert: {
          analyzed_status?: string | null
          client_id: string
          content?: string | null
          id?: string
          name: string
          type: string
          upload_date?: string
          url: string
        }
        Update: {
          analyzed_status?: string | null
          client_id?: string
          content?: string | null
          id?: string
          name?: string
          type?: string
          upload_date?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_keywords: {
        Row: {
          backlinks_count: number | null
          client_id: string
          competition: number | null
          cpc: number | null
          date_added: string | null
          id: string
          keyword: string
          keyword_difficulty: number | null
          keyword_intent: string | null
          last_updated: string | null
          position: number | null
          position_type: string | null
          previous_position: number | null
          search_volume: number | null
          serp_features: string | null
          target_position: number | null
          timestamp: string | null
          traffic: number | null
          traffic_cost: number | null
          traffic_percentage: number | null
          trends: string | null
          url: string | null
        }
        Insert: {
          backlinks_count?: number | null
          client_id: string
          competition?: number | null
          cpc?: number | null
          date_added?: string | null
          id?: string
          keyword: string
          keyword_difficulty?: number | null
          keyword_intent?: string | null
          last_updated?: string | null
          position?: number | null
          position_type?: string | null
          previous_position?: number | null
          search_volume?: number | null
          serp_features?: string | null
          target_position?: number | null
          timestamp?: string | null
          traffic?: number | null
          traffic_cost?: number | null
          traffic_percentage?: number | null
          trends?: string | null
          url?: string | null
        }
        Update: {
          backlinks_count?: number | null
          client_id?: string
          competition?: number | null
          cpc?: number | null
          date_added?: string | null
          id?: string
          keyword?: string
          keyword_difficulty?: number | null
          keyword_intent?: string | null
          last_updated?: string | null
          position?: number | null
          position_type?: string | null
          previous_position?: number | null
          search_volume?: number | null
          serp_features?: string | null
          target_position?: number | null
          timestamp?: string | null
          traffic?: number | null
          traffic_cost?: number | null
          traffic_percentage?: number | null
          trends?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_keywords_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_local_seo_settings: {
        Row: {
          address: string
          business_name: string
          client_id: string
          created_at: string
          google_business_url: string | null
          google_maps_ranking: number | null
          google_reviews_average: number | null
          google_reviews_count: number | null
          id: string
          last_metrics_update: string | null
          listings_count: number | null
          phone: string | null
          rank_tracking_enabled: boolean | null
          target_locations: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          business_name: string
          client_id: string
          created_at?: string
          google_business_url?: string | null
          google_maps_ranking?: number | null
          google_reviews_average?: number | null
          google_reviews_count?: number | null
          id?: string
          last_metrics_update?: string | null
          listings_count?: number | null
          phone?: string | null
          rank_tracking_enabled?: boolean | null
          target_locations?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          business_name?: string
          client_id?: string
          created_at?: string
          google_business_url?: string | null
          google_maps_ranking?: number | null
          google_reviews_average?: number | null
          google_reviews_count?: number | null
          id?: string
          last_metrics_update?: string | null
          listings_count?: number | null
          phone?: string | null
          rank_tracking_enabled?: boolean | null
          target_locations?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_local_seo_settings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_metrics: {
        Row: {
          client_id: string | null
          conversion_goal: number | null
          conversions: number | null
          created_at: string
          id: string
          keywords_top10: number | null
          month: string
          updated_at: string
          web_visits: number | null
        }
        Insert: {
          client_id?: string | null
          conversion_goal?: number | null
          conversions?: number | null
          created_at?: string
          id?: string
          keywords_top10?: number | null
          month: string
          updated_at?: string
          web_visits?: number | null
        }
        Update: {
          client_id?: string | null
          conversion_goal?: number | null
          conversions?: number | null
          created_at?: string
          id?: string
          keywords_top10?: number | null
          month?: string
          updated_at?: string
          web_visits?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_pagespeed: {
        Row: {
          accessibility_score: number | null
          audits: Json | null
          best_practices_score: number | null
          client_id: string
          created_at: string | null
          cumulative_layout_shift: number | null
          first_contentful_paint: number | null
          id: string
          largest_contentful_paint: number | null
          performance_score: number | null
          screenshot: string | null
          seo_score: number | null
          speed_index: number | null
          time_to_interactive: number | null
          total_blocking_time: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          accessibility_score?: number | null
          audits?: Json | null
          best_practices_score?: number | null
          client_id: string
          created_at?: string | null
          cumulative_layout_shift?: number | null
          first_contentful_paint?: number | null
          id?: string
          largest_contentful_paint?: number | null
          performance_score?: number | null
          screenshot?: string | null
          seo_score?: number | null
          speed_index?: number | null
          time_to_interactive?: number | null
          total_blocking_time?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          accessibility_score?: number | null
          audits?: Json | null
          best_practices_score?: number | null
          client_id?: string
          created_at?: string | null
          cumulative_layout_shift?: number | null
          first_contentful_paint?: number | null
          id?: string
          largest_contentful_paint?: number | null
          performance_score?: number | null
          screenshot?: string | null
          seo_score?: number | null
          speed_index?: number | null
          time_to_interactive?: number | null
          total_blocking_time?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_pagespeed_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_reports: {
        Row: {
          analytics_data: Json | null
          client_id: string
          content: string | null
          date: string
          document_ids: string[] | null
          id: string
          include_in_proposal: boolean | null
          notes: string | null
          share_token: string | null
          shared_at: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          analytics_data?: Json | null
          client_id: string
          content?: string | null
          date?: string
          document_ids?: string[] | null
          id?: string
          include_in_proposal?: boolean | null
          notes?: string | null
          share_token?: string | null
          shared_at?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          analytics_data?: Json | null
          client_id?: string
          content?: string | null
          date?: string
          document_ids?: string[] | null
          id?: string
          include_in_proposal?: boolean | null
          notes?: string | null
          share_token?: string | null
          shared_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          analytics_connected: boolean | null
          company: string | null
          created_at: string
          email: string
          hosting_details: Json | null
          id: string
          is_active: boolean | null
          last_report: string | null
          name: string
          notes: string[] | null
          phone: string | null
          project_passwords: Json | null
          search_console_connected: boolean | null
          sector: string | null
          website: string | null
          wordpress_access: Json | null
        }
        Insert: {
          analytics_connected?: boolean | null
          company?: string | null
          created_at?: string
          email: string
          hosting_details?: Json | null
          id?: string
          is_active?: boolean | null
          last_report?: string | null
          name: string
          notes?: string[] | null
          phone?: string | null
          project_passwords?: Json | null
          search_console_connected?: boolean | null
          sector?: string | null
          website?: string | null
          wordpress_access?: Json | null
        }
        Update: {
          analytics_connected?: boolean | null
          company?: string | null
          created_at?: string
          email?: string
          hosting_details?: Json | null
          id?: string
          is_active?: boolean | null
          last_report?: string | null
          name?: string
          notes?: string[] | null
          phone?: string | null
          project_passwords?: Json | null
          search_console_connected?: boolean | null
          sector?: string | null
          website?: string | null
          wordpress_access?: Json | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string
          company_name: string
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          phone: string | null
          tax_id: string
          updated_at: string
        }
        Insert: {
          address: string
          company_name: string
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          tax_id: string
          updated_at?: string
        }
        Update: {
          address?: string
          company_name?: string
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          tax_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          cover_page_html: string | null
          created_at: string
          css: string | null
          document_type: string
          footer_html: string | null
          header_html: string | null
          id: string
          is_default: boolean | null
          name: string
          sections: Json | null
          updated_at: string
        }
        Insert: {
          cover_page_html?: string | null
          created_at?: string
          css?: string | null
          document_type: string
          footer_html?: string | null
          header_html?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          sections?: Json | null
          updated_at?: string
        }
        Update: {
          cover_page_html?: string | null
          created_at?: string
          css?: string | null
          document_type?: string
          footer_html?: string | null
          header_html?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          sections?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          base_amount: number
          client_id: string
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          pack_id: string | null
          payment_date: string | null
          pdf_url: string | null
          proposal_id: string | null
          status: string
          tax_amount: number
          tax_rate: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          base_amount: number
          client_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          pack_id?: string | null
          payment_date?: string | null
          pdf_url?: string | null
          proposal_id?: string | null
          status?: string
          tax_amount: number
          tax_rate?: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          base_amount?: number
          client_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          pack_id?: string | null
          payment_date?: string | null
          pdf_url?: string | null
          proposal_id?: string | null
          status?: string
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "seo_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      local_seo_metrics: {
        Row: {
          client_id: string
          created_at: string
          date: string
          google_maps_ranking: number | null
          google_reviews_average: number | null
          google_reviews_count: number | null
          id: string
          listings_count: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date?: string
          google_maps_ranking?: number | null
          google_reviews_average?: number | null
          google_reviews_count?: number | null
          id?: string
          listings_count?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date?: string
          google_maps_ranking?: number | null
          google_reviews_average?: number | null
          google_reviews_count?: number | null
          id?: string
          listings_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "local_seo_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      pagespeed_metrics: {
        Row: {
          accessibility_score: number
          best_practices_score: number
          client_id: string
          created_at: string | null
          cumulative_layout_shift: number | null
          first_contentful_paint: number | null
          id: string
          largest_contentful_paint: number | null
          performance_score: number
          seo_score: number
          speed_index: number | null
          time_to_interactive: number | null
          total_blocking_time: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          accessibility_score: number
          best_practices_score: number
          client_id: string
          created_at?: string | null
          cumulative_layout_shift?: number | null
          first_contentful_paint?: number | null
          id?: string
          largest_contentful_paint?: number | null
          performance_score: number
          seo_score: number
          speed_index?: number | null
          time_to_interactive?: number | null
          total_blocking_time?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          accessibility_score?: number
          best_practices_score?: number
          client_id?: string
          created_at?: string | null
          cumulative_layout_shift?: number | null
          first_contentful_paint?: number | null
          id?: string
          largest_contentful_paint?: number | null
          performance_score?: number
          seo_score?: number
          speed_index?: number | null
          time_to_interactive?: number | null
          total_blocking_time?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagespeed_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      project_timeline: {
        Row: {
          client_id: string | null
          created_at: string
          details: string | null
          id: string
          order_number: number
          status: string
          task_name: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          order_number: number
          status: string
          task_name: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          order_number?: number
          status?: string
          task_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_timeline_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          additional_notes: string | null
          ai_content: string | null
          client_id: string
          created_at: string
          custom_features: string[] | null
          custom_price: number | null
          description: string
          expires_at: string | null
          id: string
          pack_id: string
          public_url: string | null
          report_ids: string[] | null
          sent_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          ai_content?: string | null
          client_id: string
          created_at?: string
          custom_features?: string[] | null
          custom_price?: number | null
          description: string
          expires_at?: string | null
          id?: string
          pack_id: string
          public_url?: string | null
          report_ids?: string[] | null
          sent_at?: string | null
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          ai_content?: string | null
          client_id?: string
          created_at?: string
          custom_features?: string[] | null
          custom_price?: number | null
          description?: string
          expires_at?: string | null
          id?: string
          pack_id?: string
          public_url?: string | null
          report_ids?: string[] | null
          sent_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "seo_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_contracts: {
        Row: {
          client_id: string
          content: Json
          created_at: string
          end_date: string | null
          id: string
          monthly_fee: number
          pdf_url: string | null
          phase1_fee: number | null
          share_token: string | null
          shared_at: string | null
          signed_at: string | null
          signed_by_client: boolean | null
          signed_by_professional: boolean | null
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content: Json
          created_at?: string
          end_date?: string | null
          id?: string
          monthly_fee: number
          pdf_url?: string | null
          phase1_fee?: number | null
          share_token?: string | null
          shared_at?: string | null
          signed_at?: string | null
          signed_by_client?: boolean | null
          signed_by_professional?: boolean | null
          start_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: Json
          created_at?: string
          end_date?: string | null
          id?: string
          monthly_fee?: number
          pdf_url?: string | null
          phase1_fee?: number | null
          share_token?: string | null
          shared_at?: string | null
          signed_at?: string | null
          signed_by_client?: boolean | null
          signed_by_professional?: boolean | null
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_local_reports: {
        Row: {
          business_name: string
          client_id: string
          date: string
          google_business_url: string | null
          google_maps_ranking: number | null
          google_reviews_average: number | null
          google_reviews_count: number | null
          id: string
          keyword_rankings: Json | null
          local_listings: Json | null
          location: string
          phone: string | null
          recommendations: string[] | null
          share_token: string | null
          shared_at: string | null
          title: string
          website: string | null
        }
        Insert: {
          business_name: string
          client_id: string
          date?: string
          google_business_url?: string | null
          google_maps_ranking?: number | null
          google_reviews_average?: number | null
          google_reviews_count?: number | null
          id?: string
          keyword_rankings?: Json | null
          local_listings?: Json | null
          location: string
          phone?: string | null
          recommendations?: string[] | null
          share_token?: string | null
          shared_at?: string | null
          title: string
          website?: string | null
        }
        Update: {
          business_name?: string
          client_id?: string
          date?: string
          google_business_url?: string | null
          google_maps_ranking?: number | null
          google_reviews_average?: number | null
          google_reviews_count?: number | null
          id?: string
          keyword_rankings?: Json | null
          local_listings?: Json | null
          location?: string
          phone?: string | null
          recommendations?: string[] | null
          share_token?: string | null
          shared_at?: string | null
          title?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_local_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_packs: {
        Row: {
          created_at: string
          description: string
          features: string[]
          id: string
          is_active: boolean
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description: string
          features: string[]
          id?: string
          is_active?: boolean
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          is_active?: boolean
          name?: string
          price?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_client_keywords: {
        Args: {
          client_id_param: string
        }
        Returns: {
          backlinks_count: number | null
          client_id: string
          competition: number | null
          cpc: number | null
          date_added: string | null
          id: string
          keyword: string
          keyword_difficulty: number | null
          keyword_intent: string | null
          last_updated: string | null
          position: number | null
          position_type: string | null
          previous_position: number | null
          search_volume: number | null
          serp_features: string | null
          target_position: number | null
          timestamp: string | null
          traffic: number | null
          traffic_cost: number | null
          traffic_percentage: number | null
          trends: string | null
          url: string | null
        }[]
      }
      get_client_metrics: {
        Args: {
          client_id_param: string
        }
        Returns: {
          client_id: string | null
          conversion_goal: number | null
          conversions: number | null
          created_at: string
          id: string
          keywords_top10: number | null
          month: string
          updated_at: string
          web_visits: number | null
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role_direct: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      insert_client_metric: {
        Args: {
          p_client_id: string
          p_month: string
          p_web_visits: number
          p_keywords_top10: number
          p_conversions: number
          p_conversion_goal: number
        }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_client_metric: {
        Args: {
          p_id: string
          p_client_id: string
          p_month: string
          p_web_visits: number
          p_keywords_top10: number
          p_conversions: number
          p_conversion_goal: number
        }
        Returns: boolean
      }
      upsert_complete_local_seo_settings: {
        Args: {
          p_id: string
          p_client_id: string
          p_business_name: string
          p_address: string
          p_phone: string
          p_website: string
          p_google_business_url: string
          p_target_locations: string[]
          p_google_reviews_count: number
          p_google_reviews_average: number
          p_listings_count: number
          p_google_maps_ranking: number
        }
        Returns: Json
      }
      upsert_local_seo_settings: {
        Args: {
          client_id: string
          business_name: string
          address: string
          phone: string
          website: string
          google_business_url: string
        }
        Returns: Json
      }
    }
    Enums: {
      user_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
