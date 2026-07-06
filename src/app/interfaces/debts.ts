export interface Debts{
    
   created_by_id?: number;
   customer_id?: number;
   customerName?: string;
   invoice_id?: number;
   status?: number;
   amount?: number;
   sold?: number;
   maturity?: number;
   uuid?: number;
   sync_status?:string;
   created_at?: string;
}