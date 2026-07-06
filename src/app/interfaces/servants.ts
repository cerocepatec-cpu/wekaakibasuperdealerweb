export interface Servant{
    id?: number;
    name?: string;
    description?: string;
    photo?: string;
    phone?: string;
    email?: string;
    address?: string;
    user_id?: number;
    enterprise_id?: number;
    created_at?: string;
    updated_at?: string;
    selected?: boolean;
    sync_status?: string;
    percentage?:number;
}