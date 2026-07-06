export interface CategoryCustomers{
    id?: number;
    name?: string;
    parent_id?:number;
    user_id?:number;
    description?: string;
    discount_applicable?: boolean;
    enterprise_id?: number;
    sync_status?: string;
}