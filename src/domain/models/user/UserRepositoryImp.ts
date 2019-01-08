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
import {MysqlORMRepository} from "../../../infrastructure/implementation/MysqlORMRepository";
import {ORMRepository} from "../../../infrastructure/implementation/ORMRepository";
import { DomainInterest } from "../../entities/DomainInterest";
import { resolve } from "../../../../node_modules/@types/bluebird";
import { SwapRequestTypes } from "../swap_request/SwapRequestTypes";

@injectable()
export class UserRepositoryImp extends RepositoryImp<DomainUser, DALUser> implements UserRepository, 
SwapRequestCallback {

    constructor(
        @inject(TYPES.ORMRepositoryForUserEntity) private repository: ORMRepository<DALUser>,
        @inject(TYPES.EntityDataMapperForUser) private dataMapper: UserDataMapper,
        @inject(TYPES.UserSchema) private model: UserSchema,
        @inject(DOMAIN_TYPES.UserInterestsRepository) private userInterests: UserInterestsRepositoryImp,
        @inject(DOMAIN_TYPES.InterestsRepository) private interests: InterestsRepositoryImp,
        @inject(DOMAIN_TYPES.AuthRepository) private userAuth: AuthRepositoryImp,
        @inject(DOMAIN_TYPES.UserItemRepository) private userItem: UserItemRepositoryImp,
        @inject(DOMAIN_TYPES.SwapRequestRepository) private swapRequest: SwapRequestRepositoryImp
    ){
        super(repository, dataMapper, ['users']);
        this.swapRequest.swapRequestCallback = this;
    }

    public async isUserExist(userId: string): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            super.findOne([], ['_id'], [userId], 0)
                .then((res) => {
                    resolve(res._id)
                }).catch((err) => {
                    reject('user does\'t exist');
                });
        })
    }

    public async getUser(accessToken: string | number): Promise<DomainUser> {
        return await new Promise<DomainUser>((resolve, reject) => {
            this.repository.findOne(['users.*', 'userstatus.status as statusString',
                     'usertype.type as typeString'],
                     ['accessToken', 'users.status', 'users.userType'],
                     [accessToken.toString(), 'userstatus.id', 'usertype.id'], 1, 
                     ['users', 'userstatus', 'usertype'])
                .then((res) => {
                    resolve(this.dataMapper.toDomain(res));
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async isUserOngoing(userId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.findOne([], ['_id'], [userId], 0)
                .then((res) => {
                    //console.log(res);
                    if (res.status === 'ongoing') resolve(true);
                    else reject('user is blocked for rate')
                }).catch((err) => {
                    reject(err);
            });
        });
    }

    public async isValidAccessToken(accessToken: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.findOne([], ['accessToken'], [accessToken], 0)
                .then((res) => {
                    if (res.isValidToken) resolve(true);
                    else reject('session expired')
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async getHome(accessToken: string): Promise<DomainItem[]>{
        return await new Promise<DomainItem[]>((resolve, reject) => {
            this.getUser(accessToken)
            .then((user) => {
                this.getInterests(accessToken)
                .then((uInterests) => {
                    let ids = []
                    uInterests.interests.forEach(element => {
                        ids.push(element.id)
                    })
                    this.userItem.getAvailableFromCategory(user.id, ids)
                    .then((items) => {
                        resolve(items)
                    })
                    .catch((error) => {
                        reject(error)
                    })
                }).catch((error) => {
                    if(error === 'document not found')
                        reject(user.name + ' does not have selected categories')
                    else reject(error);
                })
            })
            .catch((error) => {
                reject(error);
            })
        })
    }

    public async addInterests(object: DomainUserInterests, accessToken: string): Promise<DomainUserInterests> {
        return await new Promise<DomainUserInterests>((resolve, reject) => {
            this.getUser(accessToken)
                .then((res) => {
                    object.userId = res.id;
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

    public async getInterests(accessToken: string): Promise<DomainUserInterests> {
        return await new Promise<DomainUserInterests>((resolve, reject) => {
            this.getUser(accessToken)
                .then((res) => {
                    this.userInterests.get(res.id)
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

    public async getAllInterests(): Promise<DomainInterest[]> {
        return await new Promise<DomainInterest[]>((resolve, reject) => {
            this.interests.getAllInterest()
                .then((res) => {
                    resolve(res)
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

    public async addItem(object: DomainItem, accessToken: string): Promise<DomainItem> {
        return await new Promise<DomainItem>((resolve, reject) => {
            this.getUser(accessToken)
                .then((user) => {
                    //console.log(user)
                    if (user.statusString === 'ongoing'){
                        object.owner = user;
                        this.interests.getInterest(object.category._id)
                            .then((interest) => {
                            object.category.id = interest.id;
                                this.userItem.addItem(object)
                                    .then((item) => {
                                        item.owner = user;
                                        item.owner.password = null;
                                        item.category = interest;
                                        //item.category.created_by = null;
                                        resolve(item);
                                    }).catch((err) => {
                                        reject(err);
                                    })
                            }).catch((err) => {
                                reject(err);
                            });
                    } else {
                        reject('user is blocked for rate');
                    }
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
                    this.userItem.update([], [], [], [])
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

    public async getAvailableUserItems(accessToken: string): Promise<DomainItem[]> {
        return await new Promise<DomainItem[]>((resolve, reject) => {
            this.getUser(accessToken)
            .then((user) => {
                this.userItem.getAvailableUserItems(user.id)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((error) => {
                reject(error)
            })
        });
    }

    public async getSwappedUserItems(accessToken: string): Promise<DomainItem[]> {
        return await new Promise<DomainItem[]>((resolve, reject) => {
            this.getUser(accessToken)
            .then((user) => {
                this.userItem.getSwappedUserItems(user.id)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((error) => {
                reject(error)
            })
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

    public async ask(object: DomainSwapRequest, accessToken: string): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            this.getUser(accessToken)
            .then((senderUser) => {
                this.userItem.getOneItem(object.senderItem._id)
                .then((senderItem) => {
                    if(senderUser._id === senderItem.owner._id){
                        this.userItem.getOneItem(object.receiverItem._id)
                        .then((receiverItem) => {
                            if(senderUser.typeString === 'individual' 
                                && receiverItem.owner.typeString === 'business'){
                                    reject('permission denied, can\'t send request due to system policy')
                            } else {
                                senderItem.owner = senderUser;
                                object.senderItem = senderItem
                                object.receiverItem = receiverItem
                                this.swapRequest.ask(object)
                                .then((respond) => {
                                    resolve(respond)
                                }).catch((err) => {
                                    reject(err)
                                });
                            }
                        }).catch((err) => {
                            if(err === 'document not found')
                                reject('invalid receiverItem');
                            else 
                                reject(err)
                        })
                    } else {
                        reject(senderUser.name + ' does not own this item ' + senderItem.name)
                    }
                }).catch((err) => {
                    if(err === 'document not found')
                        reject('invalid senderItem');
                    else 
                        reject(err)
                })
            }).catch((err) => {
                if(err === 'document not found')
                    reject('invalid access token');
                else 
                    reject(err)
            })
        });
    }

    public async accept(accessToken: string, swapId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.getUser(accessToken)
            .then((user) => {
                this.swapRequest.accept(swapId, user._id)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err)
                })
            }).catch((err) => {
                reject(err)
            })
        });
    }

    public async reject(accessToken: string, swapId: string, reason: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.getUser(accessToken)
            .then((user) => {
                this.swapRequest.reject(swapId, user._id, null)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err)
                })
            }).catch((err) => {
                reject(err)
            })
        });
    }

    public async isFromIndividualToBusiness(senderId: string, receiverId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.findOne([], ['_id'], [senderId], 0)
                .then((res) => {
                    if (res.typeString === 'individual') {
                        super.findOne([], ['_id'], [receiverId], 0)
                            .then((res) => {
                                if (res.typeString === 'business'){
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

    public async getSwapRequestsForUser(accessToken: string, type: SwapRequestTypes): Promise<DomainSwapRequest[]>{
        return await new Promise<DomainSwapRequest[]>((resolve, reject) => {
            this.getUser(accessToken)
            .then((user) => {
                let t = ''
                switch (type) {
                    case SwapRequestTypes.RUNNING:
                        t = 'running'
                        break
                    case SwapRequestTypes.ACCEPTED:
                        t = 'accepted'
                        break
                    case SwapRequestTypes.REJECTED:
                        t = 'rejected'
                        break
                    default:
                        t = 'running'
                }
                this.swapRequest.getSwapRequestsForUser(user.id, t)
                .then((result) => {
                    resolve(result)
                }).catch((error) => {
                    reject(error)
                })
            }).catch((error) => {
                reject(error)
            })
        })
    }

    public async getOneSwap(accessToken: string, swapId: string): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            this.getUser(accessToken)
            .then((user) => {
                this.swapRequest.getSwapRequest(swapId)
                .then((swap) => {
                    resolve(swap)
                }).catch((error) => {
                    reject(error)
                })
            }).catch((err) => {
                console.log(err);
            });
        })
    }

    public on24HoursIntervalDone(senderUserId: string, receiverUserId: string, blockSender: boolean, blockReceiver: boolean) {
        if (blockSender){
            this.getUser(senderUserId)
                .then((res) => {
                    res.status = 'blocked for rate';
                    super.update([], [], [], []);
                }).catch((err) => {
                    console.log(err);
                });
        }
        if (blockReceiver) {
            this.getUser(senderUserId)
                .then((res) => {
                    res.status = 'blocked for rate';
                    this.update([], [], [], []);
                }).catch((err) => {
                    console.log(err);
                });
        }
    }
}