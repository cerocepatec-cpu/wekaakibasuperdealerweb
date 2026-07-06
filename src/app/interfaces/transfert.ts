/* eslint-disable eol-last */
/* eslint-disable @typescript-eslint/naming-convention */

export interface TransfertFound{
    id?: number;
    amount?: number;
    type?: string;
    comment?: string;
    money_id?: number;
    moneyName?: string;
    money_abreviation?: string;
    sender_id?: number;
    tubSender_id?: number;
    tubReceiver_id?: number;
    tubSender_name?: string;
    tubReceiver_name?: string;
    rate?: number;
    receiver_id?: number;
    senderName?: string;
    receiverName?: string;
    created_at?: string;
    updated_at?: string;
    uuid?: string;
    enterprise_id?: number;
    date_operation?: string;
}