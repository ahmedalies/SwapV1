import {RepositoryImp} from "../base/RepositoryImp";
import {InterestsRepository} from "./InterestsRepository";
import {DomainInterest} from "../../entities/DomainInterest";
import {DALInterest} from "../../../infrastructure/entities/dal/DALInterest";
import {TYPES} from "../../../infrastructure/types";
import {inject, injectable} from "inversify";
import {InterestDataMapper} from "../../../infrastructure/data_mapper/InterestDataMapper";
import {InterestSchema} from "../../../infrastructure/entities/mongo/schemas/InterestSchema";
import {ORMRepository} from "../../../infrastructure/implementation/ORMRepository";
import { resolve } from "dns";

@injectable()
export class InterestsRepositoryImp extends RepositoryImp<DomainInterest, DALInterest> implements InterestsRepository {

    public constructor(
        @inject(TYPES.ORMRepositoryForInterestEntity) repository: ORMRepository<DALInterest>,
        @inject(TYPES.EntityDataMapperForInterests) dataMapper: InterestDataMapper,
        @inject(TYPES.InterestSchema) model: InterestSchema,
    ){
        super(repository, dataMapper, ['interests']);
    }

    public async addInterest(interest: DomainInterest): Promise<DomainInterest> {
        return await new Promise<DomainInterest>((resolve, reject) => {
            super.createSHA1Hash(interest.name)
                .then((res) => {
                    super.insert(['_id', 'name', 'nameAR', 'created_by', 'image_url'],
                     [res, interest.name, interest.nameAR, interest.created_by.id.toString(), interest.image_url])
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async getInterest(id: string): Promise<DomainInterest> {
        return await new Promise<DomainInterest>((resolve, reject) => {
            super.findOne([], ['_id'], [id], 0)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
            });
        });
    }

    public async getAllInterest(): Promise<DomainInterest[]> {
        return await new Promise<DomainInterest[]>((resolve, reject) => {
            super.findMany([], [], [], 0)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    public async updateInterest(id: string, interest: DomainInterest): Promise<DomainInterest> {
        return await new Promise<DomainInterest>((resolve, reject) => {
            super.update(['name', 'i_url'], [interest.name, interest.image_url], ['_id'], [id])
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