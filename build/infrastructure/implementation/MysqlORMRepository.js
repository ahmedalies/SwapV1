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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var MysqlORMRepository_1;
const inversify_1 = require("inversify");
const mysql = require("promise-mysql");
const MysqlHelper_1 = require("./MysqlHelper");
let MysqlORMRepository = MysqlORMRepository_1 = class MysqlORMRepository {
    constructor() {
        if (!MysqlORMRepository_1.pool) {
            MysqlORMRepository_1.pool = mysql.createPool({
                connectionLimit: 100,
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'swap'
            });
        }
    }
    performQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                MysqlORMRepository_1.pool.getConnection()
                    .then((conn) => {
                    conn.query(query)
                        .then((response) => {
                        resolve(response);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    findOne(selections, whereKeys, whereValues, qoutesFrom, model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                MysqlORMRepository_1.pool.getConnection()
                    .then((conn) => {
                    let query = "select ";
                    MysqlHelper_1.MysqlHelper.getSelections(selections)
                        .then((q) => {
                        query = query + q + " ";
                        let modelC = 0;
                        query = query + "from ";
                        model.forEach(element => {
                            query = query + element;
                            modelC++;
                            if (modelC === model.length) {
                                query = query + " ";
                            }
                            else {
                                query = query + ", ";
                            }
                        });
                        MysqlHelper_1.MysqlHelper.getWhereClause(whereKeys, whereValues, qoutesFrom)
                            .then((q) => {
                            query = query + q;
                            //console.log(query)
                            conn.query(query)
                                .then((row) => {
                                if (row.length > 0) {
                                    if (row.length == 1) {
                                        if (model.length > 0) {
                                            let newRow = [];
                                            row.forEach(r => {
                                                selections.forEach(s => {
                                                    let key = '';
                                                    if (!s.includes('*')) {
                                                        if (s.includes(' as ')) {
                                                            key = s.substring(s.indexOf(' as ') + 4);
                                                        }
                                                        else {
                                                            key = s.substring(s.indexOf('.') + 1);
                                                        }
                                                        if (!newRow[key])
                                                            newRow[key] = [];
                                                        //console.log(key + ": " + r[key])
                                                        newRow[key].push(r[key]);
                                                    }
                                                });
                                                row[0].uniqueAddedElement = newRow;
                                            });
                                            //console.log(row);
                                            resolve(row[0]);
                                        }
                                    }
                                    else {
                                        let newRow = [];
                                        row.forEach(r => {
                                            selections.forEach(s => {
                                                let key = '';
                                                if (!s.includes('*')) {
                                                    if (s.includes(' as ')) {
                                                        key = s.substring(s.indexOf(' as ') + 4);
                                                    }
                                                    else {
                                                        key = s.substring(s.indexOf('.') + 1);
                                                    }
                                                    if (!newRow[key])
                                                        newRow[key] = [];
                                                    newRow[key].push(r[key]);
                                                }
                                            });
                                            row[0].uniqueAddedElement = newRow;
                                        });
                                        resolve(row[0]);
                                    }
                                }
                                else
                                    reject('document not found');
                            }).catch((err) => {
                                reject(err);
                            });
                        }).catch((err) => {
                            reject(err);
                        });
                    })
                        .catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    findMany(selections, whereKeys, whereValues, qoutesFrom, model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                MysqlORMRepository_1.pool.getConnection()
                    .then((conn) => {
                    let query = "select ";
                    MysqlHelper_1.MysqlHelper.getSelections(selections)
                        .then((q) => {
                        query = query + q + " ";
                        let modelC = 0;
                        query = query + "from ";
                        model.forEach(element => {
                            query = query + element;
                            modelC++;
                            if (modelC === model.length) {
                                query = query + " ";
                            }
                            else {
                                query = query + ", ";
                            }
                        });
                        MysqlHelper_1.MysqlHelper.getWhereClause(whereKeys, whereValues, qoutesFrom)
                            .then((q) => {
                            query = query + q;
                            //console.log(query)
                            conn.query(query)
                                .then((result) => {
                                //resolve(result)
                                if (result.length > 0) {
                                    if (result.length == 1) {
                                        if (model.length > 0) {
                                            let newRow = [];
                                            let rowCount = 0;
                                            result.forEach(r => {
                                                selections.forEach(s => {
                                                    let key = '';
                                                    if (!s.includes('*')) {
                                                        if (s.includes(' as ')) {
                                                            key = s.substring(s.indexOf(' as ') + 4);
                                                        }
                                                        else {
                                                            key = s.substring(s.indexOf('.') + 1);
                                                        }
                                                        if (!newRow[key])
                                                            newRow[key] = [];
                                                        //console.log(key + ": " + r[key])
                                                        newRow[key].push(r[key]);
                                                    }
                                                });
                                                result[rowCount].uniqueAddedElement = newRow;
                                                rowCount++;
                                                //console.log(rowCount)
                                            });
                                            //console.log(result);
                                            resolve(result);
                                        }
                                    }
                                    else {
                                        let newRow = [];
                                        let counter = 0;
                                        result.forEach(r => {
                                            selections.forEach(s => {
                                                let key = '';
                                                if (!s.includes('*')) {
                                                    if (s.includes(' as ')) {
                                                        key = s.substring(s.indexOf(' as ') + 4);
                                                    }
                                                    else {
                                                        key = s.substring(s.indexOf('.') + 1);
                                                    }
                                                    if (!newRow[key])
                                                        newRow[key] = [];
                                                    newRow[key].push(r[key]);
                                                }
                                            });
                                            result[counter].uniqueAddedElement = newRow;
                                            counter++;
                                            newRow = [];
                                        });
                                        //console.log(result)
                                        resolve(result);
                                    }
                                }
                                else
                                    reject('document not found');
                            }).catch((err) => {
                                reject(err);
                            });
                        }).catch((err) => {
                            reject(err);
                        });
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    insert(insertKeys, insertValues, model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                MysqlORMRepository_1.pool.getConnection()
                    .then((conn) => {
                    let query = "insert into " + model[0] + " ";
                    MysqlHelper_1.MysqlHelper.getInsertClause(insertKeys, insertValues)
                        .then((q) => {
                        query = query + q;
                        if (insertKeys.length) {
                            //console.log(query);
                            conn.query(query)
                                .then((res) => {
                                //console.log(res)
                                this.findOne([], [model[0] + '.id'], [res.insertId], 0, model)
                                    .then((finalResult) => {
                                    //console.log(finalResult)
                                    resolve(finalResult);
                                }).catch((err) => {
                                    //console.log(err);
                                    reject(err.sqlMessage);
                                });
                            }).catch((err) => {
                                //console.log(err);
                                reject(err.sqlMessage);
                            });
                        }
                        else {
                            reject('can not update without whereClause');
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    update(updateKeys, updateValues, whereKeys, whereValues, model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                MysqlORMRepository_1.pool.getConnection()
                    .then((conn) => {
                    let query = "update " + model + " set ";
                    MysqlHelper_1.MysqlHelper.getUpdateClause(updateKeys, updateValues)
                        .then((q) => {
                        query = query + q;
                        if (whereKeys.length) {
                            MysqlHelper_1.MysqlHelper.getWhereClause(whereKeys, whereValues, 0)
                                .then((q) => {
                                query = query + " " + q;
                                //console.log(query)
                                conn.query(query)
                                    .then((res) => {
                                    this.findOne([], updateKeys, updateValues, 0, [model])
                                        .then((res) => {
                                        resolve(res);
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
                            reject('can not update without whereClause');
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    remove(id, model) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
};
MysqlORMRepository = MysqlORMRepository_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], MysqlORMRepository);
exports.MysqlORMRepository = MysqlORMRepository;
//# sourceMappingURL=MysqlORMRepository.js.map