import {inject, injectable} from "inversify";
import {RepositoryImp} from "../base/RepositoryImp";
import {DomainSwapRequest} from "../../entities/DomainSwapRequest";
import {DALSwapRequest} from "../../../infrastructure/entities/dal/DALSwapRequest";
import {SwapRequestRepository} from "./SwapRequestRepository";
import {TYPES} from "../../../infrastructure/types";
import {TYPES as DOMAIN_TYPES} from "../../types";
import {MongoORMRepository} from "../../../infrastructure/implementation/MongoORMRepository";
import {SwapRequestMapper} from "../../../infrastructure/data_mapper/SwapRequestMapper";
import {SwapRequestSchema} from "../../../infrastructure/entities/mongo/schemas/SwapRequestSchema";
import {UserItemRepository} from "../user_item/UserItemRepository";
import {UserItemRepositoryImp} from "../user_item/UserItemRepositoryImp";
import {SwapRequestCallback} from "./SwapRequestCallback";

@injectable()
export class SwapRequestRepositoryImp extends RepositoryImp<DomainSwapRequest, DALSwapRequest> implements SwapRequestRepository {

    static sevenDaysIntervalsIdentifiers: string[];
    static sevenDaysIntervals: string[];
    static oneDayIntervalsIdentifiers: string[];
    static oneDayIntervals: string[];
    repository: MongoORMRepository<DALSwapRequest>;
    model: SwapRequestSchema;
    userItem: UserItemRepository;
    swapRequestCallback: SwapRequestCallback;

    constructor(
        @inject(TYPES.ORMRepositoryForSwapRequestEntity) repository: MongoORMRepository<DALSwapRequest>,
        @inject(TYPES.EntityDataMapperForSwapRequest) dataMapper: SwapRequestMapper,
        @inject(TYPES.SwapRequestSchema) model: SwapRequestSchema,
        @inject(DOMAIN_TYPES.UserItemRepository) userItem: UserItemRepositoryImp,
    ){
        super(repository, dataMapper, model);
        this.repository = repository;
        this.model = model;
        this.userItem = userItem;

        if (!SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers) {
            SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers = [];
            SwapRequestRepositoryImp.sevenDaysIntervals = [];
            SwapRequestRepositoryImp.oneDayIntervalsIdentifiers = [];
            SwapRequestRepositoryImp.oneDayIntervals = [];
        }
    }

