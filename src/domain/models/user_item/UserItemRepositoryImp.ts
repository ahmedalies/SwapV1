import {RepositoryImp} from "../base/RepositoryImp";
import {DomainItem} from "../../entities/DomainItem";
import {DALItem} from "../../../infrastructure/entities/dal/DALItem";
import {UserItemRepository} from "./UserItemRepository";
import {inject, injectable} from "inversify";
import {ItemSchema} from "../../../infrastructure/entities/mongo/schemas/ItemSchema";
import {TYPES} from "../../../infrastructure/types";
import {ItemDataMapper} from "../../../infrastructure/data_mapper/ItemDataMapper";
import {MongoORMRepository} from "../../../infrastructure/implementation/MongoORMRepository";

@injectable()
export class UserItemRepositoryImp extends RepositoryImp<DomainItem, DALItem> implements UserItemRepository {

    constructor(
        @inject(TYPES.ORMRepositoryForUserItemEntity) repository: MongoORMRepository<DALItem>,
        @inject(TYPES.EntityDataMapperForItem) dataMapper: ItemDataMapper,
        @inject(TYPES.ItemSchema) model: ItemSchema,
    ){
        super(repository, dataMapper, model);
    }

    public async addItem(object: DomainItem): Promise<DomainItem> {
        object.createdAt = Date.now();
        object.status = "available";
        object.oneWeekMilli = 604800000;
        return await new Promise<DomainItem>((resolve, reject) => {
           super.insert(object)
               .then((res) => {
                   resolve(res);
               }).catch((err) => {
                   reject(err);
               });
        });
    }

    public async updateItem(itemId: string, object: DomainItem): Promise<DomainItem> {
        return await new Promise<DomainItem>((resolve, reject) => {
            super.update(itemId, object)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async getOneItem(itemId: string): Promise<DomainItem> {
        return await super.findByOneKey({_id: itemId});
    }

    public async getUserItems(userId: string): Promise<DomainItem[]> {
        return await super.findAllByOnKey({owner: userId});
    }

    public async removeItem(itemId: string): Promise<boolean> {
        return super.remove(itemId);
    }
}