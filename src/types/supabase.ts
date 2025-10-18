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
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          price: number
          category_id: string
          stock: number
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          price: number
          category_id: string
          stock: number
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string
          stock?: number
          image_url?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          customer_name: string | null
          total_amount: number
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          customer_name?: string | null
          total_amount: number
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          customer_name?: string | null
          total_amount?: number
          status?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          role?: string
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