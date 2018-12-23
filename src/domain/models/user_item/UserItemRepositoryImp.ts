import {RepositoryImp} from "../base/RepositoryImp";
import {DomainItem} from "../../entities/DomainItem";
import {DALItem} from "../../../infrastructure/entities/dal/DALItem";
import {UserItemRepository} from "./UserItemRepository";
import {inject, injectable} from "inversify";
import {ItemSchema} from "../../../infrastructure/entities/mongo/schemas/ItemSchema";
import {TYPES} from "../../../infrastructure/types";
import {ItemDataMapper} from "../../../infrastructure/data_mapper/ItemDataMapper";
import {ORMRepository} from "../../../infrastructure/implementation/ORMRepository";

@injectable()
export class UserItemRepositoryImp extends RepositoryImp<DomainItem, DALItem> implements UserItemRepository {

    constructor(
        @inject(TYPES.ORMRepositoryForUserItemEntity) private repository: ORMRepository<DALItem>,
        @inject(TYPES.EntityDataMapperForItem) private dataMapper: ItemDataMapper,
        @inject(TYPES.ItemSchema) private model: ItemSchema,
    ){
        super(repository, dataMapper, ['items']);
    }

    public async addItem(object: DomainItem): Promise<DomainItem> {
        object.status = "available";
        object.oneWeekMilli = 604800000;
        return await new Promise<DomainItem>((resolve, reject) => {
            super.createSHA1Hash(object.owner._id + Date.now())
                .then((res) => {
                    super.insert(['_id', 'status', 'oneWeekMilli', 'owner', 'name', 'description', 'category'],
                        [res, '1', object.oneWeekMilli.toString(), object.owner.id.toString(), object.name, object.description, object.category.id.toString()])
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async updateItem(itemId: string, object: DomainItem): Promise<DomainItem> {
        return await new Promise<DomainItem>((resolve, reject) => {
            super.update(['status', 'oneWeekMilli', 'owner', 'name', 'description', 'category'],
                [object.status, object.oneWeekMilli.toString(), object.owner._id, object.name, object.description, object.category._id],
                ['_id'], [itemId])
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async getOneItem(itemId: string): Promise<DomainItem> {
        return await new Promise<DomainItem>((resolve, reject) => {
            this.repository.findOne(['items.*', 'itemstatus.state', 'users._id as ownerId', 'users.userType', 
            'usertype.type as ownerType'],
            ['items._id', 'items.owner', 'users.userType', 'items.status'],
            [itemId, 'users.id', 'usertype.id', 'itemstatus.id'], 1,
            ['items', 'users', 'usertype', 'itemstatus'])
            .then((res) => {
                //console.log(this.dataMapper.toDomain(res))
                resolve(this.dataMapper.toDomain(res));
            }).catch((err) => {
                console.log(err)
                reject(err);
            })
        })
    }

    public async getOneItemByIdInt(itemId: number): Promise<DomainItem> {
        return await new Promise<DomainItem>((resolve, reject) => {
            this.repository.findOne(['items.*', 'itemstatus.state', 'users._id as ownerId', 'users.userType', 
            'usertype.type as ownerType'],
            ['items.id', 'items.owner', 'users.userType', 'items.status'],
            [itemId.toString(), 'users.id', 'usertype.id', 'itemstatus.id'], 1,
            ['items', 'users', 'usertype', 'itemstatus'])
            .then((res) => {
                //console.log(this.dataMapper.toDomain(res))
                resolve(this.dataMapper.toDomain(res));
            }).catch((err) => {
                console.log(err)
                reject(err);
            })
        })
    }

    public async getUserItems(userId: string): Promise<DomainItem[]> {
        return await super.findAllByOnKey({owner: userId});
    }

    public async removeItem(itemId: string): Promise<boolean> {
        return super.remove(itemId);
    }
}