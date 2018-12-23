import {injectable} from "inversify";
import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {DomainSwapRequest} from "../../domain/entities/DomainSwapRequest";
import {DALSwapRequest} from "../entities/dal/DALSwapRequest";
import {DomainItem} from "../../domain/entities/DomainItem";

@injectable()
export class SwapRequestMapper implements EntityDataMapper<DomainSwapRequest, DALSwapRequest> {

    toDomain(dalObject: DALSwapRequest): DomainSwapRequest {
        let request = new DomainSwapRequest();
        request._id = dalObject._id;
        request.senderRate = dalObject.sender_rate;
        request.receiverRate = dalObject.receiver_rate;
        request.respondAt = dalObject.respond_at;
        request.status = dalObject.status;
        request.milliSecondAfter24Hours = dalObject.milli24h;
        request.senderItem = new DomainItem();
        request.senderItem.id = dalObject.sender_item;
        request.receiverItem = new DomainItem();
        request.receiverItem.id = dalObject.receiver_item;
        request.createdAt = dalObject.created_at;
        request.swapStatusString = dalObject.swapStatusString;
        return request;
    }

    toDAL(domainObject: DomainSwapRequest): DALSwapRequest {
        let request = new DALSwapRequest();
        request._id = domainObject._id;
        request.sender_rate = domainObject.senderRate;
        request.receiver_rate = domainObject.receiverRate;
        request.respond_at = domainObject.respondAt;
        request.status = domainObject.status;
        request.milli24h = domainObject.milliSecondAfter24Hours;
        request.sender_item = domainObject.senderItem.id;
        request.receiver_item = domainObject.receiverItem.id;
        request.created_at = domainObject.createdAt;
        return request;
    }

}