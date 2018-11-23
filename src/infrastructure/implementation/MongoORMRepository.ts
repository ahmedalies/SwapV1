import { injectable } from "inversify";
import { BaseSchema } from "../entities/mongo/schemas/BaseSchema";

@injectable()
export class MongoORMRepository<DALEntity> {
    public async findByOneKey(queryElement: any, model: BaseSchema): Promise<DALEntity> {
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

    public async findAll(model: BaseSchema): Promise<[DALEntity]> {
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

    public async findAllByOneKey(query: any, model: BaseSchema): Promise<DALEntity[]> {
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

    public async findByTwoKeys(queryElement: any, model: BaseSchema): Promise<DALEntity> {
        return await new Promise<DALEntity>((resolve, reject) => {
            model.getModel().findOne(queryElement)
            .then((res) => {
                if (res) resolve(res);
                else reject('document not found');
            }).
            catch((err) => {
                if(err) reject(err);
            });
        });
    }

    public async insert(data: DALEntity, model: BaseSchema): Promise<DALEntity> {
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

    public async update(id: string, object: DALEntity, model: BaseSchema): Promise<DALEntity>{
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

    public async remove(id: string, model: BaseSchema): Promise<boolean> {
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