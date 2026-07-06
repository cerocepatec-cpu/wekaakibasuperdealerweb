export interface PricesCategories{
    id?: number;
    service_id?: number;
    label?: string;
    price?: number;
    principal?:number;
    enterprise_id?:number;
    money_id?: number;
    service_name?: string;
    money_name?: string;
    abreviation?: string;
    created_at?: string;
    updated_at?: string;
    sync_status?: string;
    not_from_api?: boolean;
    selected?:boolean;
    conerns?:any;
}