import { injectable } from "inversify";
import * as mongoose from "mongoose";
import { BaseSchema } from "../entities/mongo/schemas/BaseSchema";
@injectable()
export class ORMRepository<DALEntity> {
    findByTwoKeys(k1: string, k2: string, v1:string|number|boolean, v2: string|number|boolean, model: BaseSchema): Promise<DALEntity> {
        console.log(model);
        let p = new Promise<DALEntity>((resolve, reject) => {
            model.getModel().findOne({k1: v1, k2: v2})
            .then((res) => {
                if (res) resolve(res);
                else reject('document not found');
            }).
            catch((err) => {
                if(err) reject(err);
            });
        });

        return p;
    }

    insert(data: DALEntity, model: BaseSchema): Promise<DALEntity> {
        let p = new Promise<DALEntity>((resolve, reject) => {
            let doc = model.getModel()(data);
            doc.save()
            .then(() => {
                resolve(data);
            })
            .catch((err) => {
                if(err)
                    reject(err)
            });
        });

        return p;
    }
}