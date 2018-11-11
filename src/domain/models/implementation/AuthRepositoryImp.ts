import { RepositoryImp } from "./RepositoryImp";
import { DomainUser } from "../../entities/DomainUser";
import { MongoUser } from "../../../infrastructure/dal/entities/mongo/schemas/dal/MongoUser";
import { AuthRepository } from "../interfaces/AuthRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/dal/types";
import { ORMRepository } from "../../../infrastructure/dal/implementation/ORMRepository";
import { AuthDataMapper } from "../../../infrastructure/dal/implementation/AuthDataMapper";
import { Schema } from "mongoose";
import { MongoUserSchema } from "../../../infrastructure/dal/entities/mongo/schemas/UserSchema";
import { Domain } from "domain";

@injectable()
export class AuthRepositoryImp extends RepositoryImp<DomainUser, MongoUser> implements AuthRepository {

    public constructor(
        @inject(TYPES.ORMRepositoryForUserEntity) repository: ORMRepository<MongoUser>,
        @inject(TYPES.EntityDataMApperForAuth) dataMapper: AuthDataMapper,
        @inject(TYPES.UserMongoSchema) model: MongoUserSchema
    ){
        super(repository, dataMapper, model);
    }

    public async login(email: string, password: string): Promise<DomainUser> {
        const user = await super.findByTwoKeys('email', 'password', email, password)
        .then((doc) => {
            return Promise.resolve(doc);
        }).catch((err) => {
            if (err === 'document not found')
                return Promise.reject('invalid credentials');
            else
                return Promise.reject(err);
        });
        return user;
    }

    public async register(userData: DomainUser): Promise<DomainUser> {
        const user = await super.insert(userData);
        return user;
    }
}