"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
let MysqlHelper = class MysqlHelper {
    static getSelections(selections) {
        let query = "";
        if (selections.length > 0) {
            let selectionCount = 0;
            query = query + "";
            selections.forEach((x) => {
                selectionCount++;
                if (selectionCount == selections.length) {
                    query = query + x + "";
                }
                else {
                    query = query + x + ",";
                }
            });
        }
        else {
            query = "*";
        }
        return Promise.resolve(query);
    }
    static getWhereClause(whereKeys, whereValues, noQoutes) {
        let query = "";
        if (whereKeys.length > 0) {
            if (whereKeys.length === whereValues.length) {
                query = query + "where ";
                let valueCounter = 0;
                whereKeys.forEach((key) => {
                    if (noQoutes > 0 && valueCounter >= noQoutes)
                        query = query + key + "=" + whereValues[valueCounter];
                    else
                        query = query + key + "=" + "'" + whereValues[valueCounter] + "'";
                    valueCounter++;
                    if (valueCounter === whereKeys.length) {
                    }
                    else {
                        query = query + " and ";
                    }
                });
            }
            else {
                return Promise.reject('whereKeys != whereValues');
            }
        }
        return Promise.resolve(query);
    }
    static getUpdateClause(updateKeys, updateValues) {
        let query = "";
        if (updateKeys.length > 0) {
            if (updateKeys.length === updateValues.length) {
                let valueCounter = 0;
                updateKeys.forEach((key) => {
                    query = query + key + "=" + "'" + updateValues[valueCounter] + "'";
                    valueCounter++;
                    if (valueCounter === updateKeys.length) {
                    }
                    else {
                        query = query + ", ";
                    }
                });
            }
            else {
                return Promise.reject('updateKeys != updateValues');
            }
        }
        return Promise.resolve(query);
    }
    static getInsertClause(insertKeys, insertValues) {
        let query = "(";
        if (insertKeys.length > 0) {
            if (insertKeys.length === insertValues.length) {
                let keyCounter = 0;
                insertKeys.forEach((key) => {
                    keyCounter++;
                    if (keyCounter === insertKeys.length) {
                        query = query + key + ")";
                    }
                    else {
                        query = query + key + ", ";
                    }
                });
                let valueCounter = 0;
                query = query + " values (";
                insertValues.forEach((key) => {
                    valueCounter++;
                    if (valueCounter === insertValues.length) {
                        query = query + "'" + key + "')";
                    }
                    else {
                        query = query + "'" + key + "'" + ",";
                    }
                });
            }
            else {
                return Promise.reject('insertKeys != insertValues');
            }
        }
        return Promise.resolve(query);
    }
    static getInsertValues(insertValues) {
        let query = ", ";
        if (insertValues.length) {
            let valueCounter = 0;
            query = query + " values (";
            insertValues.forEach((key) => {
                valueCounter++;
                if (valueCounter === insertValues.length) {
                    query = query + "'" + key + "')";
                }
                else {
                    query = query + "'" + key + "'" + ",";
                }
            });
        }
        else {
            return Promise.reject('insertValues.length = 0');
        }
        return Promise.resolve(query);
    }
};
MysqlHelper = __decorate([
    inversify_1.injectable()
], MysqlHelper);
exports.MysqlHelper = MysqlHelper;
//# sourceMappingURL=MysqlHelper.js.map