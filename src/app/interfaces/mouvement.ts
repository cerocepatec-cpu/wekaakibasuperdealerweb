/* eslint-disable @typescript-eslint/naming-convention */
export interface Mouvement{
    id?: number;
    amount?: number;
    type?: string;
    motif?: string;
    user_id?: number;
    user_name?: string;
    date_operation?: string;
    fund_name?: string;
    created_at?: string;
    updated_at?: string;
    uuid?: string;
    request_id?:number;
    invoice_id?:number;
    fence_id?: number;
    fund_id?:number;
    enterprise_id?: number;
    sold?: number;
    done_at?:any;
    account_id?: number;
    account_name?: string;
    description?: string;
    abreviation?: string;
    fund_mistaken?:boolean;
    type_mistaken?:boolean;
    motif_mistaken?:boolean;
    amount_mistaken?:boolean;
    nature?:string;
}
