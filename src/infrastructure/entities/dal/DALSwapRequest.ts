export class DALSwapRequest {
    _id: string;
    status: string;
    sender_rate: number;
    receiver_rate: number;
    respond_at: string | number;
    milli24h: number;
    sender_item: number;
    receiver_item: number;
    swapStatusString: string;
    created_at: string | number;
}