import {Repository} from "../base/Repository";
import {DomainUser} from "../../entities/DomainUser";
import {DomainUserInterests} from "../../entities/DomainUserInterests";
import {DomainItem} from "../../entities/DomainItem";
import {DomainSwapRequest} from "../../entities/DomainSwapRequest";

export interface UserRepository extends Repository<DomainUser> {
    //user functions
    isUserExist(userId: string): Promise<string>;
    getUser(userId: string): Promise<DomainUser>;
    isUserOngoing(userId: string): Promise<boolean>;

    //interests functions
    addInterests(object: DomainUserInterests): Promise<DomainUserInterests>;
    getInterests(userId: string): Promise<DomainUserInterests>;
    removeOneInterests(interestId: string, userId: string): Promise<boolean>;
    removeAllInterests(userId: string): Promise<boolean>;

    //items functions
    addItem(object: DomainItem): Promise<DomainItem>;
    updateItem(itemId: string, object: DomainItem): Promise<DomainItem>;
    getOneItem(itemId: string, userId: string): Promise<DomainItem>;
    getUserItems(userId: string): Promise<DomainItem[]>;
    removeItem(itemId: string, userId: string): Promise<boolean>;

    //swap request
    ask(object: DomainSwapRequest): Promise<DomainSwapRequest>;
    accept(userId: string, swapId: string): Promise<boolean>;
    reject(userId: string, swapId: string, reason: string): Promise<boolean>;
    isFromIndividualToBusiness(senderId: string, receiverId: string): Promise<boolean>;
}