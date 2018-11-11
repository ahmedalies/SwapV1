import { Repository } from "../interfaces/Repository";
import { ORMRepository } from "../../../infrastructure/dal/implementation/ORMRepository";
import { EntityDataMapper } from "../../../infrastructure/dal/interfaces/EntityDataMapper";
import { inject, unmanaged, injectable } from "inversify";
import { BaseSchema } from "../../../infrastructure/dal/entities/mongo/schemas/BaseSchema";

@injectable()
export class RepositoryImp<DomainEntity, DALEntity> implements Repository<DomainEntity> {

    protected readonly _repository: ORMRepository<DALEntity>;
    protected readonly _dataMapper: EntityDataMapper<DomainEntity, DALEntity>;
    protected readonly _model: BaseSchema;

    constructor(
        @unmanaged() repository: ORMRepository<DALEntity>,
        @unmanaged() dataMapper: EntityDataMapper<DomainEntity, DALEntity>,
        @unmanaged() model: BaseSchema
    ){
        this._repository = repository;
        this._dataMapper = dataMapper;
        this._model = model;
    }

    public async insert(data: DomainEntity): Promise<DomainEntity> {
        const p = await this._repository.insert(this._dataMapper.toDAL(data), this._model)
        .then((user: DALEntity) => {
            return Promise.resolve(this._dataMapper.toDomain(user));
        }).catch((err) => {
            return Promise.reject(err);
        });

        return p;
    }

    public async findByTwoKeys(k1: string, k2: string, v1: string|number|boolean, v2: string|number|boolean): Promise<DomainEntity>{
        const p = await this._repository.findByTwoKeys(k1, k2, v1, v2, this._model)
        .then((user: DALEntity) => {
            return Promise.resolve(this._dataMapper.toDomain(user));
        }).catch((err) => {
            return Promise.reject(err);
        });

        return p;
    }
}