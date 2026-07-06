export interface TransactionLimit {
  id?: number;
  enterprise_id: number;
  money_id: number;
  transaction_type: 'entry' | 'withdraw' | 'transfer';
  scope: 'national' | 'international';
  min_amount: number;
  max_amount: number;
  daily_limit?: number;
  monthly_limit?: number;
  kyc_level_required: 'none' | 'basic' | 'verified' | 'premium';
  is_active: boolean;
  is_for_collector: boolean;
}