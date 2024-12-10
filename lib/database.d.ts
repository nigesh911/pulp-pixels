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
      ratings: {
        Row: {
          id: string
          created_at: string
          wallpaper_id: string
          rating: number
          user_ip: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          wallpaper_id: string
          rating: number
          user_ip?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          wallpaper_id?: string
          rating?: number
          user_ip?: string | null
        }
      }
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
          average_rating: number | null
          total_ratings: number | null
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
          average_rating?: number | null
          total_ratings?: number | null
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
          average_rating?: number | null
          total_ratings?: number | null
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