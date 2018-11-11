import { ConfigurationCreationSchema as ConfModel } from "./infrastructure/dal/entities/mongo/schemas/ConfigurationCreationSchema";
import { ControlPrivilegeSchema as PrivilegeModel } from "./infrastructure/dal/entities/mongo/schemas/ControlPrivilegeSchema";
export class Configuration {

    static conf:ConfModel = new ConfModel();
    static privilege: PrivilegeModel = new PrivilegeModel();


    public static async configureForFirstRun(): Promise<string>{
        const p = await new Promise<string>((resolve, reject) => {
            //todo add point system configuration within the resolve


            //add admin privilege -- (control privilege)
            Configuration.checkIfCreated('control_privileges')
            .then((res) => {
                if(res){
                    Configuration.addControllPrivilege()
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                } else {
                    reject('error occured');
                }
            })
            .catch((err) => {
                reject(err);
            })
        });

        return p;
    }

    private static async checkIfCreated(key: string): Promise<string>{
        let p = await new Promise<string>((resolve, reject) => {
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

        return p;
    }

    private static async addControllPrivilege(): Promise<string>{
        let p = await new Promise<string>((resolve, reject) => {
            /* array of privileges -- add every function to give control
            * only on first run of system
            * ControlPrivilege has it's own -crud- operation on privileges
            */
            const arrOfData = [
                {fname: 'insert_interest'}
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
    }
}