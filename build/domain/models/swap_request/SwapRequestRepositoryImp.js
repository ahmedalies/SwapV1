"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var SwapRequestRepositoryImp_1;
const inversify_1 = require("inversify");
const RepositoryImp_1 = require("../base/RepositoryImp");
const types_1 = require("../../../infrastructure/types");
const types_2 = require("../../types");
const SwapRequestMapper_1 = require("../../../infrastructure/data_mapper/SwapRequestMapper");
const SwapRequestSchema_1 = require("../../../infrastructure/entities/mongo/schemas/SwapRequestSchema");
const UserItemRepositoryImp_1 = require("../user_item/UserItemRepositoryImp");
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
let SwapRequestRepositoryImp = SwapRequestRepositoryImp_1 = class SwapRequestRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model, userItem) {
        super(repository, dataMapper, ['swaprequests']);
        this.repository = repository;
        this.dataMapper = dataMapper;
        this.model = model;
        this.userItem = userItem;
        if (!SwapRequestRepositoryImp_1.sevenDaysIntervalsIdentifiers) {
            SwapRequestRepositoryImp_1.sevenDaysIntervalsIdentifiers = [];
            SwapRequestRepositoryImp_1.sevenDaysIntervals = [];
            SwapRequestRepositoryImp_1.oneDayIntervalsIdentifiers = [];
            SwapRequestRepositoryImp_1.oneDayIntervals = [];
        }
    }
    ask(object) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.isRequestAlreadyThere(object.senderItem.id, object.receiverItem.id)
                    .then((res) => {
                    if (res) {
                        console.log('there is a perior request');
                        console.log(res);
                        resolve(res);
                    }
                    else {
                        console.log('there is no perior request');
                        if (object.receiverItem.owner._id === object.senderItem.owner._id) {
                            reject('the same user is owner of this two items');
                        }
                        else {
                            _super("createSHA1Hash").call(this, object.senderItem._id + Date.now())
                                .then((res) => {
                                _super("insert").call(this, ['_id', 'status', 'sender_item', 'receiver_item'], [res, '1', object.senderItem.id.toString(),
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
        });
    }
    getSwapRequest(swapId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.repository.findOne(['swaprequests.*', 'swapstatus.state as swapStatusString'], ['swaprequests._id', 'swaprequests.status'], [swapId, 'swapstatus.id'], 1, ['swaprequests', 'swapstatus'])
                    .then((res) => {
                    this.userItem.getOneItemByIdInt(res.sender_item)
                        .then((senderItem) => {
                        this.userItem.getOneItemByIdInt(res.receiver_item)
                            .then((receiverItem) => {
                            let request = this.dataMapper.toDomain(res);
                            request.senderItem = senderItem;
                            request.receiverItem = receiverItem;
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
            });
        });
    }
    accept(swapId, receiverUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getSwapRequest(swapId)
                    .then((request) => {
                    if (receiverUserId === request.receiverItem.owner._id) {
                        if (request.receiverItem.statusString === 'available'
                            && request.senderItem.statusString === 'available'
                            && request.swapStatusString === 'ongoing') {
                            this.cancelAll(request.senderItem.id, request._id)
                                .then((res) => {
                                this.cancelAll(request.receiverItem.id, request._id)
                                    .then((res) => {
                                    let q = "update swaprequests set status="
                                        + "(select id from swapstatus where state = 'accepted')" +
                                        "where _id=" + "'" + request._id + "'";
                                    this.repository.perform(q)
                                        .then((res) => {
                                        if (res.serverStatus === 34) {
                                            let q = "update items set status="
                                                + "(select id from itemstatus where state = 'in-swapping')"
                                                + "where _id=" + "'" + request.senderItem._id + "'"
                                                + " or _id=" + "'" + request.receiverItem._id + "'";
                                            this.repository.perform(q)
                                                .then((res) => {
                                                this.register24Hours(request._id);
                                                this.unRegister7Days(request.senderItem._id);
                                                this.unRegister7Days(request.receiverItem._id);
                                                resolve(true);
                                            }).catch((err) => {
                                                reject(err);
                                            });
                                        }
                                        else {
                                            reject('error performing query');
                                        }
                                    }).catch((err) => {
                                        reject(err);
                                    });
                                }).catch((err) => {
                                    reject(err);
                                });
                            }).catch((err) => {
                                resolve(err);
                            });
                        }
                        else {
                            reject('one of the items is not avaiable for swapping or request already closed');
                        }
                    }
                    else {
                        reject('receiver user does not owe this item');
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    reject(swapId, receiverUserId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getSwapRequest(swapId)
                    .then((request) => {
                    if (request.receiverItem.owner._id === receiverUserId) {
                        if (request.receiverItem.statusString === 'available'
                            && request.senderItem.statusString === 'available'
                            && request.swapStatusString === 'ongoing') {
                            let q = "update swaprequests set status="
                                + "(select id from swapstatus where state = 'rejected')" +
                                "where _id=" + "'" + request._id + "'";
                            this.repository.perform(q)
                                .then((res) => {
                                resolve(true);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            reject('this request is closed or items unavailable');
                        }
                    }
                    else {
                        reject('this user is not owner of this item');
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    cancelAll(itemId, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                let q = "update swaprequests set status="
                    + "(select id from swapstatus where state = 'canceled-by-system')" +
                    "where (sender_item=" + itemId + " or receiver_item=" + itemId
                    + ") and _id!=" + "'" + requestId + "'";
                this.repository.perform(q)
                    .then((res) => {
                    if (res.serverStatus === 34) {
                        resolve(true);
                    }
                    else {
                        reject('error performing query');
                    }
                }).catch((err) => {
                    if (err === 'document not found')
                        resolve(true);
                    else
                        reject(err);
                });
            });
        });
    }
    register7Days(item) {
        this.isFirst(item)
            .then((res) => {
            if (res) {
                SwapRequestRepositoryImp_1.sevenDaysIntervals.push(item._id);
                item.oneWeekMilli = 604800000;
                this.userItem.update(['oneWeekMilli'], ['604800000'], ['_id'], [item._id]);
                SwapRequestRepositoryImp_1.sevenDaysIntervalsIdentifiers[item._id] = setInterval(() => {
                    this.userItem.findOne([], ['_id'], [item._id], 0)
                        .then((res) => {
                        if (res.oneWeekMilli - 86400000 > 86400000) {
                            res.oneWeekMilli = res.oneWeekMilli - 86400000;
                        }
                        else {
                            res.oneWeekMilli = 0;
                            res.status = 'blocked for 1 week policy';
                            this.unRegister7Days(item._id);
                        }
                        this.userItem.update(['oneWeekMilli'], [res.oneWeekMilli.toString()], ['_id'], [res._id]);
                    }).catch((err) => {
                        console.log(err);
                    });
                }, 86400000);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    unRegister7Days(itemId) {
        if (SwapRequestRepositoryImp_1.sevenDaysIntervalsIdentifiers[itemId]) {
            clearInterval(SwapRequestRepositoryImp_1.sevenDaysIntervalsIdentifiers[itemId]);
            delete SwapRequestRepositoryImp_1.sevenDaysIntervalsIdentifiers[itemId];
            SwapRequestRepositoryImp_1.sevenDaysIntervals.slice(SwapRequestRepositoryImp_1.sevenDaysIntervals.indexOf(itemId), 1);
        }
    }
    register24Hours(requestId) {
        SwapRequestRepositoryImp_1.oneDayIntervals.push(requestId);
        SwapRequestRepositoryImp_1.oneDayIntervalsIdentifiers[requestId] = setInterval(() => {
            this.getSwapRequest(requestId)
                .then((res) => {
                if (res.milliSecondAfter24Hours - 10000 > 10000) {
                    res.milliSecondAfter24Hours = res.milliSecondAfter24Hours - 10000;
                }
                else {
                    res.milliSecondAfter24Hours = 0;
                    let blockSender = false, blockReceiver = false;
                    if (!res.senderRate)
                        blockSender = true;
                    if (!res.receiverRate)
                        blockReceiver = true;
                    this.swapRequestCallback.on24HoursIntervalDone(res.senderItem.owner._id, res.receiverItem.owner._id, blockSender, blockReceiver);
                    clearInterval(SwapRequestRepositoryImp_1.oneDayIntervalsIdentifiers[requestId]);
                    delete SwapRequestRepositoryImp_1.oneDayIntervalsIdentifiers[requestId];
                    SwapRequestRepositoryImp_1.oneDayIntervals.slice(SwapRequestRepositoryImp_1.oneDayIntervals.indexOf(requestId), 1);
                }
                this.update(['milli24h'], [res.milliSecondAfter24Hours.toString()], ['_id'], [requestId]);
            }).catch((err) => {
                console.log('register24Hours: ' + err);
            });
        }, 10000);
    }
    isFirst(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (SwapRequestRepositoryImp_1.sevenDaysIntervalsIdentifiers[item._id]) {
                    resolve(false);
                    console.log('not found by first check ');
                }
                else {
                    if (item.statusString === "available") {
                        resolve(true);
                        console.log('not found by second check');
                    }
                    else {
                        resolve(false);
                    }
                }
            });
        });
    }
    rollBackRequest(requestId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("remove").call(this, requestId)
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    isRequestAlreadyThere(senderItem, receiverItem) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.isRequestAlreadyThereFromReceiverToSender(senderItem.toString(), receiverItem.toString())
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    if (err === "document not found") {
                        this.isRequestAlreadyThereFromSenderToReceiver(senderItem.toString(), receiverItem.toString())
                            .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            if (err === "document not found") {
                                resolve(null);
                            }
                            else {
                                reject(err);
                            }
                        });
                    }
                    else {
                        reject(err);
                    }
                });
            });
        });
    }
    isRequestAlreadyThereFromSenderToReceiver(senderItem, receiverItem) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findOne").call(this, [], ['sender_item', 'receiver_item'], [senderItem.toString(), receiverItem.toString()], 0)
                    .then((res) => {
                    res.message = 'request already there';
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    isRequestAlreadyThereFromReceiverToSender(senderItem, receiverItem) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findOne").call(this, [], ['sender_item', 'receiver_item'], [receiverItem.toString(), senderItem.toString()], 0)
                    .then((res) => {
                    res.message = 'request already has sent from the owner of this item to you';
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
};
SwapRequestRepositoryImp = SwapRequestRepositoryImp_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForSwapRequestEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForSwapRequest)),
    __param(2, inversify_1.inject(types_1.TYPES.SwapRequestSchema)),
    __param(3, inversify_1.inject(types_2.TYPES.UserItemRepository)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        SwapRequestMapper_1.SwapRequestMapper,
        SwapRequestSchema_1.SwapRequestSchema,
        UserItemRepositoryImp_1.UserItemRepositoryImp])
], SwapRequestRepositoryImp);
exports.SwapRequestRepositoryImp = SwapRequestRepositoryImp;
//# sourceMappingURL=SwapRequestRepositoryImp.js.map