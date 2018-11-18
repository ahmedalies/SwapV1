import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {DomainItem} from "../../../domain/entities/DomainItem";
import {DALItem} from "../../entities/dal/DALItem";
import {injectable} from "inversify";

@injectable()
export class ItemDataMapper implements EntityDataMapper<DomainItem, DALItem>{

    toDomain(dalObject: DALItem): DomainItem {
        let item: DomainItem = new DomainItem();
        item._id = dalObject._id;
        item.status = dalObject.status;
        item.name = dalObject.name;
        item.description = dalObject.description;
        item.onWeekMilli = dalObject.onWeekMilli;
        item.owner = dalObject.owner;
        item.i_urls = dalObject.i_urls;
        item.category = dalObject.category;
        item.createdAt = dalObject.createdAt;
        return item;
    }

    toDAL(domainObject: DomainItem): DALItem {
        let item: DALItem = new DALItem();
        item._id = domainObject._id;
        item.status = domainObject.status;
        item.name = domainObject.name;
        item.description = domainObject.description;
        item.onWeekMilli = domainObject.onWeekMilli;
        item.owner = domainObject.owner;
        item.i_urls = domainObject.i_urls;
        item.category = domainObject.category;
        item.createdAt = domainObject.createdAt;
        return item;
    }

}