import {Repository} from "../base/Repository";
import {DomainItem} from "../../entities/DomainItem";

export interface UserItemRepository extends Repository<DomainItem> {
    addItem(object: DomainItem): Promise<DomainItem>;
    updateItem(itemId: string, object: DomainItem): Promise<DomainItem>;
    getOneItem(itemId: string): Promise<DomainItem>;
    getUserItems(userId: string): Promise<DomainItem[]>;
    removeItem(itemId: string): Promise<boolean>;
}