export interface Fences{
    id?: number;
    user_id?: number;
    user_name?: string;
    amount_due?: number;
    amount_paid?: number;
    totalsell?: any;
    totalcash?: number;
    totalcredits?: any;
    totalbonus?: number;
    totalpoints?: number;
    totalcautions?: number;
    totaldebts?: number;
    depositcautions?: number;
    totalexpenditures?: number;
    totalentries?: number;
    money_id?: number;
    sold?: any;
    uuid?: string;
    sync_status?: string;
    validated?: boolean;
    enterprise_id?: number;
    created_at?: string;
    date_concerned?: string;
    updated_at?: string;
    fence?:any;
}