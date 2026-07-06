export interface MemberAccounts {
  id?: number;
  enterprise_id?: number;
  user_id?: number;
  user_name?: string;
  full_name?: string;
  account_number?: string;
  description?: string;
  type?: string;
  money_id?: number;
  money_abreviation?: string;
  sold?: number;
  account_status?: 'enabled' | 'disabled' | 'blocked' | string;
  blocked_from?: string | null;
  blocked_to?: string | null;
  blocked_step?: string | null;
  blocked_periocity?: string | null;
  created_at?: string;
  updated_at?: string;
}
