import {MysqlORMRepository} from "./MysqlORMRepository";
import {MongoORMRepository} from "./MongoORMRepository";

import {inject, injectable} from "inversify";
import {BaseSchema} from "../interfaces/BaseSchema";

@injectable()
export class ORMRepostory<DALEntity> {
    constructor(@inject('MysqlORMRepository<DALEntity>') private mysql: MysqlORMRepository<DALEntity>,
                @inject('MongoORMRepository<DALEntity>') private mongo: MongoORMRepository<DALEntity>){}

    public async findByTwoKeys(selections: string[], whereKeys:string[], whereValues: string[], model: BaseSchema): Promise<DALEntity> {
        return await new Promise<DALEntity>((resolve, reject) => {
            this.mysql.findByTwoKeysWithQuery(selections, whereKeys, whereValues, model)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                })
        })
    }
}