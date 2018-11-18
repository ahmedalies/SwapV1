import {inject, injectable} from "inversify";
import {RepositoryImp} from "../base/RepositoryImp";
import {DomainUserInterests} from "../../entities/DomainUserInterests";
import {DALUserInterests} from "../../../infrastructure/entities/dal/DALUserInterests";
import {UserInterestsRepository} from "./UserInterestsRepository";
import {TYPES} from "../../../infrastructure/types";
import {TYPES as DOMAIN_TYPES} from '../../types'
import {MongoORMRepository} from "../../../infrastructure/dal/implementation/MongoORMRepository";
import {UserInterestSchema} from "../../../infrastructure/entities/mongo/schemas/UserInterestsSchema";
import {UserInterestsDataMapper} from "../../../infrastructure/dal/data_mapper/UserInterestsDataMapper";
import {InterestsRepository} from "../interests/InterestsRepository";
import {InterestsRepositoryImp} from "../interests/InterestsRepositoryImp";



@injectable()
export class UserInterestsRepositoryImp extends RepositoryImp<DomainUserInterests, DALUserInterests> implements UserInterestsRepository {

    interests: InterestsRepository;

    constructor(
        @inject(TYPES.ORMRepositoryForUserInterestsEntity) repository: MongoORMRepository<DALUserInterests>,
        @inject(TYPES.EntityDataMapperForUserInterests) dataMapper: UserInterestsDataMapper,
        @inject(TYPES.UserInterestSchema) model: UserInterestSchema,
        @inject(DOMAIN_TYPES.InterestsRepository) interests: InterestsRepositoryImp
    ) {
        super(repository, dataMapper, model);
        this.interests = interests;
    }

    public async add(object: DomainUserInterests): Promise<DomainUserInterests> {
        return await new Promise<DomainUserInterests>((resolve, reject) => {
            let newInterests = [];
            let counter = 0;

            object.interests.forEach((x) => {
               this.interests.findByOneKey({_id: x})
                   .then((res) => {
                       newInterests.push({interest: res._id, created_at: Date.now()});
                       counter++;
                       if (counter === object.interests.length){
                           object.interests = newInterests;
                           super.insert(object)
                               .then((res) => {
                                   resolve(res)
                               }).catch((err) => {
                               reject(err)
                           });
                       }
                   }).catch((err) => {
                       reject('insufficient interestId');
                   });
            });
        })
    }

    public async get(userId: string): Promise<DomainUserInterests> {
        return await super.findByOneKey({userId: userId});
    }

    public async removeOne(interestId: string, userId: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.findByOneKey({userId: userId})
                .then((res) => {
                    res.interests.splice(res.interests.findIndex(x => x.interest === interestId), 1);
                    super.update(res._id, res)
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