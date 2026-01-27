export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DealStatus =
  | "draft"
  | "awaiting_buyer"
  | "awaiting_payment"
  | "in_escrow"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled"
  | "refunded"

export type AccountStatus = "restricted" | "active" | "suspended"

export type UserRole = "user" | "admin"

export type WithdrawalStatus = "pending" | "successful" | "rejected"

export type DealParticipantRole = "seller" | "buyer"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: UserRole
          account_status: AccountStatus
          balance: number
          full_name?: string | null
          bank_name?: string | null
          account_number?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole
          account_status?: AccountStatus
          balance?: number
          full_name?: string | null
          bank_name?: string | null
          account_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole
          account_status?: AccountStatus
          balance?: number
          full_name?: string | null
          bank_name?: string | null
          account_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          title: string
          description: string | null
          amount: number
          currency: string
          status: DealStatus
          invite_code: string
          seller_id: string
          buyer_id: string | null
          payment_proof_url: string | null
          delivery_proof_url: string | null
          dispute_reason: string | null
          admin_notes: string | null
          inspection_period_days: number
          delivery_period: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          amount: number
          currency?: string
          status?: DealStatus
          invite_code?: string
          seller_id: string
          buyer_id?: string | null
          payment_proof_url?: string | null
          delivery_proof_url?: string | null
          dispute_reason?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          amount?: number
          currency?: string
          status?: DealStatus
          invite_code?: string
          seller_id?: string
          buyer_id?: string | null
          payment_proof_url?: string | null
          delivery_proof_url?: string | null
          dispute_reason?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          deal_id: string
          sender_id: string
          content: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          deal_id: string
          sender_id: string
          content: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          deal_id?: string
          sender_id?: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
      }
      withdrawals: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          bank_name: string
          account_number: string
          account_name: string
          status: WithdrawalStatus
          admin_notes: string | null
          processed_by: string | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          bank_name: string
          account_number: string
          account_name: string
          status?: WithdrawalStatus
          admin_notes?: string | null
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          bank_name?: string
          account_number?: string
          account_name?: string
          status?: WithdrawalStatus
          admin_notes?: string | null
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          escrow_bank_name: string
          escrow_account_number: string
          escrow_account_name: string
          escrow_instructions: string | null
          usdt_network?: string | null
          usdt_wallet_address?: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          escrow_bank_name: string
          escrow_account_number: string
          escrow_account_name: string
          escrow_instructions?: string | null
          usdt_network?: string | null
          usdt_wallet_address?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          escrow_bank_name?: string
          escrow_account_number?: string
          escrow_account_name?: string
          escrow_instructions?: string | null
          usdt_network?: string | null
          usdt_wallet_address?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
      admin_audit_log: {
        Row: {
          id: string
          admin_id: string
          action: string
          target_type: string
          target_id: string
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          target_type: string
          target_id: string
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          target_type?: string
          target_id?: string
          details?: Json | null
          created_at?: string
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
      deal_status: DealStatus
      account_status: AccountStatus
      user_role: UserRole
      withdrawal_status: WithdrawalStatus
    }
  }
}
