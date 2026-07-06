export interface Customers{
    id?: number;
    pos_id? : number;
    created_by_id?: number;
    category_id?: number;
    customerName?: string;
    marital_status?: string;
    other_contact?: string;
    adress?: string;
    phone?: string;
    mail?: string;
    employer?: number;
    type?: string;
    sex?: string;
    photo?:string;
    created_at?: string;
    updated_at?: string;
    employer_name?: string;
    pos_name?: string;
    category_name?: string;
    selected?: boolean;
    enterprise_id?:number;
    sync_status?: string;
    totalbonus?:number;
    totalpoints?:number;
    totalcautions?:number;
    uuid?: string;
}