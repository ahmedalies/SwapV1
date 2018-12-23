import {DomainItem} from "./DomainItem";

export class DomainSwapRequest {
    _id: string;
    status: string;
    senderRate: number;
    receiverRate: number;
    respondAt: number|string;
    milliSecondAfter24Hours: number;
    senderItem: DomainItem;
    receiverItem: DomainItem;
    createdAt: number|string;
    message: string;
    swapStatusString: String;
}