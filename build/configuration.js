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
const ConfigurationCreationSchema_1 = require("./infrastructure/entities/mongo/schemas/ConfigurationCreationSchema");
const ControlPrivilegeSchema_1 = require("./infrastructure/entities/mongo/schemas/ControlPrivilegeSchema");
const AdminSchema_1 = require("./infrastructure/entities/mongo/schemas/AdminSchema");
const SwapRequestSchema_1 = require("./infrastructure/entities/mongo/schemas/SwapRequestSchema");
const ItemSchema_1 = require("./infrastructure/entities/mongo/schemas/ItemSchema");
class Configuration {
    static configureForFirstRun() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                //todo add point system configuration within the resolve
                //add admin privilege -- (control privilege)
                Configuration.checkIfCreated('control_privilege')
                    .then((res) => {
                    if (res) {
                        Configuration.addControlPrivilege()
                            .then((res) => {
                            Configuration.createSuperAdmin()
                                .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                        })
                            .catch((err) => {
                            reject(err);
                        });
                    }
                    else {
                        reject('error occurred');
                    }
                })
                    .catch((err) => {
                    reject(err);
                });
                //register 7 days intervals
            });
        });
    }
    static checkIfCreated(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
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
        });
    }
    static addControlPrivilege() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                /* array of privileges -- add every function to give control
                * only on first run of system
                * ControlPrivilege has it's own -crud- operation on privileges
                */
                const arrOfData = [
                    /* ---------------------- admin -----------------------*/
                    //admin
                    { f_name: 'createAdmin' },
                    { f_name: 'getAdmin' },
                    { f_name: 'updateAdmin' },
                    { f_name: 'removeAdmin' },
                    //interests for admin
                    { f_name: 'addInterest' },
                    { f_name: 'getInterest' },
                    { f_name: 'updateInterest' },
                    { f_name: 'deleteInterest' },
                ];
                this.privilege.getModel().collection.insertMany(arrOfData)
                    .then(() => {
                    resolve('control privileges are inserted successfully');
                })
                    .catch((err) => {
                    reject(err);
                });
            });
        });
    }
    static createSuperAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                Configuration.privilege.getModel().find({})
                    .then((res) => {
                    let privileges = [];
                    res.forEach((item) => {
                        privileges.push(item._id);
                    });
                    Configuration.admin.getModel().collection.insertOne({ username: 'super_admin', password: 'super_admin', privileges: privileges })
                        .then((res) => {
                        resolve('super admin created successfully');
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    static regsiter7DaysIntervals() {
        return __awaiter(this, void 0, void 0, function* () {
            // Configuration.item.getModel().collection.find({})
            //     .then((res) => {
            //         if (res && res.length) {
            //             res.forEach((x) => {
            //                 Configuration.intervals.push(x.id) = setInterval(() => {
            //                     console.log('-1000');
            //                     if (x[0].oneWeekMilli >= 1000){
            //                         x[0].oneWeekMilli = x[0].oneWeekMilli - 1000;
            //                     } else {
            //                         x[0].oneWeekMilli = 0;
            //                         x[0].status = "blocked for 1 week policy without accepting requests";
            //                     }
            //                     x.save();
            //                 }, 1000);
            //             });
            //         }
            //     }).catch((err) => {
            //
            //     });
            return null;
        });
    }
}
Configuration.conf = new ConfigurationCreationSchema_1.ConfigurationCreationSchema();
Configuration.privilege = new ControlPrivilegeSchema_1.ControlPrivilegeSchema();
Configuration.admin = new AdminSchema_1.AdminSchema();
Configuration.swapRequest = new SwapRequestSchema_1.SwapRequestSchema();
Configuration.item = new ItemSchema_1.ItemSchema();
Configuration.intervals = [];
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map