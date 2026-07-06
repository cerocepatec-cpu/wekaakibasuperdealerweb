export interface UserDeposit{
    id?:number;
    user_id?: number;
    user_name?: string;
    user_mail?: string;
    email_verified_at?: string;
    user_phone?: string;
    user_password?: string;
    user_type?: string;
    status?: string;
    permissions?: string;
    note?: string;
    avatar?: string;
    created_at?: string;
    updated_at?: string;
    level?: string;
    selected?: boolean;
    sync_status?: string;
    deposit_name: string;
    deposit_id: number;
    deposit_description: string;
}