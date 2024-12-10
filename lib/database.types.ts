export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      wallpapers: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          price: number
          image_path: string
          preview_url: string
          category: string | null
          tags: string[] | null
          is_featured: boolean
          uploaded_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          price: number
          image_path: string
          preview_url: string
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          uploaded_by: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          price?: number
          image_path?: string
          preview_url?: string
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          uploaded_by?: string
        }
      }
      payments: {
        Row: {
          id: string
          created_at: string
          wallpaper_id: string
          user_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          payment_method: string
        }
        Insert: {
          id?: string
          created_at?: string
          wallpaper_id: string
          user_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          payment_method: string
        }
        Update: {
          id?: string
          created_at?: string
          wallpaper_id?: string
          user_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          payment_method?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          is_admin: boolean
        }
        Insert: {
          id: string
          created_at?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          is_admin?: boolean
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