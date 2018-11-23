import {RepositoryImp} from "../base/RepositoryImp";
import {DomainUser} from "../../entities/DomainUser";
import {DALUser} from "../../../infrastructure/entities/dal/DALUser";
import {UserRepository} from "./UserRepository";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../infrastructure/types";
import {TYPES as DOMAIN_TYPES} from '../../types'
import {MongoORMRepository} from "../../../infrastructure/implementation/MongoORMRepository";
import {UserSchema} from "../../../infrastructure/entities/mongo/schemas/UserSchema";
import {UserDataMapper} from "../../../infrastructure/data_mapper/UserDataMapper";
import {AuthRepository} from "../auth/AuthRepository";
import {AuthRepositoryImp} from "../auth/AuthRepositoryImp";
import {DomainUserInterests} from "../../entities/DomainUserInterests";
import {UserInterestsRepository} from "../user_interests/UserInterestsRepository";
import {UserInterestsRepositoryImp} from "../user_interests/UserInterestsRepositoryImp";
import {UserItemRepository} from "../user_item/UserItemRepository";
import {UserItemRepositoryImp} from "../user_item/UserItemRepositoryImp";
import {DomainItem} from "../../entities/DomainItem";
import {InterestsRepository} from "../interests/InterestsRepository";
import {InterestsRepositoryImp} from "../interests/InterestsRepositoryImp";
import {userInfo} from "os";
import {DomainSwapRequest} from "../../entities/DomainSwapRequest";
import {SwapRequestRepository} from "../swap_request/SwapRequestRepository";
import {SwapRequestRepositoryImp} from "../swap_request/SwapRequestRepositoryImp";
import {SwapRequestCallback} from "../swap_request/SwapRequestCallback";

@injectable()
export class UserRepositoryImp extends RepositoryImp<DomainUser, DALUser> implements UserRepository, SwapRequestCallback {

    userAuth: AuthRepository;
    userInterests: UserInterestsRepository;
    interest: InterestsRepository;
    userItem: UserItemRepository;
    swapRequest: SwapRequestRepository;
    repository: MongoORMRepository<DALUser>;
    model: UserSchema;

    constructor(
        @inject(TYPES.ORMRepositoryForUserEntity) repository: MongoORMRepository<DALUser>,
        @inject(TYPES.EntityDataMapperForUser) dataMapper: UserDataMapper,
        @inject(TYPES.UserSchema) model: UserSchema,
        @inject(DOMAIN_TYPES.UserInterestsRepository) userInterests: UserInterestsRepositoryImp,
        @inject(DOMAIN_TYPES.InterestsRepository) interests: InterestsRepositoryImp,
        @inject(DOMAIN_TYPES.AuthRepository) auth: AuthRepositoryImp,
        @inject(DOMAIN_TYPES.UserItemRepository) userItem: UserItemRepositoryImp,
        @inject(DOMAIN_TYPES.SwapRequestRepository) swapRequest: SwapRequestRepositoryImp
    ){
        super(repository, dataMapper, model);
        this.repository = repository;
        this.model = model;
        this.userInterests = userInterests;
        this.interest = interests;
        this.userAuth = auth;
        this.userItem = userItem;
        this.swapRequest = swapRequest;
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

    public async getUser(userId: string): Promise<DomainUser> {
        return await new Promise<DomainUser>((resolve, reject) => {
            super.findByOneKey({_id: userId})
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async isUserOngoing(userId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.findByOneKey({_id: userId})
                .then((res) => {
                    if (res.status === 'ongoing') resolve(true);
                    else reject('user is blocked for rate')
                }).catch((err) => {
                    reject(err);
            });
        });
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
            this.isUserExist(object.owner._id)
                .then((res) => {
                    object.owner._id = res;
                    this.interest.getInterest(object.category._id)
                        .then((res) => {
                        object.category._id = res._id;
                            this.userItem.addItem(object)
                                .then((item) => {
                                    this.getUser(object.owner._id)
                                        .then((res) => {
                                            item.owner = res;
                                            item.owner.password = null;
                                            this.interest.getInterest(item.category._id)
                                                .then((res) => {
                                                    item.category = res;
                                                    item.category.created_by = null;
                                                    resolve(item);
                                                }).catch((err) => {
                                                    reject(err);
                                                });
                                        }).catch((err) => {
                                            reject(err);
                                        });
                                }).catch((err) => {
                                    reject(err);
                                })
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async updateItem(itemId: string, object: DomainItem): Promise<DomainItem> {
        return await new Promise<DomainItem>((resolve, reject) => {
            this.isUserExist(object.owner._id)
                .then((res) => {
                    object.owner._id = res;
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

    public async ask(object: DomainSwapRequest): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            this.isFromIndividualToBusiness(object.senderItem.owner._id, object.receiverItem.owner._id)
                .then((res) => {
                    if (res) {
                        reject('permission denied');
                    } else {
                        this.swapRequest.ask(object)
                            .then((request) => {
                                this.getUser(object.senderItem.owner._id)
                                    .then((res) => {
                                        res.password = null;
                                        request.senderItem.owner = res;
                                        this.interest.getInterest(request.senderItem.category._id)
                                            .then((res) => {
                                                res.created_by = null;
                                                request.senderItem.category = res;
                                                this.getUser(request.receiverItem.owner._id)
                                                    .then((res) => {
                                                        res.password = null;
                                                        request.receiverItem.owner = res;
                                                        this.interest.getInterest(request.receiverItem.category._id)
                                                            .then((res) => {
                                                                res.created_by = null;
                                                                request.receiverItem.category = res;
                                                                resolve(request);
                                                            }).catch((err) => {
                                                                reject(err);
                                                            });
                                                    }).catch((err) => {
                                                        reject(err);
                                                    });
                                            }).catch((err) => {
                                                reject(err);
                                            });
                                    }).catch((err) => {
                                        reject(err);
                                    });
                            }).catch((err) => {
                                reject(err);
                            });
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async accept(userId: string, swapId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {

        });
    }

    public async reject(userId: string, swapId: string, reason: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {

        });
    }

    public async isFromIndividualToBusiness(senderId: string, receiverId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.findByOneKey({_id: senderId})
                .then((res) => {
                    if (res.userType === 'individual') {
                        super.findByOneKey({_id: receiverId})
                            .then((res) => {
                                if (res.userType === 'business'){
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            }).catch((err) => {
                                reject(err);
                            });
                    } else {
                        resolve(false);
                    }
                }).catch((err) => {
                    reject(err)
                });
        });
    }

    public on24HoursIntervalDone(senderUserId: string, receiverUserId: string, blockSender: boolean, blockReceiver: boolean) {
        if (blockSender){
            this.getUser(senderUserId)
                .then((res) => {
                    res.status = 'blocked for rate';
                    this.update(res._id, res);
                }).catch((err) => {
                    console.log(err);
                });
        }
        if (blockReceiver) {
            this.getUser(senderUserId)
                .then((res) => {
                    res.status = 'blocked for rate';
                    this.update(res._id, res);
                }).catch((err) => {
                    console.log(err);
                });
        }
    }
}