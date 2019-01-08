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
const RepositoryImp_1 = require("../base/RepositoryImp");
const types_1 = require("../../../infrastructure/types");
const types_2 = require("../../types");
const UserInterestsSchema_1 = require("../../../infrastructure/entities/mongo/schemas/UserInterestsSchema");
const UserInterestsDataMapper_1 = require("../../../infrastructure/data_mapper/UserInterestsDataMapper");
const InterestsRepositoryImp_1 = require("../interests/InterestsRepositoryImp");
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
let UserInterestsRepositoryImp = class UserInterestsRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model, interests) {
        super(repository, dataMapper, ['userinterests']);
        this.repository = repository;
        this.dataMapper = dataMapper;
        this.model = model;
        this.interests = interests;
    }
    add(object) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                let message = [], result = null, newInterest = [], iCount = 0;
                object.interests.forEach((x) => {
                    this.interests.findOne([], ['_id'], [x._id], 0)
                        .then((res) => {
                        _super("findOne").call(this, [], ['userId', 'interestId'], [object.userId.toString(), res.id.toString()], 0)
                            .then((e) => {
                            iCount++;
                            if (e) {
                                message.push('this user already subscribe for ' + res.name);
                                if (iCount === object.interests.length) {
                                    if (newInterest.length) {
                                        let sql = 'insert into userinterests (userId, interestId) values ';
                                        let count = 0;
                                        let values = '';
                                        newInterest.forEach((x) => {
                                            count++;
                                            if (count === newInterest.length) {
                                                values = '(' + object.userId + ', ' + x.id + ')';
                                            }
                                            else {
                                                values = '(' + object.userId + ', ' + x.id + '),';
                                            }
                                            sql = sql + values;
                                        });
                                        this.repository.perform(sql)
                                            .then((result) => {
                                            object.interests = newInterest;
                                            resolve(object);
                                        }).catch((err) => {
                                            reject(err);
                                        });
                                    }
                                    else {
                                        reject(message);
                                    }
                                }
                            }
                        }).catch((err) => {
                            iCount++;
                            if (err === 'document not found') {
                                newInterest.push(res);
                                if (iCount === object.interests.length) {
                                    if (newInterest.length) {
                                        let sql = 'insert into userinterests (userId, interestId) values ';
                                        let count = 0;
                                        let values = '';
                                        newInterest.forEach((x) => {
                                            count++;
                                            if (count === newInterest.length) {
                                                values = '(' + object.userId + ', ' + x.id + ')';
                                            }
                                            else {
                                                values = '(' + object.userId + ', ' + x.id + '),';
                                            }
                                            sql = sql + values;
                                        });
                                        this.repository.perform(sql)
                                            .then((result) => {
                                            object.interests = newInterest;
                                            resolve(object);
                                        }).catch((err) => {
                                            reject(err);
                                        });
                                    }
                                }
                            }
                            else {
                                message.push(err);
                            }
                        });
                    }).catch((err) => {
                        message.push('insufficient interestId');
                    });
                });
            });
        });
    }
    get(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.repository.findOne(['userinterests.*', 'interests.nameAR', 'interests.name', 'interests.image_url',
                    'interests.id as iId', 'interests._id as i_id'], ['userinterests.userId', 'userinterests.interestId'], [userId.toString(), 'interests.id'], 1, ['userinterests', 'interests'])
                    .then((res) => {
                    resolve(this.dataMapper.toDomain(res));
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    removeOne(interestId, userId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findByOneKey").call(this, { userId: userId })
                    .then((res) => {
                    res.interests.splice(res.interests.findIndex(x => x.interests === interestId), 1);
                    _super("update").call(this, [], [], [], [])
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
    removeAll(userId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("remove").call(this, userId);
        });
    }
};
UserInterestsRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForUserInterestsEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForUserInterests)),
    __param(2, inversify_1.inject(types_1.TYPES.UserInterestSchema)),
    __param(3, inversify_1.inject(types_2.TYPES.InterestsRepository)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        UserInterestsDataMapper_1.UserInterestsDataMapper,
        UserInterestsSchema_1.UserInterestSchema,
        InterestsRepositoryImp_1.InterestsRepositoryImp])
], UserInterestsRepositoryImp);
exports.UserInterestsRepositoryImp = UserInterestsRepositoryImp;
//# sourceMappingURL=UserInterestsRepositoryImp.js.map