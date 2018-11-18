import { Repository } from "./Repository";
import { MongoORMRepository } from "../../../infrastructure/dal/implementation/MongoORMRepository";
import { EntityDataMapper } from "../../../infrastructure/dal/interfaces/EntityDataMapper";
import { inject, unmanaged, injectable } from "inversify";
import { BaseSchema } from "../../../infrastructure/entities/mongo/schemas/BaseSchema";

@injectable()
export class RepositoryImp<DomainEntity, DALEntity> implements Repository<DomainEntity> {

    protected readonly _repository: MongoORMRepository<DALEntity>;
    protected readonly _dataMapper: EntityDataMapper<DomainEntity, DALEntity>;
    protected readonly _model: BaseSchema;

    constructor(
        @unmanaged() repository: MongoORMRepository<DALEntity>,
        @unmanaged() dataMapper: EntityDataMapper<DomainEntity, DALEntity>,
        @unmanaged() model: BaseSchema
    ){
        this._repository = repository;
        this._dataMapper = dataMapper;
        this._model = model;
    }

    public async insert(data: DomainEntity): Promise<DomainEntity> {
        return await this._repository.insert(this._dataMapper.toDAL(data), this._model)
        .then((user: DALEntity) => {
            return Promise.resolve(this._dataMapper.toDomain(user));
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    public async findByTwoKeys(k1: string, k2: string, v1: string|number|boolean, v2: string|number|boolean): Promise<DomainEntity>{
        return await this._repository.findByTwoKeys(k1, k2, v1, v2, this._model)
        .then((user: DALEntity) => {
            return Promise.resolve(this._dataMapper.toDomain(user));
        }).catch((err) => {
            return Promise.reject(err);
        });
    }


    public async findAll(): Promise<DomainEntity[]> {
        return await this._repository.findAll(this._model)
            .then((interests: DALEntity[]) => {
                let domainEntities = [];
                if (interests) {
                    interests.forEach((item) => {
                        domainEntities.push(this._dataMapper.toDomain(item));
                    });
                }
                return Promise.resolve(domainEntities);
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async findByOneKey(queryElement: any): Promise<DomainEntity> {
        return await this._repository.findByOneKey(queryElement, this._model)
            .then((res: DALEntity) => {
                return Promise.resolve(this._dataMapper.toDomain(res));
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async update(id: string, object: DomainEntity): Promise<DomainEntity> {
        return await this._repository.update(id, this._dataMapper.toDAL(object), this._model)
            .then((interest: DALEntity) => {
                return Promise.resolve(this._dataMapper.toDomain(interest));
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async remove(id: string): Promise<boolean> {
        return await this._repository.remove(id, this._model)
            .then((interest) => {
                return Promise.resolve(true);
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async findAllByOnKey(queryElement: any): Promise<DomainEntity[]> {
        return await this._repository.findAllByOneKey(queryElement, this._model)
            .then((interests: DALEntity[]) => {
                let domainEntities = [];
                if (interests) {
                    interests.forEach((item) => {
                        domainEntities.push(this._dataMapper.toDomain(item));
                    });
                }
                return Promise.resolve(domainEntities);
            }).catch((err) => {
                return Promise.reject(err);
            });
    }
}