    public async ask(object: DomainSwapRequest): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            this.isRequestAlreadyThere(object.senderItem._id, object.receiverItem._id)
                .then((res) => {
                    if (res) {
                        resolve(res);
                    } else {
                        this.userItem.getOneItem(object.senderItem._id)
                            .then((senderItem) => {
                                if (object.senderItem.owner._id == senderItem.owner._id){
                                    object.senderItem._id = senderItem._id;
                                    this.userItem.getOneItem(object.receiverItem._id)
                                        .then((receiverItem) => {
                                            if (receiverItem.owner._id == senderItem.owner._id){
                                                reject('the same user is owner of this two items')
                                            } else {
                                                object.createdAt = Date.now();
                                                object.receiverItem._id = receiverItem._id;
                                                object.milliSecondAfter24Hours = 86400000;
                                                super.insert(object)
                                                    .then((respond) => {
                                                        this.register7Days(object.receiverItem._id);
                                                        respond.senderItem = senderItem;
                                                        respond.receiverItem = receiverItem;
                                                        resolve(respond);
                                                    }).catch((err) => {
                                                    reject(err);
                                                });
                                            }
                                        }).catch((err) => {
                                        reject('receiver item not found');
                                    });
                                } else {
                                    reject('sender item belongs to another user')
                                }
                            }).catch((err) => {
                                reject('sender item not found');
                            });
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async getSwapRequest(swapId: string): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            super.findByOneKey({_id: swapId})
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err)
                });
        });
    }

    public async accept(swapId: string, receiverUserId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.getSwapRequest(swapId)
                .then((request) => {
                    if (request.receiverItem.owner._id == receiverUserId){
                        if (request.status === 'ongoing') {
                            this.cancelAllSent(request.senderItem._id)
                                .then((res) => {
                                    this.cancelAllReceived(request.senderItem._id)
                                        .then((res) => {
                                            this.cancelAllSent(request.receiverItem._id)
                                                .then((res) => {
                                                    this.cancelAllReceived(request.receiverItem._id)
                                                        .then((res) => {
                                                            this.userItem.getOneItem(request.senderItem._id)
                                                                .then((senderItem) => {
                                                                    if (senderItem.status === 'available') {
                                                                        senderItem.status = 'processing';
                                                                        this.userItem.update(request.senderItem._id, senderItem)
                                                                            .then((res) => {
                                                                                this.userItem.getOneItem(request.receiverItem._id)
                                                                                    .then((receiverItem) => {
                                                                                        if (receiverItem.status === 'available'){
                                                                                            receiverItem.status = 'processing';
                                                                                            this.userItem.update(request.receiverItem._id, receiverItem)
                                                                                                .then((res) => {
                                                                                                    request.status = 'accepted';
                                                                                                    this.update(request._id, request)
                                                                                                        .then((res) => {
                                                                                                            senderItem.status = 'in-swapping';
                                                                                                            this.userItem.update(senderItem._id, senderItem)
                                                                                                                .then((res) => {
                                                                                                                    receiverItem.status = 'in-swapping';
                                                                                                                    this.userItem.update(receiverItem._id, receiverItem)
                                                                                                                        .then((res) => {
                                                                                                                            this.register24Hours(request._id);
                                                                                                                            this.unRegister7Days(request.senderItem._id);
                                                                                                                            this.unRegister7Days(request.receiverItem._id);
                                                                                                                            resolve(true);
                                                                                                                        }).catch((err) => {
                                                                                                                            reject(err);
                                                                                                                        });
                                                                                                                }).catch((err) => {
                                                                                                                    reject(err);
                                                                                                                });
                                                                                                        }).catch((err) => {
                                                                                                            senderItem.status = 'available';
                                                                                                            this.userItem.update(request.senderItem._id, senderItem);
                                                                                                            reject(err);
                                                                                                        });
                                                                                                }).catch((err) => {
                                                                                                    senderItem.status = 'available';
                                                                                                    this.userItem.update(request.senderItem._id, senderItem);
                                                                                                    reject(err);
                                                                                                });
                                                                                        } else {
                                                                                            senderItem.status = 'available';
                                                                                            this.userItem.update(request.senderItem._id, senderItem);
                                                                                            reject('receiver item is currently unavailable');
                                                                                        }
                                                                                    }).catch((err) => {
                                                                                    this.userItem.update(request.senderItem._id, senderItem);
                                                                                    senderItem.status = 'available';
                                                                                        reject(err);
                                                                                    });
                                                                            }).catch((err) => {
                                                                                reject(err);
                                                                            });
                                                                    } else {
                                                                        reject('sender item is currently unavailable');
                                                                    }
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
                        } else {
                            reject('request is not available right now');
                        }
                    } else {
                        reject('this user is not owner of this item');
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async reject(swapId: string, receiverUserId: string, reason: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.getSwapRequest(swapId)
                .then((res) => {
                    if (res.receiverItem.owner._id == receiverUserId){
                        res.status = 'rejected';
                        this.update(res._id, res)
                            .then((res) => {
                                resolve(true);
                            }).catch((err) => {
                                reject(err);
                            });
                    } else {
                        reject('this user is not owner of this item')
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async cancelAllSent(itemId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.findAllByOnKey({sender_item: itemId})
                .then((res) => {
                    res.forEach((x) => {
                        x.status = 'canceled-by-system';
                        super.update(x._id, x);
                    });
                    resolve(true);
                }).catch((err) => {
                    if (err === 'document not found') resolve(true);
                    else reject(err);
                });
        });
    }

    public async cancelAllReceived(itemId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.findAllByOnKey({receiver_item: itemId})
                .then((res) => {
                    res.forEach((x) => {
                        x.status = 'canceled-by-system';
                        super.update(x._id, x);
                    });
                    resolve(true);
                }).catch((err) => {
                if (err === 'document not found') resolve(true);
                else reject(err);
            });
        });
    }

    public register7Days(itemId: string){
        this.isFirst(itemId)
            .then((res) => {
                if (res) {
                    SwapRequestRepositoryImp.sevenDaysIntervals.push(itemId);
                    this.userItem.getOneItem(itemId)
                        .then((res) => {
                            res.oneWeekMilli = 604800000;
                            this.userItem.update(res._id, res);
                            SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers[itemId] = setInterval(() => {
                                this.userItem.getOneItem(itemId)
                                    .then((res) => {
                                        if (res.oneWeekMilli - 1000 > 1000){
                                            res.oneWeekMilli = res.oneWeekMilli - 1000;
                                        } else {
                                            res.oneWeekMilli = 0;
                                            res.status = 'blocked for 1 week policy';
                                            this.unRegister7Days(itemId);
                                        }
                                        this.userItem.update(res._id, res);
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                            }, 1000);
                        }).catch((err) => {
                            console.log(err);
                        });
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    public unRegister7Days(itemId: string) {
        if (SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers[itemId]) {
            clearInterval(SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers[itemId]);
            delete SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers[itemId];
            SwapRequestRepositoryImp.sevenDaysIntervals.slice(
                SwapRequestRepositoryImp.sevenDaysIntervals.indexOf(itemId), 1
            )
        }
    }

    public register24Hours(requestId: string){
        SwapRequestRepositoryImp.oneDayIntervals.push(requestId);
        SwapRequestRepositoryImp.oneDayIntervalsIdentifiers[requestId] = setInterval(() => {
            this.getSwapRequest(requestId)
                .then((res) => {
                    if (res.milliSecondAfter24Hours - 1000 > 1000){
                        res.milliSecondAfter24Hours = res.milliSecondAfter24Hours - 1000;
                    } else {
                        res.milliSecondAfter24Hours = 0;
                        let blockSender: boolean = false, blockReceiver: boolean = false;
                        if (!res.senderRate) blockSender = true;
                        if (!res.receiverRate) blockReceiver = true;
                        this.swapRequestCallback.on24HoursIntervalDone(res.senderItem.owner._id, res.receiverItem.owner._id, blockSender, blockReceiver);
                        clearInterval(SwapRequestRepositoryImp.oneDayIntervalsIdentifiers[requestId]);
                        delete SwapRequestRepositoryImp.oneDayIntervalsIdentifiers[requestId];
                        SwapRequestRepositoryImp.oneDayIntervals.slice(
                            SwapRequestRepositoryImp.oneDayIntervals.indexOf(requestId), 1
                        )
                    }
                    this.update(requestId, res);
                }).catch((err) => {
                    console.log('register24Hours: ' + err);
                })
        }, 1000);
    }

    public async isFirst(itemId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            if (SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers[itemId]){
                resolve(false);
                console.log('not found by first check ');
            } else {
                super.findByOneKey({receiver_item: itemId})
                    .then((res) => {
                        if (res) {
                            this.userItem.getOneItem(itemId)
                                .then((res) => {
                                    if (res.status === "available"){
                                        resolve(true);
                                        console.log('not found by second check');
                                    } else {
                                        resolve(false);
                                    }
                                }).catch((err) => {
                                    reject(err);
                                });
                        }
                    }).catch((err) => {
                        if (err === "document not found") {resolve(true)}
                        else {reject(err);}
                    });
            }
        });
    }

    public async rollBackRequest(requestId: string): Promise<boolean>{
        return await new Promise<boolean>((resolve, reject) => {
            super.remove(requestId)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async isRequestAlreadyThere(senderItem: string, receiverItem: string): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
           this.isRequestAlreadyThereFromReceiverToSender(senderItem, receiverItem)
               .then((res) => {
                    resolve(res);
               }).catch((err) => {
                    if (err === "document not found") {
                        this.isRequestAlreadyThereFromSenderToReceiver(senderItem, receiverItem)
                            .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                if (err === "document not found"){
                                    resolve(null)
                                } else {
                                    reject(err);
                                }
                            });
                    } else {
                        reject(err);
                    }
               });
        });
    }

    public async isRequestAlreadyThereFromSenderToReceiver(senderItem: string, receiverItem: string): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            super.findByTwoKeys({"sender_item": senderItem, "receiver_item": receiverItem})
                .then((res) => {
                    res.message = 'request already there';
                    this.userItem.getOneItem(senderItem)
                        .then((sender) => {
                            res.senderItem = sender;
                            this.userItem.getOneItem(receiverItem)
                                .then((receiver) => {
                                    res.receiverItem = receiver;
                                    resolve(res)
                                }).catch((err) => {
                                    reject(err);
                                });
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async isRequestAlreadyThereFromReceiverToSender(senderItem: string, receiverItem: string): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            super.findByTwoKeys({"sender_item": receiverItem, "receiver_item": senderItem})
                .then((res) => {
                    res.message = 'request already has sent from the owner of this item to you';
                    this.userItem.getOneItem(senderItem)
                        .then((sender) => {
                            res.senderItem = sender;
                            this.userItem.getOneItem(receiverItem)
                                .then((receiver) => {
                                    res.receiverItem = receiver;
                                    resolve(res)
                                }).catch((err) => {
                                reject(err);
                            });
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err)
                });
        });
    }
}