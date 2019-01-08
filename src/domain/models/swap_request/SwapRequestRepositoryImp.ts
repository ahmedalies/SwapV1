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
import {MysqlORMRepository} from "../../../infrastructure/implementation/MysqlORMRepository";
import {ORMRepository} from "../../../infrastructure/implementation/ORMRepository";
import { DomainItem } from "../../entities/DomainItem";
import { DomainUser } from "../../entities/DomainUser";

@injectable()
export class SwapRequestRepositoryImp extends RepositoryImp<DomainSwapRequest, DALSwapRequest> implements SwapRequestRepository {

    static sevenDaysIntervalsIdentifiers: string[];
    static sevenDaysIntervals: string[];
    static oneDayIntervalsIdentifiers: string[];
    static oneDayIntervals: string[];
    swapRequestCallback: SwapRequestCallback;

    constructor(
        @inject(TYPES.ORMRepositoryForSwapRequestEntity) private repository: ORMRepository<DALSwapRequest>,
        @inject(TYPES.EntityDataMapperForSwapRequest) private dataMapper: SwapRequestMapper,
        @inject(TYPES.SwapRequestSchema) private model: SwapRequestSchema,
        @inject(DOMAIN_TYPES.UserItemRepository) private userItem: UserItemRepositoryImp,
    ){
        super(repository, dataMapper, ['swaprequests']);

        if (!SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers) {
            SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers = [];
            SwapRequestRepositoryImp.sevenDaysIntervals = [];
            SwapRequestRepositoryImp.oneDayIntervalsIdentifiers = [];
            SwapRequestRepositoryImp.oneDayIntervals = [];
        }
    }

    public async getSwapRequestsForUser(userId: string|number, type: string): Promise<DomainSwapRequest[]>{
        let sql = ''
        if(type === 'running') {
            sql = "SELECT swaprequests._id,swaprequests.sender_item,swaprequests.receiver_item,swaprequests.created_at,"
            + " items.id,items.name,items.description,items.owner,items.createdAt,"
            + " itemimages.url,itemimages.item as itemid,"
            + " users.id as userid,users.username,users.avatar"
            + " from items,itemstatus,swaprequests,swapstatus,users,itemimages"
            + " where items.status=itemstatus.id and itemstatus.state='available'"
            + " and swaprequests.status=swapstatus.id and swapstatus.state='ongoing'"
            + " having(items.owner=users.id and"
            + " items.owner=" + userId.toString()
            + " and (swaprequests.sender_item=items.id or swaprequests.receiver_item=items.id)"
            + " and items.id=itemimages.item)"
        } else if(type === 'accepted') {
            sql = "SELECT swaprequests._id,swaprequests.sender_item,swaprequests.receiver_item,swaprequests.created_at,"
            + " swaprequests.receiver_rate,swaprequests.sender_rate,swaprequests.respond_at,"
            + " items.id,items.name,items.description,items.owner,items.createdAt,"
            + " itemimages.url,itemimages.item as itemid,"
            + " users.id as userid,users.username,users.avatar"
            + " from items,itemstatus,swaprequests,swapstatus,users,itemimages"
            + " where items.status=itemstatus.id and (itemstatus.state='in-swapping' or itemstatus.state='swapped')"
            + " and swaprequests.status=swapstatus.id and swapstatus.state='accepted'"
            + " having(items.owner=users.id and"
            + " items.owner=" + userId.toString()
            + " and (swaprequests.sender_item=items.id or swaprequests.receiver_item=items.id)"
            + " and items.id=itemimages.item)"
        } else if(type === 'rejected') {
            sql = "SELECT swaprequests._id,swaprequests.sender_item,swaprequests.receiver_item,swaprequests.created_at,"
            + " swaprequests.receiver_rate,swaprequests.sender_rate,swaprequests.respond_at,"
            + " items.id,items.name,items.description,items.owner,items.createdAt,"
            + " itemimages.url,itemimages.item as itemid,"
            + " users.id as userid,users.username,users.avatar"
            + " from items,itemstatus,swaprequests,swapstatus,users,itemimages"
            + " where items.status=itemstatus.id"
            + " and swaprequests.status=swapstatus.id and swapstatus.state='rejected'"
            + " having(items.owner=users.id and"
            + " items.owner=" + userId.toString()
            + " and (swaprequests.sender_item=items.id or swaprequests.receiver_item=items.id)"
            + " and items.id=itemimages.item)"
        }
        return await new Promise<DomainSwapRequest[]>((resolve, reject) => {
            if(sql){
                this.repository.perform(sql)
                .then((result) => {
                    if(result && result.length > 0) {
                        let swapIds = [];
                        let swaps: DomainSwapRequest[] = [];
                        result.forEach(element => {
                            let swap = new DomainSwapRequest();
                            if(swapIds.indexOf(element._id) >= 0){
                                let index = swapIds.indexOf(element._id)
                                if(element.url){
                                    if(swaps[index].iamTheSender){
                                        swaps[index].senderItem.i_urls.push(element.url)
                                    } else {
                                        swaps[index].receiverItem.i_urls.push(element.url)
                                    }
                                }
                            } else {
                                swapIds.push(element._id)
                                swap._id = element._id
                                swap.createdAt = element.created_at
                                let sender = new DomainItem();
                                sender.id = element.sender_item
                                let receiver = new DomainItem()
                                receiver.id = element.receiver_item
                                if(element.sender_rate){
                                    swap.senderItem
                                }
                                if(element.receiver_rate){
                                    swap.receiverRate
                                }
                                if(element.respond_at){
                                    swap.respondAt
                                }
                                if(element.id === element.sender_item){
                                    swap.iamTheSender = true
                                    sender.name = element.name
                                    sender.description = element.description
                                    sender.owner = new DomainUser()
                                    sender.owner.name = element.username
                                    sender.owner.avatar = element.avatar
                                    sender.createdAt = element.createdAt
                                    if(element.url){
                                        sender.i_urls = []
                                        sender.i_urls.push(element.url)
                                    }
                                } else if(element.id === element.receiver_item){
                                    swap.iamTheSender = false
                                    receiver.name = element.name
                                    receiver.description = element.description
                                    receiver.owner = new DomainUser()
                                    receiver.owner.name = element.username
                                    receiver.owner.avatar = element.avatar
                                    receiver.createdAt = element.createdAt
                                    if(element.url){
                                        receiver.i_urls = []
                                        receiver.i_urls.push(element.url)
                                    }                                    
                                }
                                swap.senderItem = sender
                                swap.receiverItem = receiver
                                swaps.push(swap)
                            }
                        });
                        resolve(swaps)
                    } else {
                        reject('no swaps available')
                    }
                }).catch((error) => [
                    reject(error)
                ])
            } else {
                reject('invalid swap request type')
            }
        })
    }

