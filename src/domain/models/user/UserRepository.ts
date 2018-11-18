import {Repository} from "../base/Repository";
import {DomainUser} from "../../entities/DomainUser";
import {DomainUserInterests} from "../../entities/DomainUserInterests";
import {DomainItem} from "../../entities/DomainItem";

export interface UserRepository extends Repository<DomainUser> {
    //user functions
    isUserExist(userId: string): Promise<string>;

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
}