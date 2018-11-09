import { Repository } from "../interfaces/Repository";
import { ORMRepository } from "../../../infrastructure/dal/implementation/ORMRepository";
import { EntityDataMapper } from "../../../infrastructure/dal/interfaces/EntityDataMapper";
import { inject, unmanaged, injectable } from "inversify";

@injectable()
export class RepositoryImp<DomainEntity, DALEntity> implements Repository<DomainEntity> {

    private readonly _repository: ORMRepository<DALEntity>;
    private readonly _dataMapper: EntityDataMapper<DomainEntity, DALEntity>;

    constructor(
        @unmanaged() repository: ORMRepository<DALEntity>,
        @unmanaged() dataMapper: EntityDataMapper<DomainEntity, DALEntity>
    ){
        this._repository = repository;
        this._dataMapper = dataMapper;
    }

    public async login(email: string, password: string): Promise<DomainEntity> {
        const user = await this._repository.login(email, password);
        return this._dataMapper.toDomain(user);
    }
}