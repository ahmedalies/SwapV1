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
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
const crypto = require("crypto");
let RepositoryImp = class RepositoryImp {
    constructor(repository, dataMapper, model) {
        this._repository = repository;
        this._dataMapper = dataMapper;
        this._model = model;
    }
    insert(insertKeys, insertValues) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.insertV1(insertKeys, insertValues, this._model)
                .then((res) => {
                return Promise.resolve(this._dataMapper.toDomain(res));
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    findByTwoKeys(queryElement) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.findByTwoKeysWithQuery(queryElement, this._model[0])
                .then((res) => {
                return Promise.resolve(this._dataMapper.toDomain(res));
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    findOne(selections, whereKeys, whereValues, fromQoutes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.findOne(selections, whereKeys, whereValues, fromQoutes, this._model)
                .then((res) => {
                return Promise.resolve(this._dataMapper.toDomain(res));
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    findMany(selections, whereKeys, whereValues, fromQoutes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.findMany(selections, whereKeys, whereValues, fromQoutes, this._model)
                .then((res) => {
                let domainEntities = [];
                res.forEach((item) => {
                    //console.log(this._dataMapper.toDomain(item))
                    domainEntities.push(this._dataMapper.toDomain(item));
                });
                return Promise.resolve(domainEntities);
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.findAll(this._model[0])
                .then((res) => {
                let domainEntities = [];
                if (res) {
                    res.forEach((item) => {
                        domainEntities.push(this._dataMapper.toDomain(item));
                    });
                }
                return Promise.resolve(domainEntities);
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    findByOneKey(queryElement) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.findByOneKey(queryElement, this._model[0])
                .then((res) => {
                return Promise.resolve(this._dataMapper.toDomain(res));
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    update(updateKeys, updateValues, whereKeys, whereValues) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.updateV1(updateKeys, updateValues, whereKeys, whereValues, this._model[0])
                .then((res) => {
                return Promise.resolve(this._dataMapper.toDomain(res));
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.remove(id, this._model[0])
                .then((res) => {
                return Promise.resolve(true);
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    findAllByOnKey(queryElement) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.findAllByOneKey(queryElement, this._model[0])
                .then((res) => {
                let domainEntities = [];
                if (res) {
                    res.forEach((item) => {
                        domainEntities.push(this._dataMapper.toDomain(item));
                    });
                }
                return Promise.resolve(domainEntities);
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    }
    createSHA1Hash(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                try {
                    resolve(crypto.createHash('sha1').update(value).digest('hex'));
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
};
RepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.unmanaged()),
    __param(1, inversify_1.unmanaged()),
    __param(2, inversify_1.unmanaged()),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository, Object, Object])
], RepositoryImp);
exports.RepositoryImp = RepositoryImp;
//# sourceMappingURL=RepositoryImp.js.map