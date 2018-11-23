
import {Repository} from "../base/Repository";
import {DomainSwapRequest} from "../../entities/DomainSwapRequest";
import {SwapRequestCallback} from "./SwapRequestCallback";

export interface SwapRequestRepository extends Repository<DomainSwapRequest> {
    swapRequestCallback: SwapRequestCallback;

    ask(object: DomainSwapRequest): Promise<DomainSwapRequest>;
    getSwapRequest(swapId: string): Promise<DomainSwapRequest>;
    accept(swapId: string, receiverUserId: string): Promise<boolean>;
    reject(swapId: string, receiverUserId: string, reason: string): Promise<boolean>;
    cancelAllSent(itemId: string): Promise<boolean>;
    cancelAllReceived(itemId: string): Promise<boolean>;
    register7Days(itemId: string);
    unRegister7Days(itemId: string);
    register24Hours(requestId: string);
    isFirst(itemId: string): Promise<boolean>;
    rollBackRequest(requestId: string): Promise<boolean>;
    isRequestAlreadyThere(senderItem: string, receiverItem: string): Promise<DomainSwapRequest>;
    isRequestAlreadyThereFromSenderToReceiver(senderItem: string, receiverItem: string): Promise<DomainSwapRequest>;
    isRequestAlreadyThereFromReceiverToSender(senderItem: string, receiverItem: string): Promise<DomainSwapRequest>;
}