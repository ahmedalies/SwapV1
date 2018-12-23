import { ConfigurationCreationSchema as ConfModel } from "./infrastructure/entities/mongo/schemas/ConfigurationCreationSchema";
import { ControlPrivilegeSchema as PrivilegeModel } from "./infrastructure/entities/mongo/schemas/ControlPrivilegeSchema";
import {AdminSchema as AdminModel} from "./infrastructure/entities/mongo/schemas/AdminSchema";
import {SwapRequestSchema as SwapRequestModel} from './infrastructure/entities/mongo/schemas/SwapRequestSchema'
import {ItemSchema as ItemModel} from './infrastructure/entities/mongo/schemas/ItemSchema'
import {isUndefined} from "util";
export class Configuration {

    static conf:ConfModel = new ConfModel();
    static privilege: PrivilegeModel = new PrivilegeModel();
    static admin: AdminModel = new AdminModel();
    static swapRequest: SwapRequestModel = new SwapRequestModel();
    static item: ItemModel = new ItemModel();
    static intervals: string[] = [];


    public static async configureForFirstRun(): Promise<string>{
        return await new Promise<string>((resolve, reject) => {
            //todo add point system configuration within the resolve


            //add admin privilege -- (control privilege)
            Configuration.checkIfCreated('control_privilege')
            .then((res) => {
                if(res){
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
                } else {
                    reject('error occurred');
                }
            })
            .catch((err) => {
                reject(err);
            })

            //register 7 days intervals
        });
    }

    private static async checkIfCreated(key: string): Promise<string>{
        return await new Promise<string>((resolve, reject) => {
            this.conf.getModel().findOne({name: key})
            .then((res) => {
                if(res) reject('control privileges already created');
                else{
                    this.conf.getModel().collection.insertOne({name: key})
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
    }

    private static async addControlPrivilege(): Promise<string>{
        return await new Promise<string>((resolve, reject) => {
            /* array of privileges -- add every function to give control
            * only on first run of system
            * ControlPrivilege has it's own -crud- operation on privileges
            */
            const arrOfData = [
                /* ---------------------- admin -----------------------*/
                //admin
                {f_name: 'createAdmin'},
                {f_name: 'getAdmin'},
                {f_name: 'updateAdmin'},
                {f_name: 'removeAdmin'},
                //interests for admin
                {f_name: 'addInterest'},
                {f_name: 'getInterest'},
                {f_name: 'updateInterest'},
                {f_name: 'deleteInterest'},
            ];

            this.privilege.getModel().collection.insertMany(arrOfData)
            .then(() => {
                resolve('control privileges are inserted successfully');
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    private static async createSuperAdmin(): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            Configuration.privilege.getModel().find({})
                .then((res) => {
                    let privileges = [];
                    res.forEach((item) => {
                        privileges.push(item._id);
                    });

                    Configuration.admin.getModel().collection.insertOne({username: 'super_admin', password: 'super_admin', privileges: privileges})
                        .then((res) => {
                            resolve('super admin created successfully')
                        }).catch((err) => {
                            reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    private static async regsiter7DaysIntervals(): Promise<string> {
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
    }
}