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
        @inject(TYPES.ORMRepositoryForUserEntity) repository: ORMRepository<MongoUser>
    ){
        super(repository, new AuthDataMapper());
    }
}