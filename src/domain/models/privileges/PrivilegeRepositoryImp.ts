import {RepositoryImp} from "../base/RepositoryImp";
import {DomainControlPrivilege} from "../../entities/DomainControlPrivilege";
import {DALControlPrivilege} from "../../../infrastructure/entities/dal/DALControlPrivilege";
import {PrivilegeRepository} from "./PrivilegeRepository";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../infrastructure/types";
import {PrivilegeDataMapper} from "../../../infrastructure/data_mapper/PrivilegeDataMapper";
import {ControlPrivilegeSchema} from "../../../infrastructure/entities/mongo/schemas/ControlPrivilegeSchema";
import {ORMRepository} from "../../../infrastructure/implementation/ORMRepository";

@injectable()
export class PrivilegeRepositoryImp extends RepositoryImp<DomainControlPrivilege, DALControlPrivilege> implements PrivilegeRepository {

    constructor(
        @inject(TYPES.ORMRepositoryForPrivilegeEntity) repository: ORMRepository<DALControlPrivilege>,
        @inject(TYPES.EntityDataMapperForPrivilege) dataMapper: PrivilegeDataMapper,
        @inject(TYPES.PrivilegeSchema) model: ControlPrivilegeSchema
    ){
        super(repository, dataMapper, ['controlprivileges']);
    }

    public async getPrivilege(p_name: string): Promise<DomainControlPrivilege> {
        return await new Promise<DomainControlPrivilege>((resolve, reject) => {
            super.findOne([], ['f_name'], [p_name], 0)
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