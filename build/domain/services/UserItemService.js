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
const inversify_1 = require("inversify");
const types_1 = require("../types");
const DomainItem_1 = require("../entities/DomainItem");
const DomainInterest_1 = require("../entities/DomainInterest");
let UserItemService = class UserItemService {
    constructor(repository) {
        this.repository = repository;
    }
    addItem(body, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = new DomainItem_1.DomainItem();
            if (body.name) {
                item.name = body.name;
            }
            else {
                return Promise.reject('user_item name field does\'t exist');
            }
            if (body.description) {
                item.description = body.description;
            }
            else {
                return Promise.reject('user_item description field does\'t exist');
            }
            if (body.category) {
                item.category = new DomainInterest_1.DomainInterest();
                item.category._id = body.category;
            }
            else {
                return Promise.reject('user_item category field does\'t exist');
            }
            if (body.iUrls) {
                item.i_urls = body.iUrls;
            }
            else {
                return Promise.reject('user_item iUrls field does\'t exist');
            }
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.addItem(item, headers['accesstoken'])
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            console.log('session expired');
                            reject('session expired');
                        }
                    }).catch((err) => {
                        console.log('invalid');
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    console.log('access denied');
                    return Promise.reject('access denied');
                }
            });
        });
    }
    getAvailableUserItems(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.getAvailableUserItems(headers['accesstoken'])
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            console.log('session expired');
                            reject('session expired');
                        }
                    }).catch((err) => {
                        console.log('invalid');
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    console.log('access denied');
                    return Promise.reject('access denied');
                }
            });
        });
    }
    getSwappedUserItems(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.getSwappedUserItems(headers['accesstoken'])
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            console.log('session expired');
                            reject('session expired');
                        }
                    }).catch((err) => {
                        console.log('invalid');
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    console.log('access denied');
                    return Promise.reject('access denied');
                }
            });
        });
    }
    getHomeUserItems(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.getHome(headers['accesstoken'])
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            console.log('session expired');
                            reject('session expired');
                        }
                    }).catch((err) => {
                        console.log('invalid');
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    console.log('access denied');
                    return Promise.reject('access denied');
                }
            });
        });
    }
};
UserItemService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object])
], UserItemService);
exports.UserItemService = UserItemService;
//# sourceMappingURL=UserItemService.js.map