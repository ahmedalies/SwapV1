import {Repository} from "../base/Repository";
import {DomainItem} from "../../entities/DomainItem";

export interface UserItemRepository extends Repository<DomainItem> {
    addItem(object: DomainItem): Promise<DomainItem>;
    updateItem(itemId: string, object: DomainItem): Promise<DomainItem>;
    getOneItem(itemId: string): Promise<DomainItem>;
    getOneItemByIdInt(itemId: number): Promise<DomainItem>
    getAvailableUserItems(userId: string|number): Promise<DomainItem[]>;
    getSwappedUserItems(userId: string|number): Promise<DomainItem[]>;
    removeItem(itemId: string): Promise<boolean>;
    getAvailableFromCategory(userId: number|string, interestsId: number[]|string[]): Promise<DomainItem[]>;
}