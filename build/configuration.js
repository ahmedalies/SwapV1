"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationCreationSchema_1 = require("./infrastructure/dal/entities/mongo/schemas/ConfigurationCreationSchema");
const ControlPrivilegeSchema_1 = require("./infrastructure/dal/entities/mongo/schemas/ControlPrivilegeSchema");
class Configuration {
    static configureForFirstRun() {
        return __awaiter(this, void 0, void 0, function* () {
            const p = yield new Promise((resolve, reject) => {
                //todo add point system configuration within the resolve
                //add admin privilege -- (control privilege)
                Configuration.checkIfCreated('control_privileges')
                    .then((res) => {
                    if (res) {
                        Configuration.addControllPrivilege()
                            .then((res) => {
                            resolve(res);
                        })
                            .catch((err) => {
                            reject(err);
                        });
                    }
                    else {
                        reject('error occured');
                    }
                })
                    .catch((err) => {
                    reject(err);
                });
            });
            return p;
        });
    }
    static checkIfCreated(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = yield new Promise((resolve, reject) => {
                this.conf.getModel().findOne({ name: key })
                    .then((res) => {
                    if (res)
                        reject('control privileges already created');
                    else {
                        this.conf.getModel().collection.insertOne({ name: key })
                            .then(() => {
                            resolve('control privileges created successfully');
                        })
                            .catch((err) => {
                            reject(err);
                        });
                    }
                })
                    .catch((err) => {
                    reject(err);
                });
            });
            return p;
        });
    }
    static addControllPrivilege() {
        return __awaiter(this, void 0, void 0, function* () {
            let p = yield new Promise((resolve, reject) => {
                /* array of privileges -- add every function to give control
                * only on first run of system
                * ControlPrivilege has it's own -crud- operation on privileges
                */
                const arrOfData = [
                    { fname: 'insert_interest' }
                ];
                this.privilege.getModel().collection.insertMany(arrOfData)
                    .then(() => {
                    resolve('control privileges are inserted successfully');
                })
                    .catch((err) => {
                    reject(err);
                });
            });
            return p;
        });
    }
}
Configuration.conf = new ConfigurationCreationSchema_1.ConfigurationCreationSchema();
Configuration.privilege = new ControlPrivilegeSchema_1.ControlPrivilegeSchema();
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map