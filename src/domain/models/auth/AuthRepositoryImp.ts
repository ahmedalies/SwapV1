import { RepositoryImp } from "../base/RepositoryImp";
import { DomainUser } from "../../entities/DomainUser";
import { DALUser } from "../../../infrastructure/entities/dal/DALUser";
import { AuthRepository } from "./AuthRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/types";
import { UserDataMapper } from "../../../infrastructure/data_mapper/UserDataMapper";
import { UserSchema } from "../../../infrastructure/entities/mongo/schemas/UserSchema";
import {ORMRepository} from "../../../infrastructure/implementation/ORMRepository";
import * as crypto from 'crypto'

@injectable()
export class AuthRepositoryImp extends RepositoryImp<DomainUser, DALUser> implements AuthRepository {

    public constructor(
        @inject(TYPES.ORMRepositoryForUserEntity) private repository: ORMRepository<DALUser>,
        @inject(TYPES.EntityDataMapperForUser) private dataMapper: UserDataMapper,
        @inject(TYPES.UserSchema) private model: UserSchema,
    ){
        super(repository, dataMapper, ['users', 'userstatus', 'usertype']);
    }

    public async login(email: string, password: string): Promise<DomainUser> {
        return await new Promise<DomainUser>((resolve, reject) => {
            this.generateApiKey(email)
                .then((apiKey) => {
                    super.findOne(['users.*', 'userstatus.status as statusString',
                     'usertype.type as typeString'],
                     ['email', 'users.status', 'users.userType'],
                     [email, 'userstatus.id', 'usertype.id'], 1)
                        .then((user) => {
                            if(user.password === password) {
                                super.update(['accessToken', 'validAccessTokenTill'],
                                     [apiKey, (Date.now() + 2592000000).toString()], ['_id'], [user._id])
                                .then((res) => {
                                    user.accessToken = res.accessToken;
                                    resolve(user);
                                }).catch((err) => {
                                    console.log(err)
                                    reject(err);
                                });
                            } else {
                                reject('invalid password');
                            }
                        }).catch((err) => {
                            if (err === 'document not found')
                                reject('invalid credentials');
                            else
                                reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async register(userData: DomainUser): Promise<DomainUser> {
        return await new Promise<DomainUser>((resolve, reject) => {
            this.generateApiKey(userData.email)
                .then((apiKey) => {
                    userData._id = crypto.createHash('sha1').update(userData.email).digest('hex');
                    userData.accessToken = apiKey;
                    super.insert(['_id', 'email', 'password', 'username',
                    'phone', 'avatar', 'gender', 'points', 'isLoggedIn', 'online', 'accessToken',
                     'validAccessTokenTill', 'lang'],
                        [userData._id, userData.email, userData.password, userData.name, userData.phone,
                             '', userData.gender, '0', '1', '1', userData.accessToken, 
                             (Date.now() + 2592000000).toString(), userData.lang])
                        .then((res) => {
                            this.login(res.email, res.password)
                            .then((user) => {
                                resolve(user);
                            }).catch((err) => {
                                reject(err);
                            });
                        }).catch((err) => {
                            if (err.startsWith('Duplicate entry'))
                                reject('email already exist');
                            else
                                reject(err)
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }


    public async generateApiKey(email: string): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            resolve(crypto.createHash('sha1').update(email + Date.now()).digest('hex'));
        });
    }
}