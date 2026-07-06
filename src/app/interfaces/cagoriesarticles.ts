export class CategoriesArticle{
    id?: number;
    parent_id?: number;
    name?: string;
    user_id?: number;
    description?: string;
    type_conservation?: string;
    has_vat?: boolean;
    created_at? : string;
    updated_at?: string;
    enterprise_id?:number;
    subcategories?:[];
    category?: any;
    selected?: any;
    sync_status?: string;
}