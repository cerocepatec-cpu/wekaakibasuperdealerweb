/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Users } from "./users";

export interface Departments {
    id?: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    department_name?: string;
    cssclass?: string;
    selected?: boolean;
    defaultcolor?: string;
    requests?: any;
    header_depart?: number;
    user_id?: number;
    users?: Users[];
    createdby?: any;
    created_at?: any;
    updated_at?: any;
    nbrusers?: number;
    nbragents?: number;
    nbrRequests?: number;
    nbrsubdepart?: number;
    description?: string;
    user_name?:string;
}
