import {RepositoryImp} from "../base/RepositoryImp";
import {DomainUser} from "../../entities/DomainUser";
import {DALUser} from "../../../infrastructure/entities/dal/DALUser";
import {UserRepository} from "./UserRepository";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../infrastructure/types";
import {TYPES as DOMAIN_TYPES} from '../../types'
import {MongoORMRepository} from "../../../infrastructure/dal/implementation/MongoORMRepository";
import {UserSchema} from "../../../infrastructure/entities/mongo/schemas/UserSchema";
import {UserDataMapper} from "../../../infrastructure/dal/data_mapper/UserDataMapper";
import {AuthRepository} from "../auth/AuthRepository";
import {AuthRepositoryImp} from "../auth/AuthRepositoryImp";
import {DomainUserInterests} from "../../entities/DomainUserInterests";
import {UserInterestsRepository} from "../user_interests/UserInterestsRepository";
import {UserInterestsRepositoryImp} from "../user_interests/UserInterestsRepositoryImp";
import {UserItemRepository} from "../user_item/UserItemRepository";
import {UserItemRepositoryImp} from "../user_item/UserItemRepositoryImp";
import {DomainItem} from "../../entities/DomainItem";

@injectable()
export class UserRepositoryImp extends RepositoryImp<DomainUser, DALUser> implements UserRepository {

    userAuth: AuthRepository;
    userInterests: UserInterestsRepository;
    userItem: UserItemRepository;
    repository: MongoORMRepository<DALUser>;
    model: UserSchema;

    constructor(
        @inject(TYPES.ORMRepositoryForUserEntity) repository: MongoORMRepository<DALUser>,
        @inject(TYPES.EntityDataMapperForUser) dataMapper: UserDataMapper,
        @inject(TYPES.UserSchema) model: UserSchema,
        @inject(DOMAIN_TYPES.UserInterestsRepository) interests: UserInterestsRepositoryImp,
        @inject(DOMAIN_TYPES.AuthRepository) auth: AuthRepositoryImp,
        @inject(DOMAIN_TYPES.UserItemRepository) userItem: UserItemRepositoryImp
    ){
        super(repository, dataMapper, model);
        this.repository = repository;
        this.model = model;
        this.userInterests = interests;
        this.userAuth = auth;
        this.userItem = userItem;
    }

    public async isUserExist(userId: string): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            super.findByOneKey({_id: userId})
                .then((res) => {
                    resolve(res._id)
                }).catch((err) => {
                    reject('user does\'t exist');
                });
        })
    }

    public async addInterests(object: DomainUserInterests): Promise<DomainUserInterests> {
        return await new Promise<DomainUserInterests>((resolve, reject) => {
            this.isUserExist(object.userId)
                .then((res) => {
                    object.userId = res;
                    this.userInterests.add(object)
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                    });
        });

    }

    public async getInterests(userId: string): Promise<DomainUserInterests> {
        return await new Promise<DomainUserInterests>((resolve, reject) => {
            this.isUserExist(userId)
                .then((res) => {
                    this.userInterests.get(res)
                        .then((res) => {
                            resolve(res)
                        }).catch((err) => {
                            reject(err)
                        });
                }).catch((err) => {
                    reject(err)
                });

        });
    }

    public async removeOneInterests(interestId: string, userId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.isUserExist(userId)
                .then((res) => {
                    this.userInterests.removeOne(interestId, res)
                        .then((res) => {
                            resolve(res)
                        }).catch((err) => {
                            reject(err)
                        });
                }).catch((err) => {
                    reject(err)
                });
        });
    }

    public async removeAllInterests(userId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.isUserExist(userId)
                .then((res) => {
                    this.userInterests.removeAll(res)
                        .then((res) => {
                            resolve(res)
                        }).catch((err) => {
                            reject(err)
                        });
                }).catch((err) => {
                    reject(err)
                });
        });
    }

    public async addItem(object: DomainItem): Promise<DomainItem> {
        return await new Promise<DomainItem>((resolve, reject) => {
            this.isUserExist(object.owner)
                .then((res) => {
                    object.owner = res;
                    this.userItem.addItem(object)
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                        })
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async updateItem(itemId: string, object: DomainItem): Promise<DomainItem> {
        return await new Promise<DomainItem>((resolve, reject) => {
            this.isUserExist(object.owner)
                .then((res) => {
                    object.owner = res;
                    this.userItem.update(itemId, object)
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async getOneItem(itemId: string, userId: string): Promise<DomainItem> {
        return await new Promise<DomainItem>((resolve, reject) => {
            this.isUserExist(userId)
                .then((res) => {
                    this.userItem.getOneItem(itemId)
                        .then((res) => {
                            resolve(res)
                        }).catch((err) => {
                            reject(err)
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async getUserItems(userId: string): Promise<DomainItem[]> {
        return await new Promise<DomainItem[]>((resolve, reject) => {
            this.isUserExist(userId)
                .then((res) => {
                    this.userItem.getUserItems(res)
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async removeItem(itemId: string, userId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.isUserExist(userId)
                .then((res) => {
                    this.userItem.removeItem(itemId)
                        .then((res) => {
                            resolve(true)
                        }).catch((err) => {
                            reject(err);
                        })
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}