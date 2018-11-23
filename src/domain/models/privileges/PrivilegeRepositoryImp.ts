import {RepositoryImp} from "../base/RepositoryImp";
import {DomainControlPrivilege} from "../../entities/DomainControlPrivilege";
import {DALControlPrivilege} from "../../../infrastructure/entities/dal/DALControlPrivilege";
import {PrivilegeRepository} from "./PrivilegeRepository";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../infrastructure/types";
import {MongoORMRepository} from "../../../infrastructure/implementation/MongoORMRepository";
import {PrivilegeDataMapper} from "../../../infrastructure/data_mapper/PrivilegeDataMapper";
import {ControlPrivilegeSchema} from "../../../infrastructure/entities/mongo/schemas/ControlPrivilegeSchema";

@injectable()
export class PrivilegeRepositoryImp extends RepositoryImp<DomainControlPrivilege, DALControlPrivilege> implements PrivilegeRepository {

    constructor(
        @inject(TYPES.ORMRepositoryForPrivilegeEntity) repository: MongoORMRepository<DALControlPrivilege>,
        @inject(TYPES.EntityDataMapperForPrivilege) dataMapper: PrivilegeDataMapper,
        @inject(TYPES.PrivilegeSchema) model: ControlPrivilegeSchema
    ){
        super(repository, dataMapper, model);
    }

    public async getPrivilege(p_name: string): Promise<DomainControlPrivilege> {
        let query = {f_name: p_name};
        return await new Promise<DomainControlPrivilege>((resolve, reject) => {
            super.findByOneKey(query)
                .then((res) => {
                    if(res)
                        resolve(res);
                    else
                        reject('not found');
                }).catch((err) => {
                     reject(err);
            });
        });
    }
}