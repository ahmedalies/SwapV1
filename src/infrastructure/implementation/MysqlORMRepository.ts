import {injectable} from "inversify";
import {BaseSchema} from "../interfaces/BaseSchema";
import * as mysql from 'promise-mysql'
import {Pool} from "promise-mysql";
import {MysqlHelper} from "./MysqlHelper";
import { resolve } from "dns";

@injectable()
export class MysqlORMRepository {

    static pool: Pool;

    constructor() {
        if (!MysqlORMRepository.pool) {
            MysqlORMRepository.pool = mysql.createPool({
                connectionLimit: 100,
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'swap'
            });
        }
    }

    public async performQuery(query: string): Promise<any>{
        return await new Promise<any>((resolve, reject) => {
            MysqlORMRepository.pool.getConnection()
            .then((conn) => {
                conn.query(query)
                .then((response) => {
                    resolve(response)
                }).catch((err) => {
                    reject(err)  
                })
            }).catch((err) => {
                reject(err)
            })
        })
    }

    public async findOne(selections: string[], whereKeys: string[], whereValues: string[],
        qoutesFrom: number, model: string[]): Promise<any> {
        return await new Promise<any>((resolve, reject) => {
            MysqlORMRepository.pool.getConnection()
                .then((conn) => {
                    let query = "select ";
                    MysqlHelper.getSelections(selections)
                        .then((q) => {
                            query = query + q + " ";
                            let modelC = 0;
                            query = query + "from ";
                            model.forEach(element => {
                                query = query + element;
                                modelC++ 
                                if(modelC === model.length){
                                    query = query + " "
                                } else {
                                    query = query + ", "
                                }
                            });
                            MysqlHelper.getWhereClause(whereKeys, whereValues, qoutesFrom)
                                .then((q) => {
                                    query = query + q;
                                    //console.log(query)
                                    conn.query(query)
                                        .then((row) => {
                                            if (row.length > 0) {
                                                if (row.length == 1){
                                                    if (model.length > 0){
                                                        let newRow = [];
                                                        row.forEach(r => {
                                                            selections.forEach(s => {
                                                                 let key = '';
                                                                 if (!s.includes('*')){
                                                                     if(s.includes(' as ')) {
                                                                         key = s.substring(s.indexOf(' as ') + 4);
                                                                     } else {
                                                                         key = s.substring(s.indexOf('.') + 1)
                                                                     }
                                                                     if (!newRow[key])
                                                                         newRow[key] = [];
    
                                                                     //console.log(key + ": " + r[key])
                                                                     newRow[key].push(r[key]);
                                                                 }
                                                            });
                                                            row[0].uniqueAddedElement = newRow;
                                                         });
                                                         //console.log(row);
                                                         resolve(row[0])
                                                    }
                                                }
                                                else {
                                                    let newRow = [];
                                                    row.forEach(r => {
                                                       selections.forEach(s => {
                                                            let key = '';
                                                            if (!s.includes('*')){
                                                                if(s.includes(' as ')) {
                                                                    key = s.substring(s.indexOf(' as ') + 4);
                                                                } else {
                                                                    key = s.substring(s.indexOf('.') + 1)
                                                                }
                                                                if (!newRow[key])
                                                                    newRow[key] = [];

                                                                newRow[key].push(r[key]);
                                                            }
                                                       });
                                                       row[0].uniqueAddedElement = newRow;
                                                    });
                                                    resolve(row[0])
                                                }
                                            } 
                                            else reject('document not found')
                                        }).catch((err) => {
                                            reject(err);
                                        });
                                }).catch((err) => {
                                    reject(err)
                                });
                        })
                        .catch((err) => {
                           reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async findMany(selections: string[], whereKeys:string[], whereValues: string[], qoutesFrom: number, model: string[]): Promise<any[]> {
        return await new Promise<any>((resolve, reject) => {
            MysqlORMRepository.pool.getConnection()
                .then((conn) => {
                    let query = "select ";
                    MysqlHelper.getSelections(selections)
                        .then((q) => {
                            query = query + q + " ";
                            let modelC = 0;
                            query = query + "from ";
                            model.forEach(element => {
                                query = query + element;
                                modelC++ 
                                if(modelC === model.length){
                                    query = query + " "
                                } else {
                                    query = query + ", "
                                }
                            });
                            MysqlHelper.getWhereClause(whereKeys, whereValues, qoutesFrom)
                                .then((q) => {
                                    query = query + q;
                                    //console.log(query)
                                    conn.query(query)
                                        .then((result) => {
                                            resolve(result)
                                            if (result.length > 0) {
                                                if (result.length == 1){
                                                    if (model.length > 0){
                                                        let newRow = [];
                                                        let rowCount = 0;
                                                        result.forEach(r => {
                                                            selections.forEach(s => {
                                                                 let key = '';
                                                                 if (!s.includes('*')){
                                                                     if(s.includes(' as ')) {
                                                                         key = s.substring(s.indexOf(' as ') + 4);
                                                                     } else {
                                                                         key = s.substring(s.indexOf('.') + 1)
                                                                     }
                                                                     if (!newRow[key])
                                                                         newRow[key] = [];
    
                                                                     //console.log(key + ": " + r[key])
                                                                     newRow[key].push(r[key]);
                                                                 }
                                                            });
                                                            result[rowCount].uniqueAddedElement = newRow;
                                                            rowCount++
                                                            console.log(rowCount)
                                                         });
                                                         console.log(result);
                                                         //resolve(result)
                                                    }
                                                }
                                                else {
                                                    let newRow = [];
                                                    result.forEach(r => {
                                                       selections.forEach(s => {
                                                            let key = '';
                                                            if (!s.includes('*')){
                                                                if(s.includes(' as ')) {
                                                                    key = s.substring(s.indexOf(' as ') + 4);
                                                                } else {
                                                                    key = s.substring(s.indexOf('.') + 1)
                                                                }
                                                                if (!newRow[key])
                                                                    newRow[key] = [];

                                                                newRow[key].push(r[key]);
                                                            }
                                                       });
                                                       result[0].uniqueAddedElement = newRow;
                                                    });
                                                    resolve(result[0])
                                                }
                                            } 
                                            else reject('document not found')
                                        }).catch((err) => {
                                        reject(err);
                                    });
                                }).catch((err) => {
                                reject(err)
                            });
                        });
                }).catch((err) => {
                reject(err);
            });
        });
    }

    public async insert(insertKeys: string[], insertValues: string[], model: string[]): Promise<any> {
        return await new Promise<any>((resolve, reject) => {
            MysqlORMRepository.pool.getConnection()
                .then((conn) => {
                    let query = "insert into " + model[0] + " ";
                    MysqlHelper.getInsertClause(insertKeys, insertValues)
                        .then((q) => {
                            query = query + q;
                            if (insertKeys.length) {
                                //console.log(query);
                                conn.query(query)
                                    .then((res) => {
                                        this.findOne([], [model[0] + '.id'], [res.insertId], 0, model)
                                            .then((res) => {
                                                resolve(res);
                                            }).catch((err) => {
                                                console.log(err);
                                                reject(err.sqlMessage);
                                            });
                                    }).catch((err) => {
                                        //console.log(err);
                                        reject(err.sqlMessage);
                                    });
                            } else {
                                reject('can not update without whereClause');
                            }
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async update(updateKeys: string[], updateValues: string[], whereKeys: string[], whereValues: string[],
                        model: string): Promise<any>{
        return await new Promise<any>((resolve, reject) => {
            MysqlORMRepository.pool.getConnection()
                .then((conn) => {
                    let query = "update " + model + " set ";
                    MysqlHelper.getUpdateClause(updateKeys, updateValues)
                        .then((q) => {
                            query = query + q;
                            if (whereKeys.length) {
                                MysqlHelper.getWhereClause(whereKeys, whereValues, 0)
                                    .then((q) => {
                                        query = query + " " + q;
                                        //console.log(query)
                                        conn.query(query)
                                            .then((res) => {
                                                this.findOne([], updateKeys, updateValues, 0, [model])
                                                    .then((res) => {
                                                        resolve(res);
                                                    }).catch((err) => {
                                                        reject(err);
                                                    });
                                            }).catch((err) => {
                                                reject(err);
                                            });
                                    }).catch((err) => {
                                        reject(err);
                                    });
                            } else {
                                reject('can not update without whereClause');
                            }
                        }).catch((err) => {
                            reject(err);
                        });
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