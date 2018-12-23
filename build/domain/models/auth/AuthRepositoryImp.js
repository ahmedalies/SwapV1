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
const UserDataMapper_1 = require("../../../infrastructure/data_mapper/UserDataMapper");
const UserSchema_1 = require("../../../infrastructure/entities/mongo/schemas/UserSchema");
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
const crypto = require("crypto");
let AuthRepositoryImp = class AuthRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model) {
        super(repository, dataMapper, ['users', 'userstatus', 'usertype']);
        this.repository = repository;
        this.dataMapper = dataMapper;
        this.model = model;
    }
    login(email, password) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.generateApiKey(email)
                    .then((apiKey) => {
                    _super("findOne").call(this, ['users.*', 'userstatus.status as statusString',
                        'usertype.type as typeString'], ['email', 'users.status', 'users.userType'], [email, 'userstatus.id', 'usertype.id'], 1)
                        .then((user) => {
                        if (user.password === password) {
                            _super("update").call(this, ['accessToken', 'validAccessTokenTill'], [apiKey, (Date.now() + 2592000000).toString()], ['_id'], [user._id])
                                .then((res) => {
                                user.accessToken = res.accessToken;
                                resolve(user);
                            }).catch((err) => {
                                console.log(err);
                                reject(err);
                            });
                        }
                        else {
                            reject('invalid password');
                        }
                    }).catch((err) => {
                        if (err === 'document not found')
                            reject('invalid credentials');
                        else
                            reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    register(userData) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.generateApiKey(userData.email)
                    .then((apiKey) => {
                    userData._id = crypto.createHash('sha1').update(userData.email).digest('hex');
                    userData.accessToken = apiKey;
                    _super("insert").call(this, ['_id', 'email', 'password', 'username',
                        'phone', 'avatar', 'gender', 'points', 'isLoggedIn', 'online', 'accessToken',
                        'validAccessTokenTill', 'lang'], [userData._id, userData.email, userData.password, userData.name, userData.phone,
                        '', userData.gender, '0', '1', '1', userData.accessToken,
                        (Date.now() + 2592000000).toString(), userData.lang])
                        .then((res) => {
                        this.login(res.email, res.password)
                            .then((user) => {
                            resolve(user);
                        }).catch((err) => {
                            reject(err);
                        });
                    }).catch((err) => {
                        if (err.startsWith('Duplicate entry'))
                            reject('email already exist');
                        else
                            reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    generateApiKey(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                resolve(crypto.createHash('sha1').update(email + Date.now()).digest('hex'));
            });
        });
    }
};
AuthRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForUserEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForUser)),
    __param(2, inversify_1.inject(types_1.TYPES.UserSchema)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        UserDataMapper_1.UserDataMapper,
        UserSchema_1.UserSchema])
], AuthRepositoryImp);
exports.AuthRepositoryImp = AuthRepositoryImp;
//# sourceMappingURL=AuthRepositoryImp.js.map