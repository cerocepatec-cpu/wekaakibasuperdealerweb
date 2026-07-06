export interface Deposits{
    id?: number;
    user_id?: number;
    name?: string;
    description?: string;
    selected?: boolean;
    inloading?: boolean;
    type? : string;
    created_at?:string;
    updated_at?:string;
    sync_status?: string;
    pos_affection_id?: any;
    categories?:[];
    withdrawing_method?:string;
}