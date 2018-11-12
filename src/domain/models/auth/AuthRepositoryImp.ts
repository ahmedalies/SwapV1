import { RepositoryImp } from "../base/RepositoryImp";
import { DomainUser } from "../../entities/DomainUser";
import { DALUser } from "../../../infrastructure/entities/dal/DALUser";
import { AuthRepository } from "./AuthRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/types";
import { MongoORMRepository } from "../../../infrastructure/dal/implementation/MongoORMRepository";
import { AuthDataMapper } from "../../../infrastructure/dal/data_mapper/AuthDataMapper";
import { UserSchema } from "../../../infrastructure/entities/mongo/schemas/UserSchema";

@injectable()
export class AuthRepositoryImp extends RepositoryImp<DomainUser, DALUser> implements AuthRepository {

    public constructor(
        @inject(TYPES.ORMRepositoryForUserEntity) repository: MongoORMRepository<DALUser>,
        @inject(TYPES.EntityDataMapperForAuth) dataMapper: AuthDataMapper,
        @inject(TYPES.UserSchema) model: UserSchema
    ){
        super(repository, dataMapper, model);
    }

    public async login(email: string, password: string): Promise<DomainUser> {
        return await super.findByTwoKeys('email', 'password', email, password)
        .then((doc) => {
            return Promise.resolve(doc);
        }).catch((err) => {
            if (err === 'document not found')
                return Promise.reject('invalid credentials');
            else
                return Promise.reject(err);
        });
    }

    public async register(userData: DomainUser): Promise<DomainUser> {
        return await super.insert(userData);
    }
}