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
const RepositoryImp_1 = require("../base/RepositoryImp");
const DomainItem_1 = require("../../entities/DomainItem");
const inversify_1 = require("inversify");
const ItemSchema_1 = require("../../../infrastructure/entities/mongo/schemas/ItemSchema");
const types_1 = require("../../../infrastructure/types");
const ItemDataMapper_1 = require("../../../infrastructure/data_mapper/ItemDataMapper");
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
const DomainUser_1 = require("../../entities/DomainUser");
const DomainSwapRequest_1 = require("../../entities/DomainSwapRequest");
const DomainInterest_1 = require("../../entities/DomainInterest");
let UserItemRepositoryImp = class UserItemRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model) {
        super(repository, dataMapper, ['items', 'itemstatus', 'interests']);
        this.repository = repository;
        this.dataMapper = dataMapper;
        this.model = model;
    }
    addItem(object) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("createSHA1Hash").call(this, object.owner._id + Date.now())
                    .then((res) => {
                    this.repository.insertV1(['_id', 'status', 'owner', 'name', 'description', 'category'], [res, '1', object.owner.id.toString(), object.name, object.description, object.category.id.toString()], ['items'])
                        .then((res) => {
                        if (object.i_urls && object.i_urls.length > 0) {
                            let sql = 'insert into itemimages (item, url) values ';
                            let count = 0;
                            let values = "";
                            object.i_urls.forEach((x) => {
                                count++;
                                if (count === object.i_urls.length) {
                                    values = "(" + res.id + ", '" + x + "')";
                                }
                                else {
                                    values = "(" + res.id + ", '" + x + "'),";
                                }
                                sql = sql + values;
                            });
                            this.repository.perform(sql)
                                .then((result) => {
                                resolve(result);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            resolve(this._dataMapper.toDomain(res));
                        }
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    updateItem(itemId, object) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("update").call(this, ['status', 'oneWeekMilli', 'owner', 'name', 'description', 'category'], [object.status, object.oneWeekMilli.toString(), object.owner._id, object.name, object.description, object.category._id], ['_id'], [itemId])
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getOneItem(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.repository.findOne(['items.*', 'itemstatus.state', 'users._id as ownerId', 'users.userType',
                    'usertype.type as ownerType'], ['items._id', 'items.owner', 'users.userType', 'items.status'], [itemId, 'users.id', 'usertype.id', 'itemstatus.id'], 1, ['items', 'users', 'usertype', 'itemstatus'])
                    .then((res) => {
                    //console.log(this.dataMapper.toDomain(res))
                    resolve(this.dataMapper.toDomain(res));
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            });
        });
    }
    getOneItemByIdInt(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.repository.findOne(['items.*', 'itemstatus.state', 'users._id as ownerId', 'users.userType',
                    'usertype.type as ownerType', 'users.username'], ['items.id', 'items.owner', 'users.userType', 'items.status'], [itemId.toString(), 'users.id', 'usertype.id', 'itemstatus.id'], 1, ['items', 'users', 'usertype', 'itemstatus'])
                    .then((res) => {
                    //console.log(this.dataMapper.toDomain(res))
                    resolve(this.dataMapper.toDomain(res));
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            });
        });
    }
    getAvailableFromCategory(userId, interestsIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (interestsIds && interestsIds.length > 0) {
                    let c_sql = "(items.category=" + interestsIds[0];
                    for (let index = 1; index < interestsIds.length; index++) {
                        const element = interestsIds[index];
                        if (index === interestsIds.length - 1) {
                            c_sql = c_sql + " OR items.category=" + interestsIds[index] + " OR items.category="
                                + "(SELECT id FROM interests WHERE name='other')"
                                + ")";
                        }
                        else {
                            c_sql = c_sql + " OR items.category=" + interestsIds[index];
                        }
                    }
                    let sql = "SELECT "
                        + "users.email, users.username, users.avatar, users.gender, users.userType, users.created_at AS user_created_at,"
                        + "usertype.type AS user_type_string,"
                        + "swaprequests._id AS swap_request_id, swaprequests.status AS swap_request_status, swaprequests.sender_item, swaprequests.receiver_item, swaprequests.created_at AS swap_request_created_at,"
                        + "swapstatus.state as swap_request_status_string,"
                        + "interests.name AS interest_name, interests.nameAR AS interest_name_ar ,interests._id AS interest_id,"
                        + "itemimages.url,"
                        + "items.id AS item_int_id, items._id as itemId,items.name AS item_name, items.description AS item_description, items.createdAt AS item_created_at "
                        + "FROM items "
                        + "LEFT JOIN users on users.id=items.owner "
                        + "LEFT JOIN usertype on (users.id=items.owner AND users.userType=usertype.id) "
                        + "LEFT JOIN interests ON interests.id=items.category "
                        + "LEFT JOIN swaprequests on swaprequests.sender_item=items.id "
                        + "LEFT JOIN swapstatus on (swaprequests.sender_item=items.id AND swaprequests.status=swapstatus.id AND swapstatus.state='ongoing') "
                        + "LEFT JOIN itemimages ON itemimages.item=items.id "
                        + "WHERE " + c_sql + " AND items.owner!=" + userId.toString()
                        + " AND items.status=(SELECT id FROM itemstatus WHERE state='available')";
                    //"WHERE (items.category=1 OR items.category=3 OR items.category=5) AND items.owner!=" + userId.toString() + "AND items.status=1"
                    this.repository.perform(sql)
                        .then((result) => {
                        if (result && result.length > 0) {
                            let itemIds = [];
                            let items = [];
                            result.forEach(element => {
                                if (itemIds.indexOf(element.item_int_id) >= 0) {
                                    if (element.url) {
                                        for (let index = 0; index < items.length; index++) {
                                            if (items[index].id === element.item_int_id) {
                                                if (!items[index].i_urls) {
                                                    items[index].i_urls = [];
                                                }
                                                items[index].i_urls.push(element.url);
                                            }
                                        }
                                    }
                                    if (element.swap_request_id) {
                                        for (let index = 0; index < items.length; index++) {
                                            if (items[index].id === element.item_int_id) {
                                                if (!items[index].swapRequests) {
                                                    items[index].swapRequests = [];
                                                }
                                                let swapRequest = new DomainSwapRequest_1.DomainSwapRequest();
                                                swapRequest._id = element.swap_request_id;
                                                swapRequest.status = element.swap_request_status;
                                                swapRequest.senderItem = element.sender_item;
                                                swapRequest.receiverItem = element.receiver_item;
                                                swapRequest.createdAt = element.swap_request_created_at;
                                                swapRequest.swapStatusString = element.swap_request_status_string;
                                                items[index].swapRequests.push(swapRequest);
                                            }
                                        }
                                    }
                                }
                                else {
                                    let user = new DomainUser_1.DomainUser();
                                    user.email = element.email;
                                    user.name = element.username;
                                    user.avatar = element.avatar;
                                    user.gender = element.gender;
                                    user.userType = element.userType;
                                    user.typeString = element.user_type_string;
                                    user.created_at = element.user_created_at;
                                    let category = new DomainInterest_1.DomainInterest();
                                    category._id = element.interest_id;
                                    category.name = element.interest_name;
                                    category.nameAR = element.interest_name_ar;
                                    let item = new DomainItem_1.DomainItem();
                                    item.name = element.item_name;
                                    item.id = element.item_int_id;
                                    item._id = element.itemId;
                                    item.description = element.item_description;
                                    item.createdAt = element.item_created_at;
                                    item.owner = user;
                                    item.category = category;
                                    item.i_urls = [];
                                    item.i_urls.push(element.url);
                                    if (element.swap_request_id) {
                                        item.swapRequests = [];
                                        let swapRequest = new DomainSwapRequest_1.DomainSwapRequest();
                                        swapRequest._id = element.swap_request_id;
                                        swapRequest.status = element.swap_request_status;
                                        swapRequest.senderItem = element.sender_item;
                                        swapRequest.receiverItem = element.receiver_item;
                                        swapRequest.createdAt = element.swap_request_created_at;
                                        swapRequest.swapStatusString = element.swap_request_status_string;
                                    }
                                    itemIds.push(element.item_int_id);
                                    items.push(item);
                                }
                            });
                            resolve(items);
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                }
                else {
                    reject('empty users categories');
                }
            });
        });
    }
    getAvailableUserItems(userId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findMany").call(this, ['items.*', 'itemstatus.state', 'interests.name as interestName',
                    'interests.nameAR as interestNameAR', 'interests._id as interest_id'], ['items.owner', 'itemstatus.state', 'items.category', 'items.status'], [userId.toString(), 'available', 'interests.id', 'itemstatus.id'], 2)
                    .then((items) => {
                    // console.log(items)
                    let counter = 0;
                    items.forEach((i) => {
                        this._repository.perform('select url from itemimages where item=' + i.id.toString())
                            .then((res) => {
                            //console.log(res)
                            items[counter].i_urls = [];
                            res.forEach(element => {
                                items[counter].i_urls.push(element.url);
                            });
                            counter++;
                            if (counter === items.length)
                                resolve(items);
                        }).catch((error) => {
                            console.error(error);
                            counter++;
                            if (counter === items.length)
                                resolve(items);
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            });
        });
    }
    getSwappedUserItems(userId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findMany").call(this, ['items.*', 'itemstatus.state', 'interests.name as interestName',
                    'interests.nameAR as interestNameAR', 'interests._id as interest_id'], ['items.owner', 'itemstatus.state', 'items.category', 'items.status'], [userId.toString(), 'swapped', 'interests.id', 'itemstatus.id'], 2)
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    removeItem(itemId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("remove").call(this, itemId);
        });
    }
};
UserItemRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForUserItemEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForItem)),
    __param(2, inversify_1.inject(types_1.TYPES.ItemSchema)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        ItemDataMapper_1.ItemDataMapper,
        ItemSchema_1.ItemSchema])
], UserItemRepositoryImp);
exports.UserItemRepositoryImp = UserItemRepositoryImp;
//# sourceMappingURL=UserItemRepositoryImp.js.map