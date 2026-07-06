export interface ServantInvoice{

    id?: number;
    edited_by_id?: number;
    customer_id?: number;
    total?: number;
    money_id?: number;
    type_facture?: string;
    amount_paid?: number;
    payment_mode?: string;
    discount?: number;
    vat_amount?: number;
    is_validate_discount?: boolean;
    note?: string;
    servant_id?: number;
    table_id?: number;
    details?: any; 
    created_at?: string;
    updated_At?:string;
    name?: string;
    description?: string;
    photo?: string;
    phone?: string;
    email?: string;
    address?: string;
    user_id?: number;
    enterprise_id?: number;
    sync_status?: string;
}