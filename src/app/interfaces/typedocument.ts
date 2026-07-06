export interface Typedocument{
    id?: number;
    name: string;
    description?: string;
    user_id?: number;
    enterprise_id?: number;
    selected? : boolean;
    sync_status?: string;
}