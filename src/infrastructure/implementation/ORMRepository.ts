import {MysqlORMRepository} from "./MysqlORMRepository";
import {MongoORMRepository} from "./MongoORMRepository";

import {inject, injectable, unmanaged} from "inversify";
import {BaseSchema} from "../interfaces/BaseSchema";
import {TYPES} from "../types";
import { resolve } from "dns";

@injectable()
export class ORMRepository<DALEntity> {
    constructor(@inject(TYPES.MysqlORMRepository) private mysql: MysqlORMRepository,
                @inject(TYPES.MongoORMRepository) private mongo: MongoORMRepository){}

    public async findByOneKey(queryElement: any, model: BaseSchema | string): Promise<DALEntity> {
        if (typeof model != 'string') {
            return await new Promise<DALEntity>((resolve, reject) => {
                model.getModel().findOne(queryElement)
                    .then((res) => {
                        if (res) resolve(res);
                        else reject('document not found');
                    }).catch((err) => {
                        reject(err);
                    });
            });
        }
    }

    public async findAll(model: BaseSchema | string): Promise<[DALEntity]> {
        if (typeof model != 'string') {
            return await new Promise<[DALEntity]>((resolve, reject) => {
                model.getModel().find({})
                    .then((res) => {
                        if (res) resolve(res);
                        else reject('document not found');
                    }).catch((err) => {
                    reject(err);
                });
            });
        }
    }

    public async findAllByOneKey(query: any, model: BaseSchema | string): Promise<DALEntity[]> {
        if (typeof model != 'string') {
            return await new Promise<DALEntity[]>((resolve, reject) => {
                model.getModel().find({query})
                    .then((res) => {
                        if (res) resolve(res);
                        else reject('document not found');
                    }).catch((err) => {
                    reject(err);
                });
            });
        }
    }

    public async findByTwoKeysWithQuery(queryElement: any, model: BaseSchema | string): Promise<DALEntity> {
        if (typeof model != 'string') {
            return await new Promise<DALEntity>((resolve, reject) => {
                model.getModel().findOne(queryElement)
                    .then((res) => {
                        if (res) resolve(res);
                        else reject('document not found');
                    }).catch((err) => {
                    if (err) reject(err);
                });
            });
        }
    }

    public async insert(data: DALEntity, model: BaseSchema | string): Promise<DALEntity> {
        if (typeof model != 'string') {
            return await new Promise<DALEntity>((resolve, reject) => {
                model.getModel().collection.insertOne(data)
                    .then((res) => {
                        resolve(res.ops[0]);
                    })
                    .catch((err) => {
                        reject(err)
                    });
            });
        }
    }

    public async update(id: string, object: DALEntity, model: BaseSchema | string): Promise<DALEntity>{
        if (typeof model != 'string') {
            return await new Promise<DALEntity>((resolve, reject) => {
                model.getModel().findByIdAndUpdate(id, object, {new: true})
                    .then((res) => {
                        if (res) resolve(res);
                        else reject('document not found');
                    }).catch((err) => {
                    reject(err);
                });
            });
        }
    }

    public async remove(id: string, model: BaseSchema | string): Promise<boolean> {
        if (typeof model != 'string') {
            return await new Promise<boolean>((resolve, reject) => {
                model.getModel().collection.findByIdAndDelete(id)
                    .then((res) => {
                        if (res) resolve(true);
                        else reject('document not found');
                    }).catch((err) => {
                    reject(err);
                });
            });
        }
    }

    //new ones

    public async findOne(selections: string[], whereKeys:string[], whereValues: string[],qoutesFrom:number,
         model: BaseSchema | string[]): Promise<DALEntity> {
        return await new Promise<DALEntity>((resolve, reject) => {
            if (model instanceof Array){
                this.mysql.findOne(selections, whereKeys, whereValues, qoutesFrom, model)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }

    public async findMany(selections: string[], whereKeys:string[], whereValues: string[], qoutesFrom: number, model: BaseSchema | string[]): Promise<DALEntity[]> {
        if (model instanceof Array){
            return await new Promise<DALEntity[]>((resolve, reject) => {
                this.mysql.findMany(selections, whereKeys, whereValues, qoutesFrom, model)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        }
    }

    public async insertV1(insertKeys: string[], insertValues: string[], model: BaseSchema | string[]): Promise<DALEntity> {
        if (model instanceof Array)
            return await this.mysql.insert(insertKeys, insertValues, model);
    }

    public async updateV1(updateKeys: string[], updateValues: string[], whereKeys: string[], whereValues: string[],
                           model: BaseSchema | string): Promise<DALEntity> {
        if (typeof model === 'string')
            return await this.mysql.update(updateKeys, updateValues, whereKeys, whereValues, model);
    }

    public async perform(query: string): Promise<any> {
        return await this.mysql.performQuery(query);
    }
}