    public async ask(object: DomainSwapRequest): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            this.isRequestAlreadyThere(object.senderItem.id, object.receiverItem.id)
                .then((res) => {
                    if (res) {
                        //console.log(res)
                        resolve(res);
                    } else {
                        console.log('there is no perior request')
                        if (object.receiverItem.owner._id === object.senderItem.owner._id){
                            reject('the same user is owner of this two items')
                        } else {
                            super.createSHA1Hash(object.senderItem._id + Date.now())
                                .then((res) => {
                                    super.insert(['_id', 'status', 'sender_item', 'receiver_item'],
                                        [res, '1', object.senderItem.id.toString(),
                                         object.receiverItem.id.toString()])
                                        .then((respond) => {
                                            this.register7Days(object.receiverItem);
                                            respond.senderItem = object.senderItem;
                                            respond.receiverItem = object.receiverItem;
                                            resolve(respond);
                                        }).catch((err) => {
                                            reject(err);
                                        });
                                }).catch((err) => {
                                    reject(err);
                                });
                        }
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async getSwapRequest(swapId: string): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            this.repository.findOne(['swaprequests.*', 'swapstatus.state as swapStatusString'],
             ['swaprequests._id', 'swaprequests.status'], 
             [swapId, 'swapstatus.id'], 1,
             ['swaprequests', 'swapstatus'])
                .then((res) => {
                    this.userItem.getOneItemByIdInt(res.sender_item)
                    .then((senderItem) => {
                        this.userItem.getOneItemByIdInt(res.receiver_item)
                        .then((receiverItem) => {
                            let request = this.dataMapper.toDomain(res);
                            this._repository.perform('select url from itemimages where item=' + receiverItem.id.toString())
                            .then((res) => {
                                receiverItem.i_urls = []
                                res.forEach(element => {
                                    receiverItem.i_urls.push(element.url)    
                                });
                                this._repository.perform('select url from itemimages where item=' + senderItem.id.toString())
                                .then((res) => {
                                    senderItem.i_urls = []
                                    res.forEach(element => {
                                        senderItem.i_urls.push(element.url)    
                                    });
                                    request.senderItem = senderItem;
                                    request.receiverItem = receiverItem;
                                    resolve(request);
                                }).catch((error) => {
                                    reject(error)
                                })
                            }).catch((error) => {
                                reject(error)
                            })
                        }).catch((err) => {
                            reject(err)
                        })
                    }).catch((err) => {
                        reject(err)
                    })
                }).catch((err) => {
                    reject(err)
                });
        });
    }

