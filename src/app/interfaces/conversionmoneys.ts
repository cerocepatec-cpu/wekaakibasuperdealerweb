export interface ConversionMoney{
    id?:string;
    name1?: string;
    name2?: string;
    abreviation1?: string;
    abreviation2?: string;
    money_id1?: number;
    money_id2?: number;
    rate?: number;
    operator?: number;
    original?: any;
}