export interface Role{
    id?:number;
    name?: string;
    title?: string;
    description?:string;
    permissions?:any;
    selected?:boolean;
    sync_status?: string;
}
