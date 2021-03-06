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
const DomainSwapRequest_1 = require("../entities/DomainSwapRequest");
const DomainItem_1 = require("../entities/DomainItem");
const SwapRequestTypes_1 = require("../models/swap_request/SwapRequestTypes");
let SwapRequestService = class SwapRequestService {
    constructor(repository) {
        this.repository = repository;
    }
    askForSwap(data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            let senderItem, receiverItem;
            if (data.receiverItem) {
                receiverItem = new DomainItem_1.DomainItem();
                receiverItem._id = data.receiverItem;
            }
            else {
                return Promise.reject('receiverItem field does\'t exist');
            }
            if (data.senderItem) {
                senderItem = new DomainItem_1.DomainItem();
                senderItem._id = data.senderItem;
            }
            else {
                return Promise.reject('senderItem field does\'t exist');
            }
            let swap = new DomainSwapRequest_1.DomainSwapRequest();
            swap.senderItem = senderItem;
            swap.receiverItem = receiverItem;
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.ask(swap, headers['accesstoken'])
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            reject('session expired');
                        }
                    }).catch((err) => {
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    return reject('access denied');
                }
            });
        });
    }
    accept(data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.requestId) { }
            else {
                return Promise.reject('requestId does\'t exist');
            }
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.accept(headers['accesstoken'], data.requestId)
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            reject('session expired');
                        }
                    }).catch((err) => {
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    return reject('access denied');
                }
            });
        });
    }
    rejectSwap(data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.requestId) { }
            else {
                return Promise.reject('requestId does\'t exist');
            }
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.reject(headers['accesstoken'], data.requestId, null)
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            reject('session expired');
                        }
                    }).catch((err) => {
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    return reject('access denied');
                }
            });
        });
    }
    getRunning(data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.getSwapRequestsForUser(headers['accesstoken'], SwapRequestTypes_1.SwapRequestTypes.RUNNING)
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            reject('session expired');
                        }
                    }).catch((err) => {
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    return reject('access denied');
                }
            });
        });
    }
    getAccepted(data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.getSwapRequestsForUser(headers['accesstoken'], SwapRequestTypes_1.SwapRequestTypes.ACCEPTED)
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            reject('session expired');
                        }
                    }).catch((err) => {
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    return reject('access denied');
                }
            });
        });
    }
    getRejected(data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.getSwapRequestsForUser(headers['accesstoken'], SwapRequestTypes_1.SwapRequestTypes.REJECTED)
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            reject('session expired');
                        }
                    }).catch((err) => {
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    return reject('access denied');
                }
            });
        });
    }
    getOneSwap(data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.requestId) { }
            else {
                return Promise.reject('requestId does\'t exist');
            }
            return yield new Promise((resolve, reject) => {
                if (headers && headers['accesstoken']) {
                    this.repository.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.repository.getOneSwap(headers['accesstoken'], data.requestId)
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            reject('session expired');
                        }
                    }).catch((err) => {
                        reject('session expired or invalid access token, try login');
                    });
                }
                else {
                    return reject('access denied');
                }
            });
        });
    }
};
SwapRequestService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object])
], SwapRequestService);
exports.SwapRequestService = SwapRequestService;
//# sourceMappingURL=SwapRequestService.js.map