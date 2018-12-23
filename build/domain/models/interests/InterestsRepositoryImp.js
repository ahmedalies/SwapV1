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
const types_1 = require("../../../infrastructure/types");
const inversify_1 = require("inversify");
const InterestDataMapper_1 = require("../../../infrastructure/data_mapper/InterestDataMapper");
const InterestSchema_1 = require("../../../infrastructure/entities/mongo/schemas/InterestSchema");
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
let InterestsRepositoryImp = class InterestsRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model) {
        super(repository, dataMapper, ['interests']);
    }
    addInterest(interest) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("createSHA1Hash").call(this, interest.name)
                    .then((res) => {
                    _super("insert").call(this, ['_id', 'name', 'nameAR', 'created_by', 'image_url'], [res, interest.name, interest.nameAR, interest.created_by.id.toString(), interest.image_url])
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
    getInterest(id) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findOne").call(this, [], ['_id'], [id], 0)
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getAllInterest() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findMany").call(this, [], [], [], 0)
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    updateInterest(id, interest) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("update").call(this, ['name', 'i_url'], [interest.name, interest.image_url], ['_id'], [id])
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    deleteInterest(id) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("remove").call(this, id)
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
};
InterestsRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForInterestEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForInterests)),
    __param(2, inversify_1.inject(types_1.TYPES.InterestSchema)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        InterestDataMapper_1.InterestDataMapper,
        InterestSchema_1.InterestSchema])
], InterestsRepositoryImp);
exports.InterestsRepositoryImp = InterestsRepositoryImp;
//# sourceMappingURL=InterestsRepositoryImp.js.map