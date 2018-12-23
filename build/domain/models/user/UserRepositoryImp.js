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
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/types");
const types_2 = require("../../types");
const UserSchema_1 = require("../../../infrastructure/entities/mongo/schemas/UserSchema");
const UserDataMapper_1 = require("../../../infrastructure/data_mapper/UserDataMapper");
const AuthRepositoryImp_1 = require("../auth/AuthRepositoryImp");
const UserInterestsRepositoryImp_1 = require("../user_interests/UserInterestsRepositoryImp");
const UserItemRepositoryImp_1 = require("../user_item/UserItemRepositoryImp");
const InterestsRepositoryImp_1 = require("../interests/InterestsRepositoryImp");
const SwapRequestRepositoryImp_1 = require("../swap_request/SwapRequestRepositoryImp");
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
let UserRepositoryImp = class UserRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model, userInterests, interests, userAuth, userItem, swapRequest) {
        super(repository, dataMapper, ['users']);
        this.repository = repository;
        this.dataMapper = dataMapper;
        this.model = model;
        this.userInterests = userInterests;
        this.interests = interests;
        this.userAuth = userAuth;
        this.userItem = userItem;
        this.swapRequest = swapRequest;
        this.swapRequest.swapRequestCallback = this;
    }
    isUserExist(userId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findOne").call(this, [], ['_id'], [userId], 0)
                    .then((res) => {
                    resolve(res._id);
                }).catch((err) => {
                    reject('user does\'t exist');
                });
            });
        });
    }
    getUser(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.repository.findOne(['users.*', 'userstatus.status as statusString',
                    'usertype.type as typeString'], ['accessToken', 'users.status', 'users.userType'], [accessToken.toString(), 'userstatus.id', 'usertype.id'], 1, ['users', 'userstatus', 'usertype'])
                    .then((res) => {
                    resolve(this.dataMapper.toDomain(res));
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    isUserOngoing(userId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findOne").call(this, [], ['_id'], [userId], 0)
                    .then((res) => {
                    //console.log(res);
                    if (res.status === 'ongoing')
                        resolve(true);
                    else
                        reject('user is blocked for rate');
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    isValidAccessToken(accessToken) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findOne").call(this, [], ['accessToken'], [accessToken], 0)
                    .then((res) => {
                    if (res.isValidToken)
                        resolve(true);
                    else
                        reject('session expired');
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    addInterests(object, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
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
        });
    }
    getInterests(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getUser(accessToken)
                    .then((res) => {
                    this.userInterests.get(res.id)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getAllInterests() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.interests.getAllInterest()
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    removeOneInterests(interestId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.isUserExist(userId)
                    .then((res) => {
                    this.userInterests.removeOne(interestId, res)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    removeAllInterests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.isUserExist(userId)
                    .then((res) => {
                    this.userInterests.removeAll(res)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    addItem(object, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getUser(accessToken)
                    .then((user) => {
                    //console.log(user)
                    if (user.statusString === 'ongoing') {
                        object.owner = user;
                        this.interests.getInterest(object.category._id)
                            .then((res) => {
                            object.category.id = res.id;
                            this.userItem.addItem(object)
                                .then((item) => {
                                item.owner = user;
                                item.owner.password = null;
                                this.interests.getInterest(object.category._id)
                                    .then((res) => {
                                    item.category = res;
                                    //item.category.created_by = null;
                                    resolve(item);
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
                    else {
                        reject('user is blocked for rate');
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    updateItem(itemId, object) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
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
        });
    }
    getOneItem(itemId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.isUserExist(userId)
                    .then((res) => {
                    this.userItem.getOneItem(itemId)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getUserItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
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
        });
    }
    removeItem(itemId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.isUserExist(userId)
                    .then((res) => {
                    this.userItem.removeItem(itemId)
                        .then((res) => {
                        resolve(true);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    ask(object, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getUser(accessToken)
                    .then((senderUser) => {
                    this.userItem.getOneItem(object.senderItem._id)
                        .then((senderItem) => {
                        if (senderUser._id === senderItem.owner._id) {
                            this.userItem.getOneItem(object.receiverItem._id)
                                .then((receiverItem) => {
                                if (senderUser.typeString === 'individual'
                                    && receiverItem.owner.typeString === 'business') {
                                    reject('permission denied, can\'t send request due to system policy');
                                }
                                else {
                                    senderItem.owner = senderUser;
                                    object.senderItem = senderItem;
                                    object.receiverItem = receiverItem;
                                    this.swapRequest.ask(object)
                                        .then((respond) => {
                                        resolve(respond);
                                    }).catch((err) => {
                                        reject(err);
                                    });
                                }
                            }).catch((err) => {
                                if (err === 'document not found')
                                    reject('invalid receiverItem');
                                else
                                    reject(err);
                            });
                        }
                        else {
                            reject(senderUser.name + ' does not own this item ' + senderItem.name);
                        }
                    }).catch((err) => {
                        if (err === 'document not found')
                            reject('invalid senderItem');
                        else
                            reject(err);
                    });
                }).catch((err) => {
                    if (err === 'document not found')
                        reject('invalid access token');
                    else
                        reject(err);
                });
            });
        });
    }
    accept(accessToken, swapId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getUser(accessToken)
                    .then((user) => {
                    this.swapRequest.accept(swapId, user._id)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    reject(accessToken, swapId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getUser(accessToken)
                    .then((user) => {
                    this.swapRequest.reject(swapId, user._id, null)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    isFromIndividualToBusiness(senderId, receiverId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findOne").call(this, [], ['_id'], [senderId], 0)
                    .then((res) => {
                    if (res.typeString === 'individual') {
                        _super("findOne").call(this, [], ['_id'], [receiverId], 0)
                            .then((res) => {
                            if (res.typeString === 'business') {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                    else {
                        resolve(false);
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    on24HoursIntervalDone(senderUserId, receiverUserId, blockSender, blockReceiver) {
        if (blockSender) {
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
};
UserRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForUserEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForUser)),
    __param(2, inversify_1.inject(types_1.TYPES.UserSchema)),
    __param(3, inversify_1.inject(types_2.TYPES.UserInterestsRepository)),
    __param(4, inversify_1.inject(types_2.TYPES.InterestsRepository)),
    __param(5, inversify_1.inject(types_2.TYPES.AuthRepository)),
    __param(6, inversify_1.inject(types_2.TYPES.UserItemRepository)),
    __param(7, inversify_1.inject(types_2.TYPES.SwapRequestRepository)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        UserDataMapper_1.UserDataMapper,
        UserSchema_1.UserSchema,
        UserInterestsRepositoryImp_1.UserInterestsRepositoryImp,
        InterestsRepositoryImp_1.InterestsRepositoryImp,
        AuthRepositoryImp_1.AuthRepositoryImp,
        UserItemRepositoryImp_1.UserItemRepositoryImp,
        SwapRequestRepositoryImp_1.SwapRequestRepositoryImp])
], UserRepositoryImp);
exports.UserRepositoryImp = UserRepositoryImp;
//# sourceMappingURL=UserRepositoryImp.js.map