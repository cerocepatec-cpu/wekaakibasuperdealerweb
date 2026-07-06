import { Users } from "./users";

export interface PointOfSales{
    id?: number;
    name?: string;	
    description?: string;
    rccm?: string;	
    national_identification?: string;
    num_impot?: string;	
    autorisation_fct?: string;
    adresse?: string;	
    phone?: string;
    mail?: string;	
    website?: string;	
    logo?: string;	
    category?: string;	   
    vat_rate?: string;	
    uuid?: string;	
    sync_status?: string;
    user_id?: string;
    status?: string;
    invoicefooter?: string;
    selected?: boolean;
    type?: string;
    sold?: string;
    nb_sales_bonus?: string;
    bonus_percentage?: string;
    workforce_percent?: string;	
    enterprise_id?: number
    created_at?: string;
    updated_at?: string;
    beginfromamount?:number;
    bonusperbuy?:boolean;
    users?:Users[];
}