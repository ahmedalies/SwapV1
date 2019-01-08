import { Repository } from "./Repository";
import { EntityDataMapper } from "../../../infrastructure/interfaces/EntityDataMapper";
import { inject, unmanaged, injectable } from "inversify";
import { BaseSchema } from "../../../infrastructure/interfaces/BaseSchema";
import {ORMRepository} from "../../../infrastructure/implementation/ORMRepository";
import * as crypto from 'crypto';

@injectable()
export class RepositoryImp<DomainEntity, DALEntity> implements Repository<DomainEntity> {

    protected readonly _repository: ORMRepository<DALEntity>;
    protected readonly _dataMapper: EntityDataMapper<DomainEntity, DALEntity>;
    protected readonly _model: BaseSchema | string[];

    constructor(
        @unmanaged() repository: ORMRepository<DALEntity>,
        @unmanaged() dataMapper: EntityDataMapper<DomainEntity, DALEntity>,
        @unmanaged() model: BaseSchema | string[]
    ){
        this._repository = repository;
        this._dataMapper = dataMapper;
        this._model = model;
    }

    public async insert(insertKeys: string[], insertValues: string[]): Promise<DomainEntity> {
        return await this._repository.insertV1(insertKeys, insertValues, this._model)
        .then((res: DALEntity) => {
            return Promise.resolve(this._dataMapper.toDomain(res));
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    public async findByTwoKeys(queryElement: any): Promise<DomainEntity>{
        return await this._repository.findByTwoKeysWithQuery(queryElement, this._model[0])
        .then((res: DALEntity) => {
            return Promise.resolve(this._dataMapper.toDomain(res));
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    public async findOne(selections: string[], whereKeys:string[], whereValues: string[], fromQoutes: number): Promise<DomainEntity>{
        return await this._repository.findOne(selections, whereKeys, whereValues, fromQoutes, this._model)
            .then((res: DALEntity) => {
                return Promise.resolve(this._dataMapper.toDomain(res));
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async findMany(selections: string[], whereKeys:string[], whereValues: string[], fromQoutes: number): Promise<DomainEntity[]>{
        return await this._repository.findMany(selections, whereKeys, whereValues, fromQoutes, this._model)
            .then((res: DALEntity[]) => {
                let domainEntities = [];
                res.forEach((item) => {
                    //console.log(this._dataMapper.toDomain(item))
                    domainEntities.push(this._dataMapper.toDomain(item));
                });
                return Promise.resolve(domainEntities);
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async findAll(): Promise<DomainEntity[]> {
        return await this._repository.findAll(this._model[0])
            .then((res: DALEntity[]) => {
                let domainEntities = [];
                if (res) {
                    res.forEach((item) => {
                        domainEntities.push(this._dataMapper.toDomain(item));
                    });
                }
                return Promise.resolve(domainEntities);
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async findByOneKey(queryElement: any): Promise<DomainEntity> {
        return await this._repository.findByOneKey(queryElement, this._model[0])
            .then((res: DALEntity) => {
                return Promise.resolve(this._dataMapper.toDomain(res));
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async update(updateKeys: string[], updateValues: string[], whereKeys: string[], whereValues: string[]): Promise<DomainEntity> {
        return await this._repository.updateV1(updateKeys, updateValues, whereKeys, whereValues, this._model[0])
            .then((res: DALEntity) => {
                return Promise.resolve(this._dataMapper.toDomain(res));
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async remove(id: string): Promise<boolean> {
        return await this._repository.remove(id, this._model[0])
            .then((res) => {
                return Promise.resolve(true);
            }).catch((err) => {
                return Promise.reject(err);
            });
    }

    public async findAllByOnKey(queryElement: any): Promise<DomainEntity[]> {
        return await this._repository.findAllByOneKey(queryElement, this._model[0])
            .then((res: DALEntity[]) => {
                let domainEntities = [];
                if (res) {
                    res.forEach((item) => {
                        domainEntities.push(this._dataMapper.toDomain(item));
                    });
                }
                return Promise.resolve(domainEntities);
            }).catch((err) => {
                return Promise.reject(err);
            });
    }


    public async createSHA1Hash(value: any): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            try {
                resolve(crypto.createHash('sha1').update(value).digest('hex'));
            } catch(err) {
                reject(err);
            }
        });
    }
}