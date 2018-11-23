import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {DomainItem} from "../../domain/entities/DomainItem";
import {DALItem} from "../entities/dal/DALItem";
import {injectable} from "inversify";
import {DomainInterest} from "../../domain/entities/DomainInterest";
import {DomainUser} from "../../domain/entities/DomainUser";

@injectable()
export class ItemDataMapper implements EntityDataMapper<DomainItem, DALItem>{

    toDomain(dalObject: DALItem): DomainItem {
        let item: DomainItem = new DomainItem();
        item._id = dalObject._id;
        item.status = dalObject.status;
        item.name = dalObject.name;
        item.description = dalObject.description;
        item.oneWeekMilli = dalObject.oneWeekMilli;
        item.owner = new DomainUser();
        item.owner._id = dalObject.owner;
        item.i_urls = dalObject.i_urls;
        item.category = new DomainInterest();
        item.category._id = dalObject.category;
        item.createdAt = dalObject.createdAt;
        return item;
    }

    toDAL(domainObject: DomainItem): DALItem {
        let item: DALItem = new DALItem();
        item._id = domainObject._id;
        item.status = domainObject.status;
        item.name = domainObject.name;
        item.description = domainObject.description;
        item.oneWeekMilli = domainObject.oneWeekMilli;
        item.owner = domainObject.owner._id;
        item.i_urls = domainObject.i_urls;
        item.category = domainObject.category._id;
        item.createdAt = domainObject.createdAt;
        return item;
    }

}