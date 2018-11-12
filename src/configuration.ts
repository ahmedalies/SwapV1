import { ConfigurationCreationSchema as ConfModel } from "./infrastructure/entities/mongo/schemas/ConfigurationCreationSchema";
import { ControlPrivilegeSchema as PrivilegeModel } from "./infrastructure/entities/mongo/schemas/ControlPrivilegeSchema";
import {AdminSchema as AdminModel} from "./infrastructure/entities/mongo/schemas/AdminSchema";
export class Configuration {

    static conf:ConfModel = new ConfModel();
    static privilege: PrivilegeModel = new PrivilegeModel();
    static admin: AdminModel = new AdminModel();


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
                //interests
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
}