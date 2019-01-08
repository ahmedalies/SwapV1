import {inject, injectable} from "inversify";
import {RepositoryImp} from "../base/RepositoryImp";
import {DomainUserInterests} from "../../entities/DomainUserInterests";
import {DALUserInterests} from "../../../infrastructure/entities/dal/DALUserInterests";
import {UserInterestsRepository} from "./UserInterestsRepository";
import {TYPES} from "../../../infrastructure/types";
import {TYPES as DOMAIN_TYPES} from '../../types'
import {MongoORMRepository} from "../../../infrastructure/implementation/MongoORMRepository";
import {UserInterestSchema} from "../../../infrastructure/entities/mongo/schemas/UserInterestsSchema";
import {UserInterestsDataMapper} from "../../../infrastructure/data_mapper/UserInterestsDataMapper";
import {InterestsRepository} from "../interests/InterestsRepository";
import {InterestsRepositoryImp} from "../interests/InterestsRepositoryImp";
import {MysqlORMRepository} from "../../../infrastructure/implementation/MysqlORMRepository";
import {ORMRepository} from "../../../infrastructure/implementation/ORMRepository";
import { resolve } from "path";
import { DomainInterest } from "../../entities/DomainInterest";



@injectable()
export class UserInterestsRepositoryImp extends RepositoryImp<DomainUserInterests, DALUserInterests> implements UserInterestsRepository {

    constructor(
        @inject(TYPES.ORMRepositoryForUserInterestsEntity) private repository: ORMRepository<DALUserInterests>,
        @inject(TYPES.EntityDataMapperForUserInterests) private dataMapper: UserInterestsDataMapper,
        @inject(TYPES.UserInterestSchema) private model: UserInterestSchema,
        @inject(DOMAIN_TYPES.InterestsRepository) private interests: InterestsRepositoryImp
    ) {
        super(repository, dataMapper, ['userinterests']);
    }

    public async add(object: DomainUserInterests): Promise<DomainUserInterests> {
        return await new Promise<DomainUserInterests>((resolve, reject) => {
            let message: string[] = [], result: any = null, newInterest: DomainInterest[] = [], iCount = 0;
            object.interests.forEach((x) => {
               this.interests.findOne([], ['_id'], [x._id], 0)
                   .then((res) => {
                       super.findOne([],['userId', 'interestId'],
                       [object.userId.toString(), res.id.toString()], 0)
                       .then((e) => {
                            iCount++
                            if (e){
                                message.push('this user already subscribe for ' + res.name)
                                if(iCount === object.interests.length){
                                    if (newInterest.length) { 
                                        let sql = 'insert into userinterests (userId, interestId) values ';
                                        let count = 0
                                        let values = ''
                                        newInterest.forEach((x) => {
                                            count++
                                            if (count === newInterest.length){
                                                values = '(' + object.userId + ', ' + x.id + ')'
                                            } else {
                                                values = '(' + object.userId + ', ' + x.id + '),'
                                            }
                                            
                                            sql = sql + values;
                                        })
                                        this.repository.perform(sql)
                                        .then((result) => {
                                            object.interests = newInterest
                                            resolve(object)
                                        }).catch((err) => {
                                            reject(err)
                                        })
                                    } else {
                                        reject(message)
                                    }
                                }
                            }
                       }).catch((err) => {
                           iCount++
                            if (err === 'document not found'){
                                newInterest.push(res)
                                if(iCount === object.interests.length){
                                    if (newInterest.length) {
                                        let sql = 'insert into userinterests (userId, interestId) values ';
                                        let count = 0
                                        let values = ''
                                        newInterest.forEach((x) => {
                                            count++
                                            if (count === newInterest.length){
                                                values = '(' + object.userId + ', ' + x.id + ')'
                                            } else {
                                                values = '(' + object.userId + ', ' + x.id + '),'
                                            }
                                            
                                            sql = sql + values;
                                        })
                                        this.repository.perform(sql)
                                        .then((result) => {
                                            object.interests = newInterest
                                            resolve(object)
                                        }).catch((err) => {
                                            reject(err)
                                        })
                                    }
                                }
                            } else {
                                message.push(err)
                            }
                       });
                   }).catch((err) => {
                        message.push('insufficient interestId')
                   });
            });
        })
    }

    public async get(userId: number): Promise<DomainUserInterests> {
        return await new Promise<DomainUserInterests>((resolve, reject) => {
            this.repository.findOne(['userinterests.*', 'interests.nameAR', 'interests.name', 'interests.image_url', 
            'interests.id as iId', 'interests._id as i_id'], 
            ['userinterests.userId', 'userinterests.interestId'], [userId.toString(), 'interests.id'], 1, 
            ['userinterests', 'interests'])
            .then((res) => {
                resolve(this.dataMapper.toDomain(res));
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async removeOne(interestId: string, userId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.findByOneKey({userId: userId})
                .then((res) => {
                    res.interests.splice(res.interests.findIndex(x => x.interests === interestId), 1);
                    super.update([], [], [], [])
                        .then((res) => {
                            resolve(true);
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async removeAll(userId: string): Promise<boolean> {
        return await super.remove(userId);
    }
}