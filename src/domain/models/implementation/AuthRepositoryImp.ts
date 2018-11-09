import { RepositoryImp } from "./RepositoryImp";
import { DomainUser } from "../../entities/DomainUser";
import { MongoUser } from "../../../infrastructure/dal/entities/mongo/MongoUser";
import { AuthRepository } from "../interfaces/AuthRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/dal/types";
import { ORMRepository } from "../../../infrastructure/dal/implementation/ORMRepository";
import { AuthDataMapper } from "../../../infrastructure/dal/implementation/AuthDataMapper";

@injectable()
export class AuthRepositoryImp extends RepositoryImp<DomainUser, MongoUser> implements AuthRepository {

    public constructor(
        @inject(TYPES.ORMRepositoryForUserEntity) repository: ORMRepository<MongoUser>,
        @inject(TYPES.EntityDataMApperForAuth) dataMapper: AuthDataMapper
    ){
        super(repository, dataMapper);
    }

    public async login(email: string, password: string): Promise<DomainUser> {
        const user = await this._repository.login(email, password);
        return this._dataMapper.toDomain(user);
    }
}