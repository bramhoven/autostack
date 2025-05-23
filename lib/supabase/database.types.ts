export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      software: {
        Row: {
          id: number
          name: string
          description: string
          long_description: string | null
          category: string
          version: string
          image_url: string
          requirements: string | null
          popular: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          long_description?: string | null
          category: string
          version: string
          image_url: string
          requirements?: string | null
          popular?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          long_description?: string | null
          category?: string
          version?: string
          image_url?: string
          requirements?: string | null
          popular?: boolean
          created_at?: string
        }
      }
      servers: {
        Row: {
          id: number
          user_id: string
          name: string
          ip_address: string
          ssh_port: string
          username: string
          status: string
          uptime: string | null
          load: string | null
          disk: string | null
          memory: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          ip_address: string
          ssh_port?: string
          username: string
          status?: string
          uptime?: string | null
          load?: string | null
          disk?: string | null
          memory?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          ip_address?: string
          ssh_port?: string
          username?: string
          status?: string
          uptime?: string | null
          load?: string | null
          disk?: string | null
          memory?: string | null
          created_at?: string
        }
      }
      installations: {
        Row: {
          id: number
          user_id: string
          server_id: number
          software_id: number
          status: string
          version: string
          uptime: string | null
          memory: string | null
          cpu: string | null
          installed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          server_id: number
          software_id: number
          status?: string
          version: string
          uptime?: string | null
          memory?: string | null
          cpu?: string | null
          installed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          server_id?: number
          software_id?: number
          status?: string
          version?: string
          uptime?: string | null
          memory?: string | null
          cpu?: string | null
          installed_at?: string
        }
      }
      server_groups: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
      }
      server_group_members: {
        Row: {
          id: string
          group_id: string
          server_id: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          server_id: number
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          server_id?: number
          order_index?: number
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          theme: string
          auto_refresh: boolean
          refresh_interval: number
          show_offline_servers: boolean
          enable_notifications: boolean
          compact_view: boolean
          email_notifications: boolean
          server_alerts: boolean
          installation_updates: boolean
          security_alerts: boolean
          marketing_emails: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: string
          auto_refresh?: boolean
          refresh_interval?: number
          show_offline_servers?: boolean
          enable_notifications?: boolean
          compact_view?: boolean
          email_notifications?: boolean
          server_alerts?: boolean
          installation_updates?: boolean
          security_alerts?: boolean
          marketing_emails?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: string
          auto_refresh?: boolean
          refresh_interval?: number
          show_offline_servers?: boolean
          enable_notifications?: boolean
          compact_view?: boolean
          email_notifications?: boolean
          server_alerts?: boolean
          installation_updates?: boolean
          security_alerts?: boolean
          marketing_emails?: boolean
          updated_at?: string
        }
      }
      cloud_providers: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          provider_type: string
          required_fields: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          provider_type: string
          required_fields: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          provider_type?: string
          required_fields?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cloud_provider_credentials: {
        Row: {
          id: string
          user_id: string
          provider_id: number
          name: string
          credentials: Json
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider_id: number
          name: string
          credentials: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider_id?: number
          name?: string
          credentials?: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cloud_servers: {
        Row: {
          id: string
          user_id: string
          credential_id: string
          server_id: number | null
          cloud_id: string
          name: string
          region: string
          size: string
          image: string
          status: string
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          credential_id: string
          server_id?: number | null
          cloud_id: string
          name: string
          region: string
          size: string
          image: string
          status: string
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          credential_id?: string
          server_id?: number | null
          cloud_id?: string
          name?: string
          region?: string
          size?: string
          image?: string
          status?: string
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
