import {RepositoryImp} from "../base/RepositoryImp";
import {InterestsRepository} from "./InterestsRepository";
import {DomainInterest} from "../../entities/DomainInterest";
import {DALInterest} from "../../../infrastructure/entities/dal/DALInterest";
import {TYPES} from "../../../infrastructure/types";
import {inject, injectable} from "inversify";
import {InterestDataMapper} from "../../../infrastructure/dal/data_mapper/InterestDataMapper";
import {MongoORMRepository} from "../../../infrastructure/dal/implementation/MongoORMRepository";
import {InterestSchema} from "../../../infrastructure/entities/mongo/schemas/InterestSchema";
import {PrivilegeRepository} from "../privileges/PrivilegeRepository";
import {TYPES as DOMAIN_TYPES} from "../../types";

@injectable()
export class InterestsRepositoryImp extends RepositoryImp<DomainInterest, DALInterest> implements InterestsRepository {

    public constructor(
        @inject(TYPES.ORMRepositoryForInterestEntity) repository: MongoORMRepository<DALInterest>,
        @inject(TYPES.EntityDataMapperForInterests) dataMapper: InterestDataMapper,
        @inject(TYPES.InterestSchema) model: InterestSchema,
    ){
        super(repository, dataMapper, model);
    }

    public async addInterest(interest: DomainInterest): Promise<DomainInterest> {
        return await new Promise<DomainInterest>((resolve, reject) => {
            super.insert(interest)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
            });
        });
    }

    public async getInterest(id: string): Promise<DomainInterest> {
            let query = {_id: id};
        return await new Promise<DomainInterest>((resolve, reject) => {
            super.findByOneKey(query)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
            });
        });
    }

    public async updateInterest(id: string, interest: DomainInterest): Promise<DomainInterest> {
        return await new Promise<DomainInterest>((resolve, reject) => {
            super.update(id, interest)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                reject(err);
            });
        });
    }

    public async deleteInterest(id: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            super.remove(id)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                reject(err);
            });
        });
    }
}