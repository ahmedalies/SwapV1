
import {Repository} from "../base/Repository";
import {DomainSwapRequest} from "../../entities/DomainSwapRequest";
import {SwapRequestCallback} from "./SwapRequestCallback";
import { DomainItem } from "../../entities/DomainItem";

export interface SwapRequestRepository extends Repository<DomainSwapRequest> {
    swapRequestCallback: SwapRequestCallback;

    ask(object: DomainSwapRequest): Promise<DomainSwapRequest>;
    getSwapRequest(swapId: string): Promise<DomainSwapRequest>;
    accept(swapId: string, receiverUserId: string): Promise<boolean>;
    reject(swapId: string, receiverUserId: string, reason: string): Promise<boolean>;
    cancelAll(itemId: number | string, requestId: string): Promise<boolean>;
    register7Days(item: DomainItem);
    unRegister7Days(itemId: string);
    register24Hours(requestId: string);
    isFirst(item: DomainItem): Promise<boolean>;
    rollBackRequest(requestId: string): Promise<boolean>;
    isRequestAlreadyThere(senderItem: string | number, receiverItem: string | number): Promise<DomainSwapRequest>;
    isRequestAlreadyThereFromSenderToReceiver(senderItem: string | number, receiverItem: string | number): Promise<DomainSwapRequest>;
    isRequestAlreadyThereFromReceiverToSender(senderItem: string | number, receiverItem: string | number): Promise<DomainSwapRequest>;
}