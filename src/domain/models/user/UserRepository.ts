import {Repository} from "../base/Repository";
import {DomainUser} from "../../entities/DomainUser";
import {DomainUserInterests} from "../../entities/DomainUserInterests";
import {DomainItem} from "../../entities/DomainItem";
import {DomainSwapRequest} from "../../entities/DomainSwapRequest";
import { DomainInterest } from "../../entities/DomainInterest";
import { SwapRequestTypes } from "../swap_request/SwapRequestTypes";

export interface UserRepository extends Repository<DomainUser> {
    //user functions
    isUserExist(userId: string): Promise<string>;
    getUser(accessToken: string): Promise<DomainUser>;
    isUserOngoing(userId: string): Promise<boolean>;
    isValidAccessToken(accessToken: string): Promise<boolean>;

    //interests functions
    addInterests(object: DomainUserInterests, accessToken: string): Promise<DomainUserInterests>;
    getInterests(accessToken: string): Promise<DomainUserInterests>;
    getAllInterests(): Promise<DomainInterest[]>;
    removeOneInterests(interestId: string, accessToken: string): Promise<boolean>;
    removeAllInterests(accessToken: string): Promise<boolean>;

    //items functions
    addItem(object: DomainItem, accessToken: string): Promise<DomainItem>;
    updateItem(itemId: string, object: DomainItem): Promise<DomainItem>;
    getOneItem(itemId: string, userId: string): Promise<DomainItem>;
    getAvailableUserItems(accessToken: string): Promise<DomainItem[]>;
    getSwappedUserItems(accessToken: string): Promise<DomainItem[]>;
    removeItem(itemId: string, userId: string): Promise<boolean>;
    getHome(accessToken: string): Promise<DomainItem[]>;

    //swap request
    ask(object: DomainSwapRequest, accessToken: string): Promise<DomainSwapRequest>;
    accept(accessToken: string, swapId: string): Promise<boolean>;
    reject(accessToken: string, swapId: string, reason: string): Promise<boolean>;
    isFromIndividualToBusiness(senderId: string, receiverId: string): Promise<boolean>;
    getSwapRequestsForUser(accessToken: string, type: SwapRequestTypes): Promise<DomainSwapRequest[]>;
    getOneSwap(accessToken: string, swapId: string): Promise<DomainSwapRequest>;
}