    public async accept(swapId: string, receiverUserId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.getSwapRequest(swapId)
                .then((request) => {
                    if (receiverUserId === request.receiverItem.owner._id) {
                        if (request.receiverItem.statusString === 'available'
                            && request.senderItem.statusString === 'available'
                            && request.swapStatusString === 'ongoing'){
                                this.cancelAll(request.senderItem.id, request._id)
                                .then((res) => {
                                    this.cancelAll(request.receiverItem.id, request._id)
                                    .then((res) => {
                                        let q = "update swaprequests set status="
                                        + "(select id from swapstatus where state = 'accepted')"+
                                        "where _id=" + "'" + request._id + "'";
                                        this.repository.perform(q)
                                        .then((res) => {
                                            if (res.serverStatus === 34){
                                                let q = "update items set status="
                                                + "(select id from itemstatus where state = 'in-swapping')"
                                                + "where _id=" + "'" + request.senderItem._id + "'" 
                                                + " or _id=" + "'" + request.receiverItem._id + "'";
                                                this.repository.perform(q)
                                                .then((res) => {
                                                    this.register24Hours(request._id);
                                                    this.unRegister7Days(request.senderItem._id);
                                                    this.unRegister7Days(request.receiverItem._id);
                                                    resolve(true)
                                                }).catch((err) => {
                                                    reject(err)
                                                })
                                            } else {
                                                reject('error performing query')
                                            }
                                        }).catch((err) => {
                                            reject(err)
                                        })
                                    }).catch((err) => {
                                        reject(err);
                                    });
                                }).catch((err) => {
                                    resolve(err)
                                })
                            } else {
                                reject('one of the items is not avaiable for swapping or request already closed')        
                            }
                    } else {
                        reject('receiver user does not owe this item')
                    }                 
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async reject(swapId: string, receiverUserId: string, reason: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.getSwapRequest(swapId)
                .then((request) => {
                    if (request.receiverItem.owner._id === receiverUserId){
                        if (request.receiverItem.statusString === 'available'
                            && request.senderItem.statusString === 'available'
                            && request.swapStatusString === 'ongoing'){
                                let q = "update swaprequests set status="
                                + "(select id from swapstatus where state = 'rejected')"+
                                "where _id=" + "'" + request._id + "'";
                                this.repository.perform(q)
                                .then((res) => {
                                    resolve(true);
                                }).catch((err) => {
                                    reject(err);
                                }); 
                        } else {
                            reject('this request is closed or items unavailable')
                        }
                    } else {
                        reject('this user is not owner of this item')
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async cancelAll(itemId: number | string, requestId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            let q = "update swaprequests set status="
            + "(select id from swapstatus where state = 'canceled-by-system')"+
            "where (sender_item=" + itemId + " or receiver_item=" + itemId
            + ") and _id!=" + "'" + requestId + "'";
            this.repository.perform(q)
                .then((res) => {
                   if (res.serverStatus === 34){
                       resolve(true)
                   } else {
                       reject('error performing query')
                   }
                }).catch((err) => {
                    if (err === 'document not found') resolve(true);
                    else reject(err);
                });
        });
    }

    public register7Days(item: DomainItem){
        this.isFirst(item)
            .then((res) => {
                if (res) {
                    SwapRequestRepositoryImp.sevenDaysIntervals.push(item._id);
                    item.oneWeekMilli = 604800000;
                    this.userItem.update(['oneWeekMilli'], ['604800000'], ['_id'], [item._id]);
                    SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers[item._id] = setInterval(() => {
                        this.userItem.findOne([], ['_id'], [item._id], 0)
                        .then((res) => {
                            if (res.oneWeekMilli - 86400000 > 86400000){
                                res.oneWeekMilli = res.oneWeekMilli - 86400000;
                            } else {
                                res.oneWeekMilli = 0;
                                res.status = 'blocked for 1 week policy';
                                this.unRegister7Days(item._id);
                            }
                            this.userItem.update(['oneWeekMilli'], [res.oneWeekMilli.toString()],
                             ['_id'], [res._id]);
                        }).catch((err) => {
                            console.log(err);
                        });
                    }, 86400000);
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
                    if (res.milliSecondAfter24Hours - 10000 > 10000){
                        res.milliSecondAfter24Hours = res.milliSecondAfter24Hours - 10000;
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
                    this.update(['milli24h'], [res.milliSecondAfter24Hours.toString()], ['_id'], [requestId]);
                }).catch((err) => {
                    console.log('register24Hours: ' + err);
                })
        }, 10000);
    }

    public async isFirst(item: DomainItem): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            if (SwapRequestRepositoryImp.sevenDaysIntervalsIdentifiers[item._id]){
                resolve(false);
                console.log('not found by first check ');
            } else {
                if (item.statusString === "available"){
                    resolve(true);
                    console.log('not found by second check');
                } else {
                    resolve(false);
                }
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

    public async isRequestAlreadyThere(senderItem: string | number, receiverItem: string | number): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
           this.isRequestAlreadyThereFromReceiverToSender(senderItem.toString(), receiverItem.toString())
               .then((res) => {
                    resolve(res);
               }).catch((err) => {
                    if (err === "document not found") {
                        this.isRequestAlreadyThereFromSenderToReceiver(senderItem.toString(), receiverItem.toString())
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

    public async isRequestAlreadyThereFromSenderToReceiver(senderItem: string | number, receiverItem: string | number): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            super.findOne([], ['sender_item', 'receiver_item'], [senderItem.toString(), receiverItem.toString()], 0)
                .then((res) => {
                    res.message = 'request already there';
                    resolve(res)
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async isRequestAlreadyThereFromReceiverToSender(senderItem: string | number, receiverItem: string | number): Promise<DomainSwapRequest> {
        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            super.findOne([], ['sender_item', 'receiver_item'], [receiverItem.toString(), senderItem.toString()], 0)
                .then((res) => {
                    res.message = 'request already has sent from the owner of this item to you';
                    resolve(res)
                }).catch((err) => {
                    reject(err)
                });
        });
    }
}