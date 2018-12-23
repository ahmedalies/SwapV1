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
const MysqlORMRepository_1 = require("./MysqlORMRepository");
const MongoORMRepository_1 = require("./MongoORMRepository");
const inversify_1 = require("inversify");
const types_1 = require("../types");
let ORMRepository = class ORMRepository {
    constructor(mysql, mongo) {
        this.mysql = mysql;
        this.mongo = mongo;
    }
    findByOneKey(queryElement, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof model != 'string') {
                return yield new Promise((resolve, reject) => {
                    model.getModel().findOne(queryElement)
                        .then((res) => {
                        if (res)
                            resolve(res);
                        else
                            reject('document not found');
                    }).catch((err) => {
                        reject(err);
                    });
                });
            }
        });
    }
    findAll(model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof model != 'string') {
                return yield new Promise((resolve, reject) => {
                    model.getModel().find({})
                        .then((res) => {
                        if (res)
                            resolve(res);
                        else
                            reject('document not found');
                    }).catch((err) => {
                        reject(err);
                    });
                });
            }
        });
    }
    findAllByOneKey(query, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof model != 'string') {
                return yield new Promise((resolve, reject) => {
                    model.getModel().find({ query })
                        .then((res) => {
                        if (res)
                            resolve(res);
                        else
                            reject('document not found');
                    }).catch((err) => {
                        reject(err);
                    });
                });
            }
        });
    }
    findByTwoKeysWithQuery(queryElement, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof model != 'string') {
                return yield new Promise((resolve, reject) => {
                    model.getModel().findOne(queryElement)
                        .then((res) => {
                        if (res)
                            resolve(res);
                        else
                            reject('document not found');
                    }).catch((err) => {
                        if (err)
                            reject(err);
                    });
                });
            }
        });
    }
    insert(data, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof model != 'string') {
                return yield new Promise((resolve, reject) => {
                    model.getModel().collection.insertOne(data)
                        .then((res) => {
                        resolve(res.ops[0]);
                    })
                        .catch((err) => {
                        reject(err);
                    });
                });
            }
        });
    }
    update(id, object, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof model != 'string') {
                return yield new Promise((resolve, reject) => {
                    model.getModel().findByIdAndUpdate(id, object, { new: true })
                        .then((res) => {
                        if (res)
                            resolve(res);
                        else
                            reject('document not found');
                    }).catch((err) => {
                        reject(err);
                    });
                });
            }
        });
    }
    remove(id, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof model != 'string') {
                return yield new Promise((resolve, reject) => {
                    model.getModel().collection.findByIdAndDelete(id)
                        .then((res) => {
                        if (res)
                            resolve(true);
                        else
                            reject('document not found');
                    }).catch((err) => {
                        reject(err);
                    });
                });
            }
        });
    }
    //new ones
    findOne(selections, whereKeys, whereValues, qoutesFrom, model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (model instanceof Array) {
                    this.mysql.findOne(selections, whereKeys, whereValues, qoutesFrom, model)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    findMany(selections, whereKeys, whereValues, qoutesFrom, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model instanceof Array) {
                return yield new Promise((resolve, reject) => {
                    this.mysql.findMany(selections, whereKeys, whereValues, qoutesFrom, model)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                });
            }
        });
    }
    insertV1(insertKeys, insertValues, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model instanceof Array)
                return yield this.mysql.insert(insertKeys, insertValues, model);
        });
    }
    updateV1(updateKeys, updateValues, whereKeys, whereValues, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof model === 'string')
                return yield this.mysql.update(updateKeys, updateValues, whereKeys, whereValues, model);
        });
    }
    perform(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mysql.performQuery(query);
        });
    }
};
ORMRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.MysqlORMRepository)),
    __param(1, inversify_1.inject(types_1.TYPES.MongoORMRepository)),
    __metadata("design:paramtypes", [MysqlORMRepository_1.MysqlORMRepository,
        MongoORMRepository_1.MongoORMRepository])
], ORMRepository);
exports.ORMRepository = ORMRepository;
//# sourceMappingURL=ORMRepository.js.map