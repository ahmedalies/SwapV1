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
const DomainUserInterests_1 = require("../entities/DomainUserInterests");
let UserInterestService = class UserInterestService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    addInterest(body, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            let interest = new DomainUserInterests_1.DomainUserInterests();
            // if (body.userId){interest.userId = body.userId}
            // else {return Promise.reject('userId is missing')}
            if (body.interests && body.interests.length) {
                interest.interests = body.interests;
            }
            else {
                return Promise.reject('interests array is missing or empty');
            }
            if (headers['accesstoken']) {
                return yield new Promise((resolve, reject) => {
                    this.userRepo.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.userRepo.addInterests(interest, headers['accesstoken'])
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
                });
            }
            else {
                return Promise.reject('access denied');
            }
        });
    }
    getUserInterests(body, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body.userId) {
                return Promise.reject('userId is missing');
            }
            if (headers['accesstoken']) {
                return yield new Promise((resolve, reject) => {
                    this.userRepo.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.userRepo.getInterests(body.userId)
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
                });
            }
            else {
                return Promise.reject('access denied');
            }
        });
    }
    getAllInterests(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (headers['accesstoken']) {
                return yield new Promise((resolve, reject) => {
                    this.userRepo.isValidAccessToken(headers['accesstoken'])
                        .then((res) => {
                        if (res) {
                            this.userRepo.getAllInterests()
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
                });
            }
            else {
                return Promise.reject('access denied');
            }
        });
    }
};
UserInterestService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object])
], UserInterestService);
exports.UserInterestService = UserInterestService;
//# sourceMappingURL=UserInterestService.